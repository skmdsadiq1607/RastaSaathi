/**
 * DIRECT MongoDB seed — no HTTP server needed.
 * Reads hospitals.txt, geocodes via Google Maps, saves directly to MongoDB.
 * Run: node scripts/seedDirect.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Client } = require('@googlemaps/google-maps-services-js');

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
const MONGO_URI  = process.env.MONGODB_URI;
const TXT_FILE   = path.join(__dirname, 'hospitals.txt');
const BATCH_SIZE = 10;
const DELAY_MS   = 1200; // stay under geocoding quota

// ── Minimal Hospital Schema ───────────────────────────────────────────────────
const hospitalSchema = new mongoose.Schema({
  name:               { type: String, required: true, unique: true },
  address:            String,
  location:           { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } },
  specialties:        [String],
  icuBeds:            { type: Number, default: 10 },
  traumaCenter:       { type: Boolean, default: false },
  bloodBankAvailable: { type: Boolean, default: true },
  phone:              { type: String, default: '108' },
  emergencyContact:   { type: String, default: '108' },
  region:             { type: String, default: 'Hyderabad' },
  active:             { type: Boolean, default: true },
}, { timestamps: true });
hospitalSchema.index({ location: '2dsphere' });
const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', hospitalSchema, 'hospitals');

// ── Parse raw text ────────────────────────────────────────────────────────────
function parseHospitalText(content) {
  const hospitals = [];
  const lines = content.split('\n').map(l => l.replace(/\r/g, '').trim()).filter(Boolean);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^s\.?no\.?\s+hospital/i.test(line) || /^s\s+no\s+hospital/i.test(line)) { i++; continue; }
    const numMatch = line.match(/^(\d+)\s+(.+)/);
    if (!numMatch) { i++; continue; }
    const sno = parseInt(numMatch[1]);
    if (sno < 1 || sno > 600) { i++; continue; }

    let collected = line;
    let j = i + 1;
    while (j < lines.length) {
      const nextLine = lines[j];
      const nextNum = nextLine.match(/^(\d+)\s+/);
      if (nextNum && parseInt(nextNum[1]) > sno) break;
      collected += ' ' + nextLine;
      j++;
      if (/telangana\s+hyderabad\s+\d{5}/i.test(collected)) break;
    }
    i = j;

    const pinMatch = collected.match(/\b(\d{6})\b/g);
    const pin = pinMatch ? pinMatch[0] : '500001';
    const stateIdx = collected.search(/\btelangana\b/i);
    let body = stateIdx > 0 ? collected.substring(0, stateIdx).trim() : collected;
    body = body.replace(/^\d+\s+/, '').trim();

    const addrPattern = /(\bplot\b|\broad\b|\b#\b|\bh\.?no\b|\bsurvey\b|\b\d+-\d+\b|\b\d+\/\d+\b|\bmig\b|\bhig\b|\blig\b|\bopp\b|\bnear\b|\bbeside\b|\blane\b|\d+,)/i;
    const addrMatch = body.match(addrPattern);
    let name = '', address = '';
    if (addrMatch) {
      const idx = body.indexOf(addrMatch[0]);
      name = body.substring(0, idx).trim();
      address = body.substring(idx).trim();
    } else {
      const words = body.split(/\s+/);
      name = words.slice(0, 5).join(' ');
      address = words.slice(5).join(' ');
    }
    if (!name || name.length < 3) continue;
    hospitals.push({ name: name.trim(), address: address.trim() || name, pin });
  }
  return hospitals;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  if (!GOOGLE_KEY) { console.error('❌ GOOGLE_MAPS_API_KEY not set in .env'); process.exit(1); }
  if (!MONGO_URI)  { console.error('❌ MONGODB_URI not set in .env'); process.exit(1); }
  if (!fs.existsSync(TXT_FILE)) { console.error(`❌ Not found: ${TXT_FILE}`); process.exit(1); }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected!\n');

  const content = fs.readFileSync(TXT_FILE, 'utf8');
  const hospitals = parseHospitalText(content);
  console.log(`📋 Parsed ${hospitals.length} hospitals\n`);

  const client = new Client({});
  let seeded = 0, failed = 0;

  for (let i = 0; i < hospitals.length; i += BATCH_SIZE) {
    const batch = hospitals.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const total    = Math.ceil(hospitals.length / BATCH_SIZE);
    console.log(`🔄 Batch ${batchNum}/${total}`);

    for (const h of batch) {
      const fullAddress = `${h.address}, Hyderabad, Telangana ${h.pin}, India`.replace(/\s+/g, ' ').trim();
      try {
        const geo = await client.geocode({ params: { address: fullAddress, key: GOOGLE_KEY }, timeout: 6000 });
        const result = geo.data.results[0];
        if (!result) { console.log(`  ❌ No geocode: ${h.name}`); failed++; continue; }
        const { lat, lng } = result.geometry.location;
        await Hospital.findOneAndUpdate(
          { name: h.name },
          {
            name: h.name, address: fullAddress,
            location: { type: 'Point', coordinates: [lng, lat] },
            specialties: ['emergency medicine', 'general surgery', 'critical care'],
            icuBeds: 10, traumaCenter: false, bloodBankAvailable: true,
            phone: '108', emergencyContact: '108', region: 'Hyderabad', active: true
          },
          { upsert: true, new: true }
        );
        console.log(`  ✅ ${h.name}`);
        seeded++;
      } catch (err) {
        console.log(`  ❌ ${h.name}: ${err.message}`);
        failed++;
      }
      await sleep(200); // small delay per item
    }
    if (i + BATCH_SIZE < hospitals.length) await sleep(DELAY_MS);
  }

  console.log(`\n🏁 Done! ✅ Seeded: ${seeded}  ❌ Failed: ${failed}  Total: ${hospitals.length}`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
