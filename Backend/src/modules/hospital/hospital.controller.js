const { Client } = require('@googlemaps/google-maps-services-js');
const hospitalService = require('./hospital.service');
const Hospital = require('./hospital.model');
const Resources = require('../resources/resources.model');
const { toPoint } = require('../../utils/geoUtils');
const { sendSuccess } = require('../../utils/responseFormatter');
const env = require('../../config/env');
const logger = require('../../utils/logger');

const mapsClient = new Client({});
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.select = wrap(async (req, res) => sendSuccess(res, await hospitalService.selectHospital(req.body), 'Hospital selected'));
exports.list = wrap(async (_req, res) => sendSuccess(res, await hospitalService.listHospitals(), 'Hospitals loaded'));
exports.get = wrap(async (req, res) => sendSuccess(res, await hospitalService.getHospital(req.params.id), 'Hospital loaded'));

// POST /api/hospital/geocode-seed
// Body: { hospitals: [{ name, address, phone?, region? }] }
exports.geocodeSeed = wrap(async (req, res) => {
  const list = req.body.hospitals;
  if (!Array.isArray(list) || !list.length) {
    return res.status(400).json({ error: 'Provide hospitals array in body' });
  }
  const seeded = [];
  const failed = [];
  for (const item of list) {
    try {
      const geocodeRes = await mapsClient.geocode({
        params: { address: item.address + ', Hyderabad, Telangana, India', key: env.googleMapsApiKey },
        timeout: 5000
      });
      const result = geocodeRes.data.results[0];
      if (!result) { failed.push({ name: item.name, reason: 'No geocode result' }); continue; }
      const { lat, lng } = result.geometry.location;
      await Hospital.findOneAndUpdate(
        { name: item.name },
        {
          name: item.name,
          address: item.address,
          location: toPoint(lat, lng),
          specialties: item.specialties || ['emergency medicine', 'general surgery', 'critical care'],
          icuBeds: item.icuBeds || 10,
          traumaCenter: item.traumaCenter || false,
          bloodBankAvailable: item.bloodBankAvailable !== false,
          phone: item.phone || '108',
          emergencyContact: item.phone || '108',
          region: item.region || 'Hyderabad',
          active: true
        },
        { upsert: true, new: true }
      );
      seeded.push(item.name);
    } catch (err) {
      logger.warn('Geocode failed', { name: item.name, error: err.message });
      failed.push({ name: item.name, reason: err.message });
    }
  }
  return sendSuccess(res, { seeded: seeded.length, failed }, `Geocoded and seeded ${seeded.length}/${list.length} hospitals`);
});

const SEED_HOSPITALS = [
  // ── HYDERABAD / TELANGANA ──────────────────────────────────────────────────
  { name: 'Yashoda Hospitals, Secunderabad', address: 'Alexander Road, Secunderabad, Telangana 500003', lat: 17.4418003, lng: 78.4971353, specialties: ['trauma', 'emergency medicine', 'orthopedics', 'neurosurgery', 'critical care'], icuBeds: 28, traumaCenter: true, bloodBankAvailable: true, phone: '04045674567', emergencyContact: '04045674567', region: 'Hyderabad', resources: { icuBeds: 28, ventilators: 18, bloodUnits: { A: 32, B: 26, O: 44, AB: 12 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'NIMS, Hyderabad', address: 'Punjagutta, Hyderabad, Telangana 500082', lat: 17.4219081, lng: 78.4515489, specialties: ['emergency medicine', 'neurosurgery', 'orthopedics', 'critical care'], icuBeds: 34, traumaCenter: true, bloodBankAvailable: true, phone: '04023489000', emergencyContact: '04023489244', region: 'Hyderabad', resources: { icuBeds: 34, ventilators: 22, bloodUnits: { A: 40, B: 31, O: 55, AB: 14 }, ambulancesAvailable: 6, traumaTeamOnDuty: true } },
  { name: 'Apollo Hospitals, Jubilee Hills', address: 'Road No 72, Jubilee Hills, Hyderabad, Telangana 500033', lat: 17.415059, lng: 78.412301, specialties: ['trauma', 'emergency medicine', 'neurosurgery', 'cardiac sciences', 'critical care'], icuBeds: 32, traumaCenter: true, bloodBankAvailable: true, phone: '04023607777', emergencyContact: '04023607777', region: 'Hyderabad', resources: { icuBeds: 32, ventilators: 24, bloodUnits: { A: 36, B: 28, O: 50, AB: 15 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Care Hospitals, Banjara Hills', address: 'Road No.1, Banjara Hills, Hyderabad, Telangana 500034', lat: 17.4125349, lng: 78.4504102, specialties: ['emergency medicine', 'cardiology', 'neurosurgery', 'orthopedics', 'critical care'], icuBeds: 30, traumaCenter: true, bloodBankAvailable: true, phone: '04068106589', emergencyContact: '04030418888', region: 'Hyderabad', resources: { icuBeds: 30, ventilators: 20, bloodUnits: { A: 35, B: 29, O: 48, AB: 11 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },
  { name: 'AIG Hospitals, Gachibowli', address: 'Mindspace Road, Gachibowli, Hyderabad, Telangana 500032', lat: 17.4432083, lng: 78.3661953, specialties: ['emergency medicine', 'gastroenterology', 'critical care'], icuBeds: 26, traumaCenter: false, bloodBankAvailable: true, phone: '04042444222', emergencyContact: '04042444222', region: 'Hyderabad', resources: { icuBeds: 26, ventilators: 16, bloodUnits: { A: 28, B: 22, O: 35, AB: 9 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },
  { name: 'Gandhi Hospital, Secunderabad', address: 'Musheerabad, Secunderabad, Telangana 500003', lat: 17.423101, lng: 78.5036034, specialties: ['government trauma center', 'emergency medicine', 'orthopedics', 'burn care', 'critical care'], icuBeds: 40, traumaCenter: true, bloodBankAvailable: true, phone: '04027505566', emergencyContact: '04027505566', region: 'Hyderabad', resources: { icuBeds: 40, ventilators: 25, bloodUnits: { A: 44, B: 37, O: 60, AB: 18 }, ambulancesAvailable: 7, traumaTeamOnDuty: true } },
  { name: 'Kamineni Hospitals, LB Nagar', address: 'LB Nagar, Hyderabad, Telangana 500068', lat: 17.3597, lng: 78.5517, specialties: ['emergency medicine', 'orthopedics', 'cardiac sciences', 'critical care'], icuBeds: 22, traumaCenter: false, bloodBankAvailable: true, phone: '04039879999', emergencyContact: '04039879999', region: 'Hyderabad', resources: { icuBeds: 22, ventilators: 14, bloodUnits: { A: 25, B: 20, O: 38, AB: 10 }, ambulancesAvailable: 3, traumaTeamOnDuty: true } },
  { name: 'Star Hospitals, Banjara Hills', address: '8-2-596, Road No.10, Banjara Hills, Hyderabad, Telangana 500034', lat: 17.4192, lng: 78.4474, specialties: ['emergency medicine', 'cardiac sciences', 'critical care', 'orthopedics'], icuBeds: 24, traumaCenter: false, bloodBankAvailable: true, phone: '04044777777', emergencyContact: '04044777777', region: 'Hyderabad', resources: { icuBeds: 24, ventilators: 15, bloodUnits: { A: 27, B: 21, O: 40, AB: 9 }, ambulancesAvailable: 3, traumaTeamOnDuty: true } },
  { name: 'Osmania General Hospital', address: 'Afzalgunj, Hyderabad, Telangana 500012', lat: 17.3862, lng: 78.4797, specialties: ['emergency medicine', 'general surgery', 'orthopedics', 'critical care'], icuBeds: 50, traumaCenter: true, bloodBankAvailable: true, phone: '04024600100', emergencyContact: '04024600100', region: 'Hyderabad', resources: { icuBeds: 50, ventilators: 30, bloodUnits: { A: 55, B: 44, O: 70, AB: 20 }, ambulancesAvailable: 8, traumaTeamOnDuty: true } },

  // ── DELHI / NCR ─────────────────────────────────────────────────────────────
  { name: 'AIIMS, New Delhi', address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029', lat: 28.5672, lng: 77.2100, specialties: ['trauma', 'emergency medicine', 'neurosurgery', 'cardiac sciences', 'burn care', 'critical care'], icuBeds: 80, traumaCenter: true, bloodBankAvailable: true, phone: '01126588500', emergencyContact: '01126589900', region: 'Delhi', resources: { icuBeds: 80, ventilators: 60, bloodUnits: { A: 80, B: 65, O: 100, AB: 30 }, ambulancesAvailable: 10, traumaTeamOnDuty: true } },
  { name: 'Safdarjung Hospital, Delhi', address: 'Ansari Nagar West, New Delhi 110029', lat: 28.5685, lng: 77.2073, specialties: ['emergency medicine', 'burn care', 'orthopedics', 'critical care'], icuBeds: 60, traumaCenter: true, bloodBankAvailable: true, phone: '01126165060', emergencyContact: '01126165060', region: 'Delhi', resources: { icuBeds: 60, ventilators: 40, bloodUnits: { A: 65, B: 52, O: 85, AB: 24 }, ambulancesAvailable: 8, traumaTeamOnDuty: true } },
  { name: 'Apollo Hospital, Sarita Vihar', address: 'Mathura Road, Sarita Vihar, New Delhi 110076', lat: 28.5303, lng: 77.2900, specialties: ['trauma', 'emergency medicine', 'cardiac sciences', 'neurosurgery', 'critical care'], icuBeds: 45, traumaCenter: true, bloodBankAvailable: true, phone: '01126925858', emergencyContact: '01126925858', region: 'Delhi', resources: { icuBeds: 45, ventilators: 32, bloodUnits: { A: 50, B: 40, O: 65, AB: 18 }, ambulancesAvailable: 6, traumaTeamOnDuty: true } },
  { name: 'Max Super Specialty Hospital, Saket', address: '1, Press Enclave Road, Saket, New Delhi 110017', lat: 28.5277, lng: 77.2145, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 40, traumaCenter: false, bloodBankAvailable: true, phone: '01126515050', emergencyContact: '01126515050', region: 'Delhi', resources: { icuBeds: 40, ventilators: 28, bloodUnits: { A: 45, B: 36, O: 58, AB: 16 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Fortis Hospital, Vasant Kunj', address: 'Sector B, Pocket 1, Aruna Asaf Ali Marg, New Delhi 110070', lat: 28.5361, lng: 77.1576, specialties: ['emergency medicine', 'orthopedics', 'cardiac sciences', 'critical care'], icuBeds: 35, traumaCenter: false, bloodBankAvailable: true, phone: '01142776222', emergencyContact: '01142776222', region: 'Delhi', resources: { icuBeds: 35, ventilators: 24, bloodUnits: { A: 38, B: 30, O: 50, AB: 14 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'GTB Hospital, Dilshad Garden', address: 'Dilshad Garden, Delhi 110095', lat: 28.6847, lng: 77.3188, specialties: ['emergency medicine', 'trauma', 'orthopedics', 'general surgery'], icuBeds: 55, traumaCenter: true, bloodBankAvailable: true, phone: '01122590009', emergencyContact: '01122590009', region: 'Delhi', resources: { icuBeds: 55, ventilators: 35, bloodUnits: { A: 60, B: 48, O: 78, AB: 22 }, ambulancesAvailable: 7, traumaTeamOnDuty: true } },

  // ── MUMBAI ──────────────────────────────────────────────────────────────────
  { name: 'KEM Hospital, Mumbai', address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012', lat: 19.0023, lng: 72.8435, specialties: ['trauma', 'emergency medicine', 'neurosurgery', 'burn care', 'critical care'], icuBeds: 70, traumaCenter: true, bloodBankAvailable: true, phone: '02224136051', emergencyContact: '02224136051', region: 'Mumbai', resources: { icuBeds: 70, ventilators: 50, bloodUnits: { A: 75, B: 60, O: 95, AB: 28 }, ambulancesAvailable: 9, traumaTeamOnDuty: true } },
  { name: 'Bombay Hospital, Mumbai', address: '12, New Marine Lines, Mumbai, Maharashtra 400020', lat: 18.9381, lng: 72.8311, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 38, traumaCenter: false, bloodBankAvailable: true, phone: '02222067676', emergencyContact: '02222067676', region: 'Mumbai', resources: { icuBeds: 38, ventilators: 26, bloodUnits: { A: 42, B: 33, O: 55, AB: 15 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Lilavati Hospital, Bandra', address: 'A-791, Bandra Reclamation, Bandra (W), Mumbai, Maharashtra 400050', lat: 19.0509, lng: 72.8258, specialties: ['emergency medicine', 'neurosurgery', 'cardiac sciences', 'critical care'], icuBeds: 35, traumaCenter: false, bloodBankAvailable: true, phone: '02226751000', emergencyContact: '02226751000', region: 'Mumbai', resources: { icuBeds: 35, ventilators: 24, bloodUnits: { A: 38, B: 30, O: 50, AB: 14 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },
  { name: 'Kokilaben Dhirubhai Ambani Hospital', address: '4, Srishti Complex, Andheri (W), Mumbai, Maharashtra 400053', lat: 19.1318, lng: 72.8274, specialties: ['trauma', 'emergency medicine', 'cardiac sciences', 'neurosurgery', 'critical care'], icuBeds: 50, traumaCenter: true, bloodBankAvailable: true, phone: '02230999999', emergencyContact: '02230999999', region: 'Mumbai', resources: { icuBeds: 50, ventilators: 38, bloodUnits: { A: 55, B: 44, O: 70, AB: 20 }, ambulancesAvailable: 7, traumaTeamOnDuty: true } },
  { name: 'Nair Hospital, Mumbai', address: 'Dr. A.L. Nair Road, Mumbai Central, Mumbai, Maharashtra 400008', lat: 18.9699, lng: 72.8196, specialties: ['emergency medicine', 'orthopedics', 'general surgery', 'critical care'], icuBeds: 45, traumaCenter: true, bloodBankAvailable: true, phone: '02223027601', emergencyContact: '02223027601', region: 'Mumbai', resources: { icuBeds: 45, ventilators: 30, bloodUnits: { A: 48, B: 38, O: 62, AB: 18 }, ambulancesAvailable: 6, traumaTeamOnDuty: true } },

  // ── BANGALORE ──────────────────────────────────────────────────────────────
  { name: 'Victoria Hospital, Bangalore', address: 'Fort Road, Krishnarajendra Market, Bangalore, Karnataka 560002', lat: 12.9656, lng: 77.5706, specialties: ['trauma', 'emergency medicine', 'orthopedics', 'burn care', 'critical care'], icuBeds: 60, traumaCenter: true, bloodBankAvailable: true, phone: '08022867700', emergencyContact: '08022867700', region: 'Bangalore', resources: { icuBeds: 60, ventilators: 40, bloodUnits: { A: 65, B: 52, O: 85, AB: 24 }, ambulancesAvailable: 8, traumaTeamOnDuty: true } },
  { name: 'Manipal Hospital, HAL Airport Road', address: '98, HAL Airport Road, Bangalore, Karnataka 560017', lat: 12.9600, lng: 77.6484, specialties: ['emergency medicine', 'cardiac sciences', 'neurosurgery', 'orthopedics', 'critical care'], icuBeds: 42, traumaCenter: true, bloodBankAvailable: true, phone: '08025024444', emergencyContact: '08025024444', region: 'Bangalore', resources: { icuBeds: 42, ventilators: 30, bloodUnits: { A: 46, B: 37, O: 60, AB: 17 }, ambulancesAvailable: 6, traumaTeamOnDuty: true } },
  { name: 'Fortis Hospital, Bannerghatta Road', address: '154/9, Opposite IIM-B, Bannerghatta Road, Bangalore, Karnataka 560076', lat: 12.8901, lng: 77.5974, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 36, traumaCenter: false, bloodBankAvailable: true, phone: '08066214444', emergencyContact: '08066214444', region: 'Bangalore', resources: { icuBeds: 36, ventilators: 25, bloodUnits: { A: 40, B: 32, O: 52, AB: 14 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'St. Johns Medical College Hospital', address: 'Sarjapur Road, Koramangala, Bangalore, Karnataka 560034', lat: 12.9369, lng: 77.6244, specialties: ['emergency medicine', 'trauma', 'orthopedics', 'critical care'], icuBeds: 40, traumaCenter: true, bloodBankAvailable: true, phone: '08022065000', emergencyContact: '08022065000', region: 'Bangalore', resources: { icuBeds: 40, ventilators: 28, bloodUnits: { A: 44, B: 35, O: 58, AB: 16 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Narayana Health City, Bangalore', address: '258/A, Bommasandra Industrial Area, Bangalore, Karnataka 560099', lat: 12.8340, lng: 77.6700, specialties: ['cardiac sciences', 'emergency medicine', 'neurosurgery', 'critical care'], icuBeds: 55, traumaCenter: true, bloodBankAvailable: true, phone: '08071222222', emergencyContact: '08071222222', region: 'Bangalore', resources: { icuBeds: 55, ventilators: 40, bloodUnits: { A: 58, B: 46, O: 74, AB: 21 }, ambulancesAvailable: 7, traumaTeamOnDuty: true } },

  // ── CHENNAI ─────────────────────────────────────────────────────────────────
  { name: 'Government General Hospital, Chennai', address: 'Park Town, Chennai, Tamil Nadu 600003', lat: 13.0827, lng: 80.2707, specialties: ['trauma', 'emergency medicine', 'neurosurgery', 'burn care', 'critical care'], icuBeds: 80, traumaCenter: true, bloodBankAvailable: true, phone: '04425305000', emergencyContact: '04425305000', region: 'Chennai', resources: { icuBeds: 80, ventilators: 55, bloodUnits: { A: 85, B: 68, O: 105, AB: 32 }, ambulancesAvailable: 10, traumaTeamOnDuty: true } },
  { name: 'Apollo Hospital, Greams Road', address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006', lat: 13.0629, lng: 80.2533, specialties: ['trauma', 'emergency medicine', 'cardiac sciences', 'neurosurgery', 'critical care'], icuBeds: 45, traumaCenter: true, bloodBankAvailable: true, phone: '04428290200', emergencyContact: '04428290200', region: 'Chennai', resources: { icuBeds: 45, ventilators: 32, bloodUnits: { A: 50, B: 40, O: 65, AB: 18 }, ambulancesAvailable: 6, traumaTeamOnDuty: true } },
  { name: 'Fortis Malar Hospital, Chennai', address: '52, First Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020', lat: 13.0012, lng: 80.2565, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 30, traumaCenter: false, bloodBankAvailable: true, phone: '04442892222', emergencyContact: '04442892222', region: 'Chennai', resources: { icuBeds: 30, ventilators: 20, bloodUnits: { A: 33, B: 26, O: 44, AB: 12 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },
  { name: 'MIOT International Hospital, Chennai', address: '4/112, Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600089', lat: 13.0149, lng: 80.1720, specialties: ['emergency medicine', 'orthopedics', 'neurosurgery', 'critical care'], icuBeds: 35, traumaCenter: false, bloodBankAvailable: true, phone: '04422491111', emergencyContact: '04422491111', region: 'Chennai', resources: { icuBeds: 35, ventilators: 24, bloodUnits: { A: 38, B: 30, O: 50, AB: 14 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },

  // ── KOLKATA ─────────────────────────────────────────────────────────────────
  { name: 'SSKM Hospital, Kolkata', address: '244, AJC Bose Road, Kolkata, West Bengal 700020', lat: 22.5378, lng: 88.3432, specialties: ['trauma', 'emergency medicine', 'neurosurgery', 'critical care'], icuBeds: 65, traumaCenter: true, bloodBankAvailable: true, phone: '03322041759', emergencyContact: '03322041759', region: 'Kolkata', resources: { icuBeds: 65, ventilators: 44, bloodUnits: { A: 70, B: 56, O: 90, AB: 26 }, ambulancesAvailable: 8, traumaTeamOnDuty: true } },
  { name: 'Apollo Gleneagles Hospital, Kolkata', address: '58, Canal Circular Road, Kadapara, Kolkata, West Bengal 700054', lat: 22.5651, lng: 88.3897, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 38, traumaCenter: false, bloodBankAvailable: true, phone: '03323201300', emergencyContact: '03323201300', region: 'Kolkata', resources: { icuBeds: 38, ventilators: 26, bloodUnits: { A: 42, B: 33, O: 55, AB: 15 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Fortis Hospital, Anandapur', address: '730, Anandapur, E.M. Bypass, Kolkata, West Bengal 700107', lat: 22.5119, lng: 88.3926, specialties: ['emergency medicine', 'cardiac sciences', 'neurosurgery', 'critical care'], icuBeds: 32, traumaCenter: false, bloodBankAvailable: true, phone: '03366284444', emergencyContact: '03366284444', region: 'Kolkata', resources: { icuBeds: 32, ventilators: 22, bloodUnits: { A: 35, B: 28, O: 46, AB: 13 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },

  // ── PUNE ────────────────────────────────────────────────────────────────────
  { name: 'Sassoon General Hospital, Pune', address: 'Jai Prakash Narayan Road, Shivajinagar, Pune, Maharashtra 411001', lat: 18.5240, lng: 73.8674, specialties: ['trauma', 'emergency medicine', 'orthopedics', 'critical care'], icuBeds: 55, traumaCenter: true, bloodBankAvailable: true, phone: '02026126754', emergencyContact: '02026126754', region: 'Pune', resources: { icuBeds: 55, ventilators: 36, bloodUnits: { A: 60, B: 48, O: 78, AB: 22 }, ambulancesAvailable: 7, traumaTeamOnDuty: true } },
  { name: 'Ruby Hall Clinic, Pune', address: '40, Sassoon Road, Pune, Maharashtra 411001', lat: 18.5225, lng: 73.8692, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 40, traumaCenter: false, bloodBankAvailable: true, phone: '02026163391', emergencyContact: '02026163391', region: 'Pune', resources: { icuBeds: 40, ventilators: 28, bloodUnits: { A: 44, B: 35, O: 58, AB: 16 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
  { name: 'Jehangir Hospital, Pune', address: '32, Sassoon Road, Pune, Maharashtra 411001', lat: 18.5237, lng: 73.8686, specialties: ['emergency medicine', 'neurosurgery', 'orthopedics', 'critical care'], icuBeds: 30, traumaCenter: false, bloodBankAvailable: true, phone: '02026055000', emergencyContact: '02026055000', region: 'Pune', resources: { icuBeds: 30, ventilators: 20, bloodUnits: { A: 33, B: 26, O: 44, AB: 12 }, ambulancesAvailable: 4, traumaTeamOnDuty: true } },

  // ── AHMEDABAD ────────────────────────────────────────────────────────────────
  { name: 'Civil Hospital, Ahmedabad', address: 'Asarwa, Ahmedabad, Gujarat 380016', lat: 23.0527, lng: 72.6100, specialties: ['trauma', 'emergency medicine', 'burn care', 'critical care'], icuBeds: 70, traumaCenter: true, bloodBankAvailable: true, phone: '07922680098', emergencyContact: '07922680098', region: 'Ahmedabad', resources: { icuBeds: 70, ventilators: 48, bloodUnits: { A: 75, B: 60, O: 95, AB: 28 }, ambulancesAvailable: 9, traumaTeamOnDuty: true } },
  { name: 'Apollo Hospital, Ahmedabad', address: 'Plot No 1A, BHAT, Gandhinagar Highway, Ahmedabad, Gujarat 382428', lat: 23.1218, lng: 72.5721, specialties: ['emergency medicine', 'cardiac sciences', 'orthopedics', 'critical care'], icuBeds: 36, traumaCenter: false, bloodBankAvailable: true, phone: '07969704444', emergencyContact: '07969704444', region: 'Ahmedabad', resources: { icuBeds: 36, ventilators: 25, bloodUnits: { A: 40, B: 32, O: 52, AB: 14 }, ambulancesAvailable: 5, traumaTeamOnDuty: true } },
];

exports.seed = wrap(async (_req, res) => {
  const results = [];
  for (const item of SEED_HOSPITALS) {
    const hospital = await Hospital.findOneAndUpdate(
      { name: item.name },
      { name: item.name, address: item.address, location: toPoint(item.lat, item.lng), specialties: item.specialties, icuBeds: item.icuBeds, traumaCenter: item.traumaCenter, bloodBankAvailable: item.bloodBankAvailable, phone: item.phone, emergencyContact: item.emergencyContact, region: item.region, active: true },
      { upsert: true, new: true }
    );
    await Resources.findOneAndUpdate(
      { hospital: hospital._id },
      { hospital: hospital._id, ...item.resources, lastSyncedAt: new Date() },
      { upsert: true, new: true }
    );
    results.push(hospital.name);
  }
  return sendSuccess(res, { seeded: results }, `Seeded ${results.length} hospitals successfully`);
});
