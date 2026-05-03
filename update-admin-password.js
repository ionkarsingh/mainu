const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function updateAdminPassword() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Hash the new password
    const newPassword = '1234556789!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the admin user's password
    const result = await User.updateOne(
      { email: 'muskan@gmail.com' },
      { password: hashedPassword }
    );
    
    console.log('Password update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('Email: muskan@gmail.com');
      console.log('New Password: 1234556789!');
    } else {
      console.log('❌ User not found or password not updated');
    }
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

updateAdminPassword();
