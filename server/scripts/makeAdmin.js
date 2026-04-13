const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://0.0.0.0/cricket_community');
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { returnDocument: 'after' }
    );
    if (user) {
      console.log(`Success! ${email} is now an admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address: node makeAdmin.js your@email.com');
  process.exit(1);
}

makeAdmin(email);
