import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  type: "percent" | "flat";
  value: number;
  expiresAt: Date;        // expiry date for the promo
  isActive: boolean;      // you can deactivate old promos easily
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // ensures case-insensitive matching
      trim: true,
    },
    type: {
      type: String,
      enum: ["percent", "flat"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in Next.js dev mode
const PromoCode: Model<IPromoCode> =
  mongoose.models.PromoCode || mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);

export default PromoCode;
