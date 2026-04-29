const fs = require('fs');
const path = require('path');

const ocPath = path.join(process.env.USERPROFILE, '.openclaw', 'openclaw.json');
const qcPath = path.join(process.env.USERPROFILE, '.qclaw', 'openclaw.json');

// Restore from bak if qc file is empty/broken
let qc;
try {
  const qcRaw = fs.readFileSync(qcPath, 'utf8');
  qc = JSON.parse(qcRaw);
  if (!qcRaw || qcRaw.trim().length === 0) throw new Error('empty file');
} catch (e) {
  console.log('QC config broken, restoring from bak...');
  const bakPath = qcPath + '.bak';
  fs.copyFileSync(bakPath, qcPath);
  qc = JSON.parse(fs.readFileSync(qcPath, 'utf8'));
}

const oc = JSON.parse(fs.readFileSync(ocPath, 'utf8'));

console.log('OC token:', oc.gateway.auth.token);
console.log('QC token (before):', qc.gateway.auth.token);

// Unify token
qc.gateway.auth.token = oc.gateway.auth.token;

fs.writeFileSync(qcPath, JSON.stringify(qc, null, 2), 'utf8');

// Verify
const qc2 = JSON.parse(fs.readFileSync(qcPath, 'utf8'));
console.log('QC token (after):', qc2.gateway.auth.token);
console.log('Match:', oc.gateway.auth.token === qc2.gateway.auth.token);
console.log('Done!');
