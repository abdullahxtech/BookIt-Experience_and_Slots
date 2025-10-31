// This interface defines the "shape" of a single date slot
export interface ISlot {
  _id: string;
  time: string;
  isBooked: boolean;
}

// This interface defines the "shape" of an available date
export interface IAvailableDate {
  _id: string;
  date: string; // We'll store dates as ISO strings
  slots: ISlot[];
}

// This is the main interface for our Experience data.
// It matches our Mongoose schema and the data our API will send.
export interface IExperience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
  availableDates: IAvailableDate[];
  createdAt: string; // Mongoose timestamps are strings in JSON
  updatedAt: string;
}

// This will be the shape of our Booking data for the checkout
export interface IBooking {
  _id: string;
  experience: string; // We'll store a reference by ID
  date: string;
  slot: string; // We'll store the time or slot ID
  userName: string;
  userEmail: string;
  promoCode?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}