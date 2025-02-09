# Step-Up E-Commerce Platform

## About
**Step-Up** is a modern full-stack **MERN** e-commerce platform designed to provide a seamless shopping experience. It features secure authentication, real-time data updates, and a powerful admin panel for managing orders, payments, and inventory efficiently.

## Features
- 🛍️ **Product Listings & Categories** – Browse, search, and filter products easily.
- 🔐 **Secure Authentication** – JWT-based authentication with user roles.
- 🛒 **Shopping Cart & Wishlist** – Add, remove, and manage favorite products.
- 💳 **Payment Integration** – Secure payments using **Razorpay**.
- 📦 **Order Management** – Track orders, generate invoices (PDF), and manage shipping.
- 📊 **Admin Dashboard** – Sales insights, charts, and order management.
- 📸 **Image Uploads** – Secure file handling with **Multer & AWS S3**.
- 🔔 **Email Notifications** – Automated order confirmation emails using **Nodemailer**.

## Tech Stack
### **Frontend:**
- React + TypeScript
- Redux Toolkit for state management
- Tailwind CSS & DaisyUI for styling
- Vite for fast development

### **Backend:**
- Node.js with Express.js
- MongoDB & Mongoose for database management
- JWT authentication for security
- Razorpay for payment processing
- Multer & AWS S3 for image uploads
- Nodemailer for email notifications

## Installation
### Prerequisites
- Node.js (>=14.x)
- MongoDB (Installed & Running)
- Razorpay API keys (for payments)
- AWS S3 credentials (for image uploads)

### Steps to Run the Project
1. **Clone the repository:**
   ```sh
   git clone https://github.com/shamsheedali/step-up.git
   cd step-up
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the backend and frontend directories.
   - Add MongoDB URI, JWT secret, Razorpay keys, and AWS credentials.

4. **Start the backend server:**
   ```sh
   cd backend
   npm start
   ```

5. **Start the frontend:**
   ```sh
   cd frontend
   npm run dev
   ```

## Contact
📧 Email: shamsheedali0786@gmail.com  
📌 GitHub: shamsheedali (https://github.com/shamsheedali)

