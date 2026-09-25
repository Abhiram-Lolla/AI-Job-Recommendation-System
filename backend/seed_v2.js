import mongoose from 'mongoose';
import Job from './models/Job.js';
import fs from 'fs';

const jobsData = JSON.parse(fs.readFileSync('./jobs_dataset.json', 'utf8'));

mongoose.connect("mongodb://127.0.0.1:27017/antigravity")
    .then(async () => {
        console.log("Connected to MongoDB for Seeding...");
        
        // Clear existing jobs
        await Job.deleteMany({});
        console.log("Existing jobs cleared.");

        const formattedJobs = jobsData.map(j => ({
            title: j.role,
            company: "Neural Systems Corp", // Placeholder company
            location: j.remote_available ? "Remote / Global" : "On-site (Node Matrix)",
            category: j.category,
            level: j.level,
            experience_years: j.experience_years,
            description: `Join us as a ${j.role}. This role focuses on ${j.category} with a high demand score of ${j.demand_score}/10. You will use tools like ${j.tools.join(", ")} to drive innovation.`,
            requirements: j.skills.map(s => s.name),
            skills: j.skills,
            tools: j.tools,
            salary: `${j.salary_range_lpa} LPA`,
            demand_score: j.demand_score,
            growth_score: j.growth_score,
            remote_available: j.remote_available
        }));

        await Job.insertMany(formattedJobs);
        console.log(`Successfully seeded ${formattedJobs.length} trending jobs.`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
