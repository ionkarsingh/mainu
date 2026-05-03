const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('./models/User');
const Hostel = require('./models/Hostel');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const Request = require('./models/Request');
const Attendance = require('./models/Attendance');
const Complaint = require('./models/Complaint');
const Suggestion = require('./models/Suggestion');
const Invoice = require('./models/Invoice');
const MessOff = require('./models/MessOff');

// Load environment variables
require('dotenv').config();

// Function to convert MongoDB Extended JSON to regular JavaScript objects
const convertExtendedJSON = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertExtendedJSON);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$oid' && typeof value === 'string') {
        return new mongoose.Types.ObjectId(value);
      } else if (key === '$date' && typeof value === 'string') {
        return new Date(value);
      } else {
        converted[key] = convertExtendedJSON(value);
      }
    }
    return converted;
  }
  
  return obj;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Hostel.deleteMany({});
    await Student.deleteMany({});
    await Admin.deleteMany({});
    await Request.deleteMany({});
    await Attendance.deleteMany({});
    await Complaint.deleteMany({});
    await Suggestion.deleteMany({});
    await Invoice.deleteMany({});
    await MessOff.deleteMany({});
    console.log('Existing data cleared');

    // Read and import JSON files
    const collectionsPath = path.join(__dirname, '..', 'mongoCollections');
    
    // Import in order to maintain referential integrity
    const importOrder = [
      { model: User, file: 'hostel.users.json', name: 'users' },
      { model: Hostel, file: 'hostel.hostels.json', name: 'hostels' },
      { model: Student, file: 'hostel.students.json', name: 'students' },
      { model: Admin, file: 'hostel.admins.json', name: 'admins' },
      { model: Request, file: 'hostel.requests.json', name: 'requests' },
      { model: Attendance, file: 'hostel.attendances.json', name: 'attendances' },
      { model: Complaint, file: 'hostel.complaints.json', name: 'complaints' },
      { model: Suggestion, file: 'hostel.suggestions.json', name: 'suggestions' },
      { model: Invoice, file: 'hostel.invoices.json', name: 'invoices' },
      { model: MessOff, file: 'hostel.messoffs.json', name: 'messoffs' }
    ];

    for (const collection of importOrder) {
      try {
        const filePath = path.join(collectionsPath, collection.file);
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const data = convertExtendedJSON(rawData);
        
        if (data.length > 0) {
          await collection.model.insertMany(data);
          console.log(`✓ ${collection.name}: ${data.length} documents imported`);
        } else {
          console.log(`⚠ ${collection.name}: No data to import`);
        }
      } catch (error) {
        console.error(`✗ Error importing ${collection.name}:`, error.message);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
seedDatabase();
