import mongoose from 'mongoose';
import Job from './models/Job.js';

mongoose.connect("mongodb://127.0.0.1:27017/antigravity")
    .then(async () => {
        console.log("MongoDB Connected for Seeding");
        
        await Job.deleteMany({});
        
        const sampleJobs = [
            {
                title: "Senior Frontend Engineer",
                company: "TechNova",
                location: "Remote",
                description: "Looking for an expert React developer to lead our frontend architecture.",
                requirements: ["React", "TypeScript", "Tailwind CSS"],
                salary: "$120k - $150k"
            },
            {
                title: "Machine Learning Engineer",
                company: "AI Dynamics",
                location: "New York, NY",
                description: "Build scalable ML models and recommendation systems.",
                requirements: ["Python", "TensorFlow", "Scikit-Learn"],
                salary: "$140k - $180k"
            },
            {
                title: "Backend Node.js Developer",
                company: "Serverless Corp",
                location: "San Francisco, CA",
                description: "Develop high-performance microservices using Express and MongoDB.",
                requirements: ["Node.js", "Express", "MongoDB", "AWS"],
                salary: "$110k - $140k"
            },
            {
                title: "Full Stack Developer",
                company: "StartUp Inc.",
                location: "Austin, TX",
                description: "Help build our new amazing core product from scratch.",
                requirements: ["React", "Node.js", "PostgreSQL"],
                salary: "$100k - $130k"
            },
            {
                title: "Data Scientist",
                company: "DataWorks",
                location: "Remote",
                description: "Analyze large datasets to extract actionable insights.",
                requirements: ["Python", "SQL", "Pandas", "Data Visualization"],
                salary: "$115k - $150k"
            }
        ];

        await Job.insertMany(sampleJobs);
        console.log("Database seeded successfully with sample jobs!");
        
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
