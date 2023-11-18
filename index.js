const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(express.json())

app.use(cors());

dotenv.config();

// Database connection
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    name: String,
    rollNumber: Number,
    email: String,
    branch: String,
    year: Number,
    phone: Number,
});
const alumniSchema = new mongoose.Schema({
    name: String,
    rollNumber: Number,
    passingYear: Number,
    email: String,
    designation: String,
    location: String,
});
const announcementSchema = new mongoose.Schema({
    announcement: String,
    date: Date,
});

const User = mongoose.model('User', userSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const Alumni = mongoose.model('Alumni', alumniSchema);
// ... (your existing code)

// Add a new route to fetch announcements
app.get('/announcements', async(req, res) => {
    try {
        // Retrieve all announcements from the database
        const announcements = await Announcement.find();

        // Send the announcements as the response
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});


app.post('/announcementDB', async(req, res) => {
    try {
        const { announcement, date } = req.body;
        const newAnnouncement = new Announcement({ announcement, date });
        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement added successfully' });
    } catch (error) {
        console.log('Request Body:', req.body);

        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});

app.post('/register', async(req, res) => {
    try {
        const { name, email, branch, year, phone, rollNumber } = req.body;
        const user = new User({ name, email, branch, year, phone, rollNumber });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});
app.get('/alumniDetail', async(req, res) => {
    try {
        // Retrieve all alumni details from the database
        const alumniDetails = await Alumni.find();

        // Send the alumni details as the response
        res.status(200).json(alumniDetails);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});

app.post('/alumniDetails', async(req, res) => {
    try {
        const { name, rollNumber, passingYear, email, designation, location } = req.body;
        const alumni = new Alumni({ name, rollNumber, passingYear, email, designation, location });
        await alumni.save();
        res.status(201).json({ message: 'Alumni registered successfully' });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });

    }
});
app.get('/registeredUsers', async(req, res) => {
    try {
        // Retrieve all registered users from the database
        const registeredUsers = await User.find();

        // Send the registered users as the response
        res.status(200).json(registeredUsers);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});