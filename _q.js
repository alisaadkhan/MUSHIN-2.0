const {DatabaseSync} = require('node:sqlite');
const db = new DatabaseSync('C:\\Users\\SHURA\\.local\\share\\mimocode\\mimocode.db', {open: true, readOnly: true});
const r = db.prepare("SELECT count(1) as c FROM session WHERE directory LIKE '%mushin%'").get();
console.log('Sessions:', r.c);
const r2 = db.prepare("SELECT id, title, time_created FROM session WHERE directory LIKE '%mushin%' AND title NOT LIKE '%checkpoint%' ORDER BY time_created DESC LIMIT 10").all();
r2.forEach(row => console.log(row.id, row.title, new Date(row.time_created).toISOString()));
db.close();
