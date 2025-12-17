import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  tech: [{ type: String }],
  description: { type: String, required: true },
  demoLink: { type: String },
  githubLink: { type: String }
});

export const Project = mongoose.model('Project', projectSchema);
