import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    desc: { type: String, required: true }
});

export const Experience = mongoose.model('Experience', experienceSchema);
