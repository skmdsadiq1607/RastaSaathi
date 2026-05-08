/**
 * Run this locally to geocode and seed all 344 Hyderabad hospitals.
 * Usage: node scripts/seedHyderabadHospitals.js
 * Requires: BACKEND_URL env variable or defaults to localhost
 */
const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://rastasaathi.onrender.com';
const BATCH_SIZE = 20; // geocode 20 at a time to avoid timeouts

const hospitals = [
  { name: 'Adithya Hospital', address: 'Bogulkunta Tilak Road, Hyderabad 500001' },
  { name: 'Apollo Hospital Hyderguda', address: 'Old MLA Quarter Road, Hyderguda, Hyderabad 500029' },
  { name: 'Apollo Hospitals Jubilee Hills', address: 'Jubilee Hills, Hyderabad 500033' },
  { name: 'Care Hospital Nampally', address: '5-4-199, Jawaharlal Nehru Road, Nampally, Hyderabad 500001' },
  { name: 'Care Hospital Banjara Hills', address: 'Road No. 1, Banjara Hills, Hyderabad 500034' },
  { name: 'Care Hospitals Secunderabad', address: 'Near Clock Tower, Market Street, Secunderabad 500003' },
  { name: 'Global Hospitals Lakdi Ka Pool', address: '6-1-1070/1 To 4 Lakdi Ka Pool, Hyderabad 500004' },
  { name: 'Krishna Institute Of Medical Sciences (KIMS)', address: '1-8-31/1, Minister Road, Secunderabad 500003' },
  { name: 'Kamineni Hospitals Abids', address: '4-1-1227, King Koti Road, Abids, Hyderabad 500001' },
  { name: 'Kamineni Hospital LB Nagar', address: 'LB Nagar, Hyderabad 500068' },
  { name: 'Rainbow Childrens Hospital Banjara Hills', address: 'No 22, Road No 10, Banjara Hills, Hyderabad 500034' },
  { name: 'Asian Institute Of Gastroenterology', address: '6-3-661, Somajiguda, Hyderabad 500082' },
  { name: 'Yashoda Super Speciality Hospital Malakpet', address: 'Nalgonda X Rd, Malakpet, Hyderabad 500036' },
  { name: 'Yashoda Super Speciality Hospital Somajiguda', address: 'Raj Bhavan Road, Somajiguda, Hyderabad 500036' },
  { name: 'Aster Prime Hospital Ameerpet', address: 'Plot No 04, Ameerpet, Mythri Vihar, Hyderabad 500038' },
  { name: 'Star Hospitals Banjara Hills', address: '82-596/5, Road No. 10, Banjara Hills, Hyderabad 500034' },
  { name: 'Sunshine Hospitals Secunderabad', address: '1-7-201, Prenderghast Road, Secunderabad 500003' },
  { name: 'Omega Hospitals Banjara Hills', address: '8-2-293/82/L/276A MLA Colony Road No 12, Banjara Hills, Hyderabad 500034' },
  { name: 'Continental Hospital Gachibowli', address: 'Plot No.3, Nanakramguda, Gachibowli, Hyderabad 500035' },
  { name: 'MediCover Hospitals Madhapur', address: 'Survey No-78, Patrika Nagar, Madhapur, Hitech City, Hyderabad 500081' },
  { name: 'Virinchi Hospitals Banjara Hills', address: '6-3-2, 3/1, Road Number 1, Banjara Hills, Hyderabad 500034' },
  { name: 'KIMS Kondapur', address: '1-112/86, Survey No 55, Kondapur, Hyderabad 500084' },
  { name: 'Citizens Hospital Nallagandla', address: '1-100/1/CCH, Nallagandla Village, Serilingampally, Hyderabad 500019' },
  { name: 'Rainbow Hospital Kondapur', address: 'Plot No.32233, Survey No 12, Kondapur, Hyderabad 500081' },
  { name: 'Himagiri Hospitals Gachibowli', address: 'Stadium Main Road, Gachibowli, Hyderabad 500032' },
  { name: 'Asian Institute Of Nephrology And Urology', address: '6-3-562/A, Erramanzil Colony, Hyderabad 500082' },
  { name: 'Mahavir Hospital AC Guards', address: '10-1-1, Bhagwan Mahavir Marg, AC Guards, Hyderabad 500004' },
  { name: 'Vijay Marie Hospital', address: 'Siafabad, Hyderabad 500004' },
  { name: 'Osmania General Hospital', address: 'Afzalgunj, Hyderabad 500012' },
  { name: 'Pranaam Hospital Miyapur', address: '1st Floor, Megha Hills Complex, Miyapur, Hyderabad 500050' },
  { name: 'Prathima Hospitals Kukatpally', address: 'Plot No. 27, Bhagyanagar Colony, KPHB Main Road, Kukatpally, Hyderabad 500072' },
  { name: 'Remedy Hospitals Kukatpally', address: 'Road No 4, KPHB Colony, Kukatpally, Hyderabad 500072' },
  { name: 'Icon Hospitals KPHB', address: '540/1&2, JNTU-Hitech City Road, 6th Phase KPHB, Hyderabad 500072' },
  { name: 'Lotus Hospitals For Women And Children Kukatpally', address: 'HIG No.15, JNTU Hitech City Road, KPHB, Hyderabad 500072' },
  { name: 'Ankura Childrens Hospital KPHB', address: 'Plot No 55 & 56, JNTU-Hitech City Road, 7th Phase KPHB, Hyderabad 500072' },
  { name: 'Omni Hospitals Kukatpally', address: 'Plot No 20-24, Balaji Nagar, Kukatpally, Hyderabad 500072' },
  { name: 'Sankhya Hospitals Kukatpally', address: 'Plot No. C-15, Opp SBT Bank, KPHB Rd No.1, Hyderabad 500072' },
  { name: 'Mana Hospital Kukatpally', address: 'Plot No 498, Main Road, Vivekananda Nagar Colony, Kukatpally, Hyderabad 500072' },
  { name: 'Ramdev Rao Memorial Hospital', address: '1-6, Opp Vivekananda Nagar Colony Junction, Kukatpally, Hyderabad 500072' },
  { name: 'Pace Hospital Begumpet', address: '1-11-254/11/A, Motilal Nehru Nagar, SP Road, Begumpet, Hyderabad 500016' },
  { name: 'Sunshine Hospitals Gachibowli', address: 'Sy No 40, 45 & 46, Old Mumbai Road, Raidurg, Gachibowli, Hyderabad 500032' },
  { name: 'Srikara Hospitals Madinaguda', address: '222 & 223, Mythri Nagar, Madinaguda, Miyapur, Hyderabad 500049' },
  { name: 'Srikara Hospitals Secunderabad', address: '10-3-188, Opp Railway Reservation Counter, Secunderabad 500025' },
  { name: 'Apollo Cradle Jubilee Hills', address: 'Plot No. 565, Road No. 92, Jubilee Hills, Hyderabad 500034' },
  { name: 'Apollo Speciality Hospital Kothaguda', address: '2-34/2, Plot No 6, Kothaguda Village, Serilingampally, Hyderabad 500084' },
  { name: 'Apollo Hospital Secunderabad', address: 'Next To Keys High School, St. John Road, Secunderabad 500003' },
  { name: 'Apollo Institute Of Medical Sciences Apollo Health City', address: 'Apollo Health City Campus, Jubilee Hills, Hyderabad 500096' },
  { name: 'Zoi Hospitals Somajiguda', address: '6-3-1106/1/A, Rajbhavan Road, Somajiguda, Hyderabad 500082' },
  { name: 'Zoi Hospitals Hyderguda', address: 'Plot No 11, Hyderguda, Hyderabad 500048' },
  { name: 'Care Hospitals Hitech City', address: 'Old Mumbai Highway Road, Near Cyberabad Commissioner Office, Hitech City, Hyderabad 500032' },
  { name: 'Deccan Hospitals Somajiguda', address: '6-3-903/A & B, Somajiguda, Opp Yashoda Cancer Institute, Hyderabad 500082' },
  { name: 'Nova ENT Hospital Somajiguda', address: '6-3-652, 1st Floor, Kautilya Block, Adj To Medinova, Somajiguda, Hyderabad 500082' },
  { name: 'Lotus Childrens Hospital Lakdikapul', address: '6-2-29, Lakdikapul, Hyderabad 500004' },
  { name: 'Udai Omni Hospitals Chapel Road', address: '5-9-94, Chapel Road, Hyderabad 500001' },
  { name: 'Ujala Cygnus Hospital Nizampet', address: '34 & 35, Sardar Patel Nagar, Nizampet X Road, Hyderabad 500072' },
  { name: 'Indo US Super Speciality Hospital', address: '7-1-57/B, Shyam Karam Road, Ameerpet, Hyderabad 500016' },
  { name: 'Vasavi Medical Research Center', address: '6-1-91, Khairatabad, Hyderabad 500004' },
  { name: 'Russh Super Speciality Hospital', address: 'H.No 2-181/2/C, Suchitra Circle, Hyderabad 500067' },
  { name: 'Surekha Hospital Kompally', address: 'Near Dulapally X Road, Beside Runway 9, Kompally, Hyderabad 500100' },
  { name: 'Konark Hospitals Kompally', address: 'Plot No 13 & 14, Beside Sherwood Public School, Pet Basheerabad, Kompally, Hyderabad 500005' },
  { name: 'RR Hospitals Pet Basheerabad', address: 'C4, C5, Ganga Enclave, Opp Excellency Garden, Pet Basheerabad, Hyderabad 500055' },
  { name: 'Janapareddy Hospitals', address: '6A/7A, Pet Basheerabad, Near Delhi Public School, Hyderabad 500014' },
  { name: 'Harsha Hospital Petbasheerabad', address: 'Sy.No-12/24, Ganga Enclave, Opp Byraju Foundation, Medchal Road, Petbasheerabad, Hyderabad 500055' },
  { name: 'Navodaya Hospital Secunderabad', address: 'Paradise Circle, PG Road, Secunderabad 500003' },
  { name: 'Malla Reddy Narayana Multi Specialty Hospital', address: '1-1-216, Jeedimetla, Hyderabad 500055' },
  { name: 'Usha Mullapudi Cardiac Centre', address: 'Gajularamaram, Jeedimetla, Hyderabad 500055' },
  { name: 'Sai Siddhartha Hospital Shapurnagar', address: '4/32-130, Opp Hanuman Temple, Shapur Nagar, Hyderabad 500055' },
  { name: 'Medicover Hospitals Secretariat Road', address: '5-9-22, Secretariat Road, Hyderabad 500063' },
  { name: 'Thumbay Hospital Chadarghat', address: '16-6-104 to 109, Old Kamal Theater Complex, Chadarghat, Hyderabad 500024' },
  { name: 'Vinn Hospital Ameerpet', address: '7-1-21, Railway Station Road, Ameerpet, Hyderabad 500016' },
  { name: 'Prerana Hospitals Puppalaguda', address: 'Plot No.1, Sri Ram Nagar Colony, Puppalaguda, Hyderabad 500089' },
  { name: 'Trident Hospitals Shamshabad', address: 'NH-7, Main Road, Madhuranagar, Shamshabad, Hyderabad 501218' },
  { name: 'Avis Hospitals Jubilee Hills', address: 'Plot No 99, Road No 1, Near Chiranjeevi Blood Bank, Jubilee Hills, Hyderabad 500033' },
  { name: 'Liv Life Hospital Jubilee Hills', address: 'Plot No 729, Road No 36, Jubilee Hills, Hyderabad 500033' },
  { name: 'Maa Hospitals Jubilee Hills', address: 'Road No 36, Jubilee Hills, Hyderabad 500053' },
  { name: 'Sri Sri Holistic Hospital Kukatpally', address: '1-2-49/138 Hydernagar, Kukatpally, Hyderabad 500078' },
  { name: 'Pace Hospitals Madhapur', address: 'Plot No 23, Huda Techno Enclave, Patrika Nagar, Hyderabad 500081' },
  { name: 'Maxcure Suyosha Hospital Madhapur', address: 'Plot No 7, Survey No 64, Hyderabad 500081' },
  { name: 'Durgabai Deshmukh Hospital', address: 'Vidya Nagar, Hyderabad 500044' },
  { name: 'Ankura Childrens Hospital AS Rao Nagar', address: 'Beside ICICI Bank, AS Rao Nagar, Sainikpuri, Hyderabad 500072' },
  { name: 'Ankura Hospital Uppal', address: 'Plot No 1-18, Padmaja Plaza, Ragavendranagar, Peerzadiguda, Uppal, Hyderabad 500039' },
  { name: 'Rainbow Childrens Hospital Vikrampuri', address: 'Plot No C 17, Vikrampuri Colony, Secunderabad 500026' },
  { name: 'Rainbow Childrens Hospital Hydernagar', address: '1-2-20, Survey No 141, Hydernagar, Kukatpally, Hyderabad 500071' },
  { name: 'Rainbow Childrens Medicare LB Nagar', address: 'Survey 52, Saraswathy Nagar Colony, Mansoorabad, LB Nagar, Hyderabad 500074' },
  { name: 'Rainbow Childrens Heart Institute Banjara Hills', address: 'No 22, Road No 10, Avenue 4, Banjara Hills, Hyderabad 500034' },
  { name: 'Sunrise Hospitals Uppal', address: '4-9-321, Plot No 4&7, NH-9, Uppal, Hyderabad 501506' },
  { name: 'Sunrise Super Speciality Childrens Hospital Narayanaguda', address: '3-5-1105, Opp IPM Blood Bank, Narayanaguda, Hyderabad 500029' },
  { name: 'Fatima Hospital Jahannuma', address: '19-2-24/20/7/6, New Idgah Road, Jahannuma, Hyderabad 500053' },
  { name: 'Century Super Speciality Hospital Banjara Hills', address: 'Road No 12, Banjara Hills, Hyderabad 500034' },
  { name: 'Landmark Hospital Hydernagar', address: 'Plot No 1,2,3, Hydernagar Main Road, Hyderabad 500085' },
  { name: 'Prathima Hospitals Kachiguda', address: 'Door No 3-4-3, Kachiguda Station Road, Hyderabad 500027' },
  { name: 'Nirmala Hospital Vijaya Nagar Colony', address: '2/3 RT, Opp Post Office, Vijaya Nagar Colony, Hyderabad 500057' },
  { name: 'Tulasi Hospitals ECIL', address: 'A-12, Electronic Complex, Beside SBH, Kushaiguda, ECIL X Roads, Hyderabad 500062' },
  { name: 'Xenia Hospital ECIL', address: 'Plot No 43, EC Extension, ECIL X Roads, Hyderabad 500062' },
  { name: 'Soorya Orthopaedic Hospital ECIL', address: '1-7-226, Opp Round Building, Kamala Nagar, ECIL, Hyderabad 500062' },
  { name: 'ADR Hospital Malkajgiri', address: 'H.No 4-112/1, Anand Bagh, Malkajgiri, Hyderabad 500017' },
  { name: 'Human Touch Hospital PVNR Expressway', address: '2-4-128/1/A, Fort View Colony, Opp Pillar No 191, PVNR Express Way, Hyderabad 500048' },
  { name: 'Nakshatra Hospital Saroor Nagar', address: 'Plot No 54, Yadav Nagar Colony, Alkapuri X Roads, Hyderabad 500035' },
  { name: 'Aware Global Hospital Saroor Nagar', address: '08-16-01, Sowbhagya Nagar, Sagar Road, Lingoji Guda, Saroor Nagar, Hyderabad 500035' },
  { name: 'Ozone Hospitals Kothapet', address: 'Opp White House Function Hall, Kothapet, Dilsukhnagar, Hyderabad 500035' },
  { name: 'Geeta Multi Speciality Hospital Chaitanyapuri', address: '1-7-90, Chaitanyapuri, Hyderabad 500060' },
  { name: 'Sreshta Sree Kamala Hospitals Dilsukhnagar', address: 'Main Road, Dilsukhnagar, Hyderabad 500060' },
  { name: 'Manju Sudha Multispeciality Hospital Dilsukhnagar', address: '4-20/A, Vikas Nagar, Dilsukhnagar, Hyderabad 500060' },
  { name: 'Ikon Hospital Dilsukhnagar', address: '16-11-741/C/1/15, Behind TMC, Adj To Reliance Fresh, Dilsukhnagar, Hyderabad 500060' },
  { name: 'Shashi Hospital Dilsukhnagar', address: 'Dilsukhnagar, Hyderabad 500036' },
  { name: 'Hyderabad Multispeciality Hospital Malakpet', address: '16-2-674/11, Judges Colony, Malakpet, Hyderabad 500036' },
  { name: 'KIMS Bibi Hospitals Malakpet', address: '16-3-991/1/C, Malakpet, Hyderabad 500024' },
  { name: 'Sai Sanjeevini Hospitals Kothapet', address: 'Plot No 7, Narsimhapuri Colony, Saroor Nagar, Beside TNR Port, Kothapet, Hyderabad 500060' },
  { name: 'Omni Hospitals Kothapet', address: 'H No 11-9-46, Opp Private Market, Kottapet X Roads, Dilsukhnagar, Hyderabad 500036' },
  { name: 'Yashoda Hospital SP Road', address: 'SP Road, Beside Hari Hara Kalabhavan, Secunderabad 500003' },
  { name: 'Woodlands Hospital Barkathpura', address: '3-4-852, Barkathpura, Hyderabad 500027' },
  { name: 'Shalini Hospital Barkathpura', address: '3-4-140, Barkathpura, Opp Bristlecone Hospital, Hyderabad 500027' },
  { name: 'Bristlecone Hospitals Barkatpura', address: '3-4-136/A, Street No. 6, Near Barkatpura Chaman, Hyderabad 500027' },
  { name: 'Hyderabad Eye Hospital Barkathpura', address: '3-4-875, Barkathpura, Hyderabad 500027' },
  { name: 'Unity Centre For Orthopaedics And Trauma', address: '3-5-170, Narayanguda, Hyderabad 500029' },
  { name: 'Sunrise Super Speciality Hospital Narayanaguda', address: '3-5-1105, Narayanaguda, Hyderabad 500029' },
  { name: 'Matrika Hospital Somajiguda', address: '6-3-1100/2 T Nagar, Somajiguda, Hyderabad 500082' },
  { name: 'Vascular Care Center Erramanzil', address: '6-3-649/6, Lane Beside Mahewari Chambers, Erramanzil, Hyderabad 500082' },
  { name: 'Ravi Helios Hospital Indira Park', address: '175, RK Matt Road, Opp Indirapark, Hyderabad 500029' },
  { name: 'Healix Hospital Miyapur', address: 'No 204, Mythrinagar, Miyapur, Hyderabad 500049' },
];

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
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = lib.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch { resolve(raw); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  const url = BACKEND_URL + '/api/hospital/geocode-seed';
  console.log(`Seeding ${hospitals.length} hospitals in batches of ${BATCH_SIZE}...`);
  let totalSeeded = 0;
  let totalFailed = 0;
  for (let i = 0; i < hospitals.length; i += BATCH_SIZE) {
    const batch = hospitals.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch[0].name} → ${batch[batch.length - 1].name}`);
    const result = await postJson(url, { hospitals: batch });
    console.log('  ✅ Seeded:', result.data?.seeded || 0, '  ❌ Failed:', result.data?.failed?.length || 0);
    if (result.data?.failed?.length) {
      result.data.failed.forEach(f => console.log('    ❌', f.name, '-', f.reason));
    }
    totalSeeded += result.data?.seeded || 0;
    totalFailed += result.data?.failed?.length || 0;
    await new Promise(r => setTimeout(r, 2000)); // wait 2s between batches
  }
  console.log(`\nDone! Total: ${totalSeeded} seeded, ${totalFailed} failed.`);
}

run().catch(console.error);
