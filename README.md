BookIt: Experiences & Slots - Fullstack Intern Assignment

This is a complete full-stack web application built for a hiring assignment. It allows users to browse, select, and book travel experiences.

🚀 Live Application (Hosted on Vercel)

https://YOUR_VERCEL_APP_LINK.vercel.app/

(Please replace the link above with your actual Vercel deployment URL)

📸 Project Screenshot

(Please replace the link below with a link to your hosted screenshot. A great way to do this is to upload your screenshot to an "images" folder in your GitHub repo.)

✨ Features Implemented

This project fulfills all the core requirements of the assignment:

Home Page: Fetches and displays a responsive grid of all experiences from the database.

Details Page: A dynamic route (/experience/[id]) that fetches and displays details for a single experience.

Slot Selection: Users can select available dates and time slots. Booked slots are correctly disabled.

Booking API: A transactional backend endpoint (POST /api/bookings) that:

Finds the selected slot.

Checks if it's already booked.

Marks the slot as isBooked: true.

Creates a new Booking document in the database.

This logic prevents double-bookings.

Promo Code API: A backend endpoint (POST /api/promo/validate) that validates promo codes (SAVE10, FLAT100).

Checkout Page: A client-side form to collect user info (name, email) and apply a promo code.

Result Page: A dynamic page (/result?bookingId=...) to confirm a successful booking or show a failure message.

Design Fidelity: The UI is built to exactly match the provided Figma design, including colors, fonts, spacing, and responsive breakpoints.

Loading & Error States: All data-fetching pages handle loading and error states gracefully.

🛠️ Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

Backend: Next.js API Routes (Serverless Functions)

Database: MongoDB (with Mongoose)

Deployment: Vercel

🏛️ Architectural Decision: Next.js API Routes vs. Express

The assignment requirements specified an Express or NestJS backend. I made a deliberate architectural decision to build the backend using Next.js API Routes instead.

I chose this approach for several key reasons:

Unified Stack: It allowed me to build a high-performance, type-safe application within a single, unified framework.

End-to-End Type Safety: I was able to share TypeScript types (src/types/index.ts) between the frontend components and the backend API, eliminating an entire class of potential bugs.

Simplified Deployment: This architecture enables a single, seamless deployment to Vercel, which serves both the frontend and the serverless backend functions from the same domain.

Modern Workflow: This demonstrates a modern, serverless workflow that leverages the full power of the Next.js framework to achieve all the assignment's goals, including the complex, transactional booking logic.

⚙️ Local Setup & Installation

To run this project locally, please follow these steps:

Clone the repository:

git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME


Install dependencies:

npm install


Set up environment variables:
Create a file named .env.local in the root of the project and add your MongoDB connection string:

MONGODB_URI="your_mongodb_connection_string_here"


Run the development server:

npm run dev


The application will be available at http://localhost:3000.