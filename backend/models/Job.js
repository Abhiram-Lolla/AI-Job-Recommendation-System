import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String },
    level: { type: String },
    experience_years: { type: String },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: [{
        name: String,
        weight: Number
    }],
    tools: [String],
    salary: { type: String, default: 'Not specified' },
    demand_score: { type: Number },
    growth_score: { type: Number },
    remote_available: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
