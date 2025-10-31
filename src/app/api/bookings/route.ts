import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/lib/models/Booking';
import Experience from '@/lib/models/Experience';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();

    const {
      experience: experienceId,
      date,
      slot,
      userName,
      userEmail,
      promoCode,
      totalPrice
    } = body;

    if (!experienceId || !date || !slot || !userName || !userEmail) {
      throw new Error("Missing required booking details.");
    }

    // find experience
    const experience = await Experience.findById(experienceId).session(session);
    if (!experience) throw new Error("Experience not found.");

    // find date
    const dateDoc = experience.availableDates.find(d => d.date === date);
    if (!dateDoc) throw new Error("Selected date not available.");

    // find slot
    const slotDoc = dateDoc.slots.find(s => s.time === slot);
    if (!slotDoc) throw new Error("Selected slot not found.");

    // check booking status
    if (slotDoc.isBooked) throw new Error("This slot is already booked.");

    // mark slot as booked
    slotDoc.isBooked = true;
    await experience.save({ session });

    // create booking
    const newBooking = new Booking({
      experience: experienceId,
      date,
      slot,
      slotId: slotDoc._id.toString(),
      userName,
      userEmail,
      promoCode,
      totalPrice,
    });
    await newBooking.save({ session });

    // commit transaction
    await session.commitTransaction();

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  } finally {
    session.endSession();
  }
}
