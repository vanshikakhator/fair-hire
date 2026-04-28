const mongoose = require('mongoose');
const Application = require('../models/Application');

const MONGO_URI = 'mongodb://127.0.0.1:27017/fairhire';

async function checkApps() {
    await mongoose.connect(MONGO_URI);
    const apps = await Application.find();
    apps.forEach(a => {
        console.log(`App: ${a.email} - ResumePath: ${a.resumePath}`);
    });
    process.exit();
}

checkApps();
