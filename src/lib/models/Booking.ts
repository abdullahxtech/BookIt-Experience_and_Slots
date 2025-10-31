import mongoose, { Schema, Document, Model } from 'mongoose';
// Import the "blueprint" (interface) we created
import { IBooking } from '@/types';

// Create a new interface for the Mongoose Document
export interface IBookingDocument extends Omit<IBooking, '_id'>, Document {}

// --- Main Booking Schema ---
const BookingSchema: Schema = new Schema({
  // We link this booking to a specific Experience
  experience: {
    type: Schema.Types.ObjectId,
    ref: 'Experience', // This must match the model name 'Experience'
    required: [true, 'Experience ID is required.'],
  },
  date: {
    type: String, // The ISO string of the date booked (e.g., "2024-12-01")
    required: [true, 'Booking date is required.'],
  },
  slot: {
    type: String, // The specific slot time (e.g., "10:00 AM - 12:00 PM")
    required: [true, 'Booking slot is required.'],
  },
  userName: {
    type: String,
    required: [true, 'User name is required.'],
    trim: true,
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required.'],
    trim: true,
  },
  promoCode: {
    type: String,
    trim: true,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required.'],
  },
}, {
  // This automatically adds `createdAt` and `updatedAt` fields
  timestamps: true,
});

// This is a crucial part for Next.js.
// It checks if the model is already compiled and cached, preventing errors.
const Booking: Model<IBookingDocument> = mongoose.models.Booking ||
  mongoose.model<IBookingDocument>('Booking', BookingSchema);

export default Booking;