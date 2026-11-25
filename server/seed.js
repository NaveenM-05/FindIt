// Fills the database with sample items:  npm run seed  (inside /server)
require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/findit';
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const items = [
  { type: 'lost', title: 'Black JBL earphones', description: 'Wired JBL earphones in a small black pouch. Left them on a table near the window.', category: 'Electronics', location: 'Library', date: daysAgo(1), contactName: 'Rahul S', contactEmail: 'rahul.s@nhce.edu', contactPhone: '9876543210' },
  { type: 'found', title: 'College ID card – 1NH23CS0xx', description: 'Found an ID card with a blue lanyard near the canteen billing counter. Handed to the security desk.', category: 'ID Cards', location: 'Canteen', date: daysAgo(0), contactName: 'Naveen M', contactEmail: 'naveen.m@nhce.edu' },
  { type: 'lost', title: 'Full Stack Technologies notes', description: 'Spiral notebook with 22CSE71 unit 3 and 4 notes, name written on the first page.', category: 'Books & Notes', location: 'CSE Block', date: daysAgo(2), contactName: 'Ananya R', contactEmail: 'ananya.r@nhce.edu' },
  { type: 'found', title: 'Bike keys with red keychain', description: 'Honda key with a small red bottle-opener keychain, found in the two-wheeler parking.', category: 'Keys', location: 'Parking', date: daysAgo(1), contactName: 'Security Desk', contactEmail: 'security@nhce.edu', contactPhone: '9000011111' },
  { type: 'lost', title: 'Grey Wildcraft backpack', description: 'Grey backpack with a laptop sleeve and a water bottle in the side pocket.', category: 'Bags', location: 'Auditorium', date: daysAgo(3), contactName: 'Priya K', contactEmail: 'priya.k@nhce.edu', contactPhone: '9123456780' },
  { type: 'found', title: 'Casio scientific calculator', description: 'fx-991ES calculator left behind after the internal exam in room 204.', category: 'Electronics', location: 'Main Block', date: daysAgo(4), contactName: 'Karthik B', contactEmail: 'karthik.b@nhce.edu' },
  { type: 'lost', title: 'Silver analog wrist watch', description: 'Titan watch with a metal strap. Probably dropped during the football match.', category: 'Accessories', location: 'Sports Ground', date: daysAgo(5), contactName: 'Sneha P', contactEmail: 'sneha.p@nhce.edu' },
  { type: 'found', title: 'Navy blue NHCE hoodie', description: 'Size M hoodie found on the bench at the bus stop.', category: 'Clothing', location: 'Bus Stop', date: daysAgo(2), contactName: 'Arjun V', contactEmail: 'arjun.v@nhce.edu' },
  { type: 'lost', title: 'Boat power bank 10000mAh', description: 'White power bank with a scratch on the back.', category: 'Electronics', location: 'Canteen', date: daysAgo(8), contactName: 'Divya N', contactEmail: 'divya.n@nhce.edu', status: 'resolved', resolvedAt: daysAgo(6) },
  { type: 'found', title: 'Pair of spectacles in a brown case', description: 'Found in the library reading hall, returned to the owner.', category: 'Accessories', location: 'Library', date: daysAgo(10), contactName: 'Library Staff', contactEmail: 'library@nhce.edu', status: 'resolved', resolvedAt: daysAgo(9) },
];

(async () => {
  await mongoose.connect(MONGO_URI);
  await Item.deleteMany({});
  await Item.insertMany(items);
  console.log(`Inserted ${items.length} sample items into ${MONGO_URI}`);
  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
