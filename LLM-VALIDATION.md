# LLM-VALIDATION.md

*Generated: 2026-07-09*

---

## Groq

| Test | Status | Evidence |
|------|--------|----------|
| Connection | ✅ VERIFIED | API responded successfully |
| Completion | ✅ VERIFIED | llama-3.1-8b-instant returned "OK" |
| Latency | ✅ VERIFIED | 999ms for completion |
| Token accounting | ✅ VERIFIED | Response included usage data |

### Configuration
```
Model: llama-3.1-8b-instant (T-A tier)
Key: gsk_nVdK...fmr
Latency: 999ms
```

### Evidence
```json
{
  "model": "llama-3.1-8b-instant",
  "choices": [{"message": {"content": "OK"}}],
  "usage": {"prompt_tokens": 12, "completion_tokens": 1, "total_tokens": 13}
}
```

---

## Anthropic

| Test | Status | Evidence |
|------|--------|----------|
| Connection | ❌ FAILED | HTTP 401 — "invalid x-api-key" |
| Completion | ⏳ BLOCKED | Needs valid key |

### Configuration
```
Key: deae52...3Q (appears invalid)
Latency: N/A
```

### Note
User indicated this key is for Ollama, not Anthropic API. Anthropic requires a different key format.

---

## Ollama

| Test | Status | Evidence |
|------|--------|----------|
| Local connection | ⏳ UNTESTED | No local Ollama instance configured |
| Model availability | ⏳ UNTESTED | Needs OLLAMA_HOST in .env |

---

## HuggingFace

| Test | Status | Evidence |
|------|--------|----------|
| Connection | ✅ VERIFIED | API key valid, HTTP 200 |
| Inference | ⏳ UNTESTED | Needs model endpoint test |

---

## Status Summary

| Provider | Status |
|----------|--------|
| Groq | ✅ VERIFIED |
| Anthropic | ❌ FAILED (wrong key) |
| HuggingFace | ✅ VERIFIED |
| Ollama | ⏳ UNTESTED |
