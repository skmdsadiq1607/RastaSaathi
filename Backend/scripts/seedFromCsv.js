/**
 * Reads hospitals.txt (raw copy-paste from the PDF/document) and geocode-seeds all entries.
 *
 * HOW TO USE:
 *   1. Copy ALL the hospital table text (the S.No, Hospital Name, Address... data)
 *   2. Paste it into a new Notepad file
 *   3. Save as: Backend/scripts/hospitals.txt  (choose "All Files" to avoid .txt.txt)
 *   4. Run: node scripts/seedFromCsv.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://rastasaathi.onrender.com';
const TXT_FILE = path.join(__dirname, 'hospitals.txt');
const BATCH_SIZE = 15;
const DELAY_MS = 2500;

function parseHospitalText(content) {
  const hospitals = [];
  const lines = content.split('\n').map(l => l.replace(/\r/g, '').trim()).filter(Boolean);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip header line
    if (/^s\.?no\.?\s+hospital/i.test(line) || /^s\s+no\s+hospital/i.test(line)) { i++; continue; }

    // Check if line starts with a row number
    const numMatch = line.match(/^(\d+)\s+(.+)/);
    if (!numMatch) { i++; continue; }

    const sno = parseInt(numMatch[1]);
    if (sno < 1 || sno > 600) { i++; continue; }

    // Collect all tokens from this line and possibly next lines
    // until we hit the next numbered entry or end
    let collected = line;
    let j = i + 1;
    while (j < lines.length) {
      const nextLine = lines[j];
      const nextNum = nextLine.match(/^(\d+)\s+/);
      if (nextNum && parseInt(nextNum[1]) === sno + 1) break;
      if (nextNum && parseInt(nextNum[1]) > sno) break;
      // Stop if line looks like state/city/pin pattern at the end
      collected += ' ' + nextLine;
      j++;
      // If we've collected enough and found Telangana/pin pattern, stop
      if (/telangana\s+hyderabad\s+\d{6}/i.test(collected)) break;
    }
    i = j;

    // Extract pin code (6-digit number before the Rohini ID)
    const pinMatch = collected.match(/\b(\d{6})\b/g);
    const pin = pinMatch ? pinMatch[0] : '';

    // Extract "Telangana Hyderabad XXXXXX" block to find the boundary
    const stateIdx = collected.search(/\btelangana\b/i);
    let body = stateIdx > 0 ? collected.substring(0, stateIdx).trim() : collected;

    // Remove leading serial number
    body = body.replace(/^\d+\s+/, '').trim();

    // The body now contains: HospitalName ... Address
    // Heuristic: hospital names are usually 2-6 words, addresses start with numbers or "Plot", "Road", "#", etc.
    // Split at first address indicator
    const addrPattern = /(\bplot\b|\broad\b|\b#\b|\bh\.?no\b|\bsurvey\b|\bflat\b|\bsector\b|\b\d+-\d+\b|\b\d+\/\d+\b|\bmig\b|\bhig\b|\blig\b|\bopp\b|\bnear\b|\bbeside\b|\blane\b|\bst\.?\b|\bdr\.?\b\s+a|\d+,)/i;
    const addrMatch = body.match(addrPattern);

    let name = '', address = '';
    if (addrMatch) {
      const idx = body.indexOf(addrMatch[0]);
      // Walk back to find a clean split point
      name = body.substring(0, idx).trim();
      address = body.substring(idx).trim();
    } else {
      // Fallback: first 4-5 words = name, rest = address
      const words = body.split(/\s+/);
      const nameWords = words.slice(0, 5);
      name = nameWords.join(' ');
      address = words.slice(5).join(' ');
    }

    // Clean up name (remove trailing "pvt ltd" fragments that belong to name)
    name = name.replace(/\s*(pvt\.?\s*ltd\.?|private\s+limited)\s*$/i, (m) => m).trim();

    // Skip if name is empty or looks wrong
    if (!name || name.length < 3) continue;

    hospitals.push({ name: name.trim(), address: address.trim() || name, pin: pin || '500001' });
  }

  return hospitals;
}

async function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 60000
    };
    const req = lib.request(options, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch { resolve({ raw }); } });
    });
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timed out')));
    req.write(body);
    req.end();
  });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  if (!fs.existsSync(TXT_FILE)) {
    console.error(`❌ File not found: ${TXT_FILE}`);
    console.error('Steps:');
    console.error('  1. Open Notepad');
    console.error('  2. Paste the hospital table data');
    console.error('  3. Save As > hospitals.txt in Backend/scripts/ folder');
    console.error('     (Set "Save as type" to "All Files" to avoid hospitals.txt.txt)');
    process.exit(1);
  }

  const content = fs.readFileSync(TXT_FILE, 'utf8');
  const hospitals = parseHospitalText(content);
  console.log(`📋 Parsed ${hospitals.length} hospitals from text file`);

  if (hospitals.length === 0) {
    console.error('❌ No hospitals parsed. Check that the file contains the correct data.');
    process.exit(1);
  }

  // Preview first 3
  console.log('\nPreview (first 3):');
  hospitals.slice(0, 3).forEach((h, i) => console.log(`  ${i+1}. ${h.name} | ${h.address} | PIN:${h.pin}`));
  console.log('');

  const payload = hospitals.map(h => ({
    name: h.name,
    address: `${h.address}, Hyderabad, Telangana ${h.pin}, India`.replace(/\s+/g, ' ').trim(),
    region: 'Hyderabad',
    specialties: ['emergency medicine', 'general surgery', 'critical care'],
    icuBeds: 10,
    traumaCenter: false,
    bloodBankAvailable: true
  }));

  const url = `${BACKEND_URL}/api/hospital/geocode-seed`;
  let totalSeeded = 0, totalFailed = 0;

  for (let i = 0; i < payload.length; i += BATCH_SIZE) {
    const batch = payload.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(payload.length / BATCH_SIZE);
    console.log(`🔄 Batch ${batchNum}/${totalBatches}: ${batch[0].name} → ${batch[batch.length-1].name}`);
    try {
      const result = await postJson(url, { hospitals: batch });
      const seeded = result.data?.seeded || 0;
      const failed = result.data?.failed || [];
      console.log(`  ✅ Seeded: ${seeded}  ❌ Failed: ${failed.length}`);
      failed.forEach(f => console.log(`    ❌ ${f.name}: ${f.reason}`));
      totalSeeded += seeded;
      totalFailed += failed.length;
    } catch (err) {
      console.log(`  ⚠️  Error: ${err.message} — retrying...`);
      await sleep(5000);
      try {
        const result = await postJson(url, { hospitals: batch });
        totalSeeded += result.data?.seeded || 0;
        totalFailed += (result.data?.failed || []).length;
      } catch (e2) {
        console.log(`  ❌ Batch failed: ${e2.message}`);
        totalFailed += batch.length;
      }
    }
    if (i + BATCH_SIZE < payload.length) await sleep(DELAY_MS);
  }

  console.log(`\n✅ Done! Seeded: ${totalSeeded}  Failed: ${totalFailed}  Total: ${payload.length}`);
}

run().catch(console.error);
