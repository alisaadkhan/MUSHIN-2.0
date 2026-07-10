/**
 * Reservation Sweeper Worker
 *
 * Scheduled worker that expires stale credit reservations.
 * Per ADR-030: TTL sweeper is the ONLY release mechanism.
 * Runs every 30 minutes to clean up reservations older than TTL.
 *
 * This is a scheduled task, not an event consumer.
 */
import type { Database } from '@mushin/database';
import { sql } from 'drizzle-orm';

// ── Configuration ────────────────────────────────────────────

const DEFAULT_TTL_MINUTES = 30;

// ── Worker ───────────────────────────────────────────────────

export async function runReservationSweeper(
  db: Database,
  ttlMinutes: number = DEFAULT_TTL_MINUTES,
): Promise<{
  expired: number;
  errors: number;
}> {
  let expired = 0;
  let errors = 0;

  const cutoff = new Date(Date.now() - ttlMinutes * 60 * 1000);

  try {
    // Find stale reservations: 'reserved' entries older than TTL
    // without a matching 'committed' or 'released' entry
    const staleReservations = await db.execute(sql`
      SELECT r.workspace_id, r.amount, r.reference_type, r.reference_id
      FROM wp.credit_ledger_entry r
      WHERE r.entry_type = 'reserved'
        AND r.created_at < ${cutoff}
        AND NOT EXISTS (
          SELECT 1 FROM wp.credit_ledger_entry c
          WHERE c.entry_type IN ('committed', 'released')
            AND c.reference_id = r.reference_id
            AND c.workspace_id = r.workspace_id
        )
    `);

    for (const row of staleReservations) {
      const workspaceId = row['workspace_id'] as string;
      const amount = BigInt(row['amount'] as string);
      const referenceType = row['reference_type'] as string;
      const referenceId = row['reference_id'] as string;

      try {
        // Release the reserved credits back to balance
        await db.execute(sql`
          UPDATE wp.workspace_credit_balance
          SET balance = balance + ${Number(amount)},
              version = version + 1,
              updated_at = NOW()
          WHERE workspace_id = ${workspaceId}
        `);

        // Record release in ledger
        await db.execute(sql`
          INSERT INTO wp.credit_ledger_entry (
            workspace_id, entry_type, amount, reference_type, reference_id, description
          ) VALUES (
            ${workspaceId}, 'released', ${Number(amount)}, ${referenceType}, ${referenceId},
            'Reservation expired by TTL sweeper'
          )
        `);

        expired++;
      } catch (err) {
        errors++;
        console.error(JSON.stringify({
          ts: new Date().toISOString(),
          level: 'error',
          service: 'reservation-sweeper',
          message: `Failed to expire reservation ${referenceId} for workspace ${workspaceId}`,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    }
  } catch (err) {
    errors++;
    console.error(JSON.stringify({
      ts: new Date().toISOString(),
      level: 'error',
      service: 'reservation-sweeper',
      message: 'Failed to query stale reservations',
      error: err instanceof Error ? err.message : 'Unknown error',
    }));
  }

  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    level: 'info',
    service: 'reservation-sweeper',
    message: `Sweeper completed: ${expired} expired, ${errors} errors`,
    ttlMinutes,
  }));

  return { expired, errors };
}
