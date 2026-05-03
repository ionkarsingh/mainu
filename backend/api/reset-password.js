const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Hash the new password
    const newPassword = '1234556789!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the admin user's password
    const result = await User.updateOne(
      { email: 'muskan@gmail.com' },
      { password: hashedPassword }
    );
    
    if (result.modifiedCount > 0) {
      res.status(200).json({ 
        success: true, 
        message: 'Admin password updated successfully!',
        email: 'muskan@gmail.com',
        password: '1234556789!'
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};
