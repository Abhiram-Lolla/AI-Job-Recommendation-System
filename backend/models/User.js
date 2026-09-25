import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    resume: {
        type: String, // Path or URL to resume
        default: ""
    },
    resume_text: {
        type: String, // Raw extracted text for ML
        default: ""
    },
    experience_years: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
