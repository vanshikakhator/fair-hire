const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

const MONGO_URI = 'mongodb://127.0.0.1:27017/fairhire';

async function checkData() {
    try {
        await mongoose.connect(MONGO_URI);
        const jobs = await Job.find();
        console.log(`Found ${jobs.length} jobs`);
        for (const job of jobs) {
            const apps = await Application.find({ jobId: job._id });
            console.log(`Job: ${job.role} (ID: ${job._id}) - Applicants: ${apps.length}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkData();
