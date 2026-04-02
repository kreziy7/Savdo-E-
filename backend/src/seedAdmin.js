require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');
const connectDB = require('./config/db');

const admins = [
  {
    name: 'Super Admin',
    email: 'superadmin@savdo.uz',
    password: 'Admin@1234',
    role: 'SUPER_ADMIN',
  },
  {
    name: 'Admin',
    email: 'admin@savdo.uz',
    password: 'Admin@1234',
    role: 'ADMIN',
  },
];

async function seed() {
  await connectDB();

  for (const data of admins) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      console.log(`Already exists: ${data.email} (${data.role})`);
      continue;
    }
    await User.create(data);
    console.log(`Created: ${data.email} (${data.role})  password: ${data.password}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
