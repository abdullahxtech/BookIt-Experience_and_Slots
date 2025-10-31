import mongoose, { Schema, Document, Model } from 'mongoose';
// Import the "blueprint" (interface) we created
import { IExperience } from '@/types';

// We create a new interface for the Mongoose Document
// This gives us type safety when working with Mongoose documents
export interface IExperienceDocument extends Omit<IExperience, '_id'>, Document {}

// --- Slot Schema ---
// We create a sub-schema for the slots, as they are part of an Experience
const SlotSchema: Schema = new Schema({
  time: {
    type: String,
    required: [true, 'Slot time is required'],
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

// --- AvailableDate Schema ---
// We create a sub-schema for the available dates, which embeds the SlotSchema
const AvailableDateSchema: Schema = new Schema({
  date: {
    type: String, // Storing as ISO string (e.g., "2024-12-01")
    required: [true, 'Date is required'],
  },
  slots: [SlotSchema], // This is an array of the SlotSchema
});

// --- Main Experience Schema ---
// Now we build the main schema using our sub-schemas
const ExperienceSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this experience.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL.'],
  },
  availableDates: [AvailableDateSchema], // This is an array of the AvailableDateSchema
}, {
  // This automatically adds `createdAt` and `updatedAt` fields
  timestamps: true,
});

// This is a crucial part for Next.js.
// It checks if the model is already compiled and cached, preventing errors
// during development (hot-reloading).
const Experience: Model<IExperienceDocument> = mongoose.models.Experience || 
  mongoose.model<IExperienceDocument>('Experience', ExperienceSchema);

export default Experience;