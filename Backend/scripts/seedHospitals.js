const { connectDb, disconnectDb } = require('../src/config/db');
const Hospital = require('../src/modules/hospital/hospital.model');
const Resources = require('../src/modules/resources/resources.model');
const { toPoint } = require('../src/utils/geoUtils');
const logger = require('../src/utils/logger');

const hospitals = [
  { name: 'Yashoda Hospitals, Secunderabad', address: 'Alexander Road, Kummari Guda, Shivaji Nagar, Secunderabad, Telangana 500003', lat: 17.4418003, lng: 78.4971353, specialties: ['trauma', 'emergency medicine', 'orthopedics', 'neurosurgery', 'critical care'], icuBeds: 28, traumaCenter: true, bloodBankAvailable: true, phone: '04045674567', emergencyContact: '04045674567', region: 'Secunderabad', resources: { icuBeds: 28, ventilators: 18, bloodUnits: { A: 32, B: 26, O: 44, AB: 12 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: "NIMS (Nizam's Institute of Medical Sciences), Hyderabad", address: 'NIMS, Punjagutta, Hyderabad, Telangana 500082', lat: 17.4219081, lng: 78.4515489, specialties: ['emergency medicine', 'neurosurgery', 'orthopedics', 'vascular surgery', 'critical care'], icuBeds: 34, traumaCenter: true, bloodBankAvailable: true, phone: '04023489000', emergencyContact: '04023489244', region: 'Punjagutta', resources: { icuBeds: 34, ventilators: 22, bloodUnits: { A: 40, B: 31, O: 55, AB: 14 }, ambulancesAvailable: 6, traumaTeamOnDuty: true } },
  { name: 'Apollo Hospitals, Jubilee Hills', address: 'Road No 72, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033', lat: 17.415059, lng: 78.412301, specialties: ['trauma', 'emergency medicine', 'neurosurgery', 'cardiac sciences', 'critical care'], icuBeds: 32, traumaCenter: true, bloodBankAvailable: true, phone: '04023607777', emergencyContact: '04023607777', region: 'Jubilee Hills', resources: { icuBeds: 32, ventilators: 24, bloodUnits: { A: 36, B: 28, O: 50, AB: 15 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Care Hospitals, Banjara Hills', address: 'Road No.1, Banjara Hills, Hyderabad, Telangana 500034', lat: 17.4125349, lng: 78.4504102, specialties: ['emergency medicine', 'cardiology', 'neurosurgery', 'orthopedics', 'critical care'], icuBeds: 30, traumaCenter: true, bloodBankAvailable: true, phone: '04068106589', emergencyContact: '04030418888', region: 'Banjara Hills', resources: { icuBeds: 30, ventilators: 20, bloodUnits: { A: 35, B: 29, O: 48, AB: 11 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },
  { name: 'AIG Hospitals, Gachibowli', address: 'Plot No 2/3/4/5, Survey No.136/1, Mindspace Road, Gachibowli, Hyderabad, Telangana 500032', lat: 17.4432083, lng: 78.3661953, specialties: ['emergency medicine', 'gastroenterology', 'critical care', 'transplant', 'internal medicine'], icuBeds: 26, traumaCenter: false, bloodBankAvailable: true, phone: '04042444222', emergencyContact: '04042444222', region: 'Gachibowli', resources: { icuBeds: 26, ventilators: 16, bloodUnits: { A: 28, B: 22, O: 35, AB: 9 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },
  { name: 'Gandhi Hospital (Government Trauma Center), Secunderabad', address: 'Gandhi Building, Musheerabad, Secunderabad, Telangana 500003', lat: 17.423101, lng: 78.5036034, specialties: ['government trauma center', 'emergency medicine', 'orthopedics', 'burn care', 'critical care'], icuBeds: 40, traumaCenter: true, bloodBankAvailable: true, phone: '04027505566', emergencyContact: '04027505566', region: 'Secunderabad', resources: { icuBeds: 40, ventilators: 25, bloodUnits: { A: 44, B: 37, O: 60, AB: 18 }, ambulancesAvailable: 7, traumaTeamOnDuty: true } }
];

async function run() {
  await connectDb();
  for (const item of hospitals) {
    const hospital = await Hospital.findOneAndUpdate({ name: item.name }, { name: item.name, address: item.address, location: toPoint(item.lat, item.lng), specialties: item.specialties, icuBeds: item.icuBeds, traumaCenter: item.traumaCenter, bloodBankAvailable: item.bloodBankAvailable, phone: item.phone, emergencyContact: item.emergencyContact, region: item.region, active: true }, { upsert: true, new: true });
    await Resources.findOneAndUpdate({ hospital: hospital._id }, { hospital: hospital._id, ...item.resources, lastSyncedAt: new Date() }, { upsert: true, new: true });
  }
  logger.info('Seeded Hyderabad hospitals', { count: hospitals.length });
  await disconnectDb();
}

run().catch(async (error) => { logger.error('Hospital seeding failed', { message: error.message, stack: error.stack }); await disconnectDb(); process.exit(1); });
