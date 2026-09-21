# E-Commerce Application

A full-stack e-commerce application built with the MERN stack, focused on product management, CRUD operations, and a responsive user interface.

## Overview

This project is a mini e-commerce platform developed as part of a MERN Stack certificate task. It allows users to browse products and view detailed product information, while administrators can manage the product inventory through a dedicated admin interface.

The application demonstrates the integration of a React frontend with a Node.js and Express.js backend, using MongoDB for data storage.

## Features

### User Features

- View all available products
- Browse products in a responsive grid layout
- View detailed information about individual products
- View product name, price, description, category, and stock quantity

### Admin Features

- Add new products
- Update existing products
- Delete products
- Manage product inventory
- Form validation for product data
- Role-based access control for administrative operations

### Backend

- RESTful API architecture
- Complete product CRUD operations
- Request validation using Express Validator
- Admin-only access for product management operations
- Error handling for invalid requests and missing resources
- MongoDB database integration using Mongoose

### Frontend

- React.js based user interface
- React Context API for state management
- Responsive product listing
- Product details page
- Add/Edit product forms
- Bootstrap-based styling

## Tech Stack

**Frontend**
- React.js
- React Router
- Axios
- React Context API
- Bootstrap

**Backend**
- Node.js
- Express.js
- Express Validator
- Mongoose
- CORS
- dotenv

**Database**
- MongoDB
- MongoDB Atlas

**Deployment**
- Vercel / Netlify — Frontend
- Render / Heroku / AWS — Backend
- MongoDB Atlas — Database

## Project Structure

```text
e-commerce-application/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
└── README.md
```

## REST API

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/products` | Create a product | Admin |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get a product by ID | Public |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |

## Product Data Model

Each product contains:

```text
_id
name
price
description
category
stock
```

The required fields are validated before products are stored in the database.

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd e-commerce-application
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm run dev
```

The API will run locally on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## Environment Variables

Do not commit sensitive environment variables to GitHub.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Make sure `.env` is included in `.gitignore`.

## Validation and Security

The backend validates incoming product data before processing requests.

Administrative operations are protected through role-based access control, ensuring that product creation, modification, and deletion are restricted to administrators.

The application also handles common API errors such as:

- Invalid product data
- Invalid product IDs
- Product not found
- Unauthorized operations
- Server errors

## Deployment

The application is designed to be deployed using:

- **Frontend:** Vercel or Netlify
- **Backend:** Render, Heroku, or AWS
- **Database:** MongoDB Atlas

After deployment, the frontend communicates with the deployed backend API instead of the local development server.

## Future Improvements

Possible extensions to the application include:

- Product search and filtering
- User registration and login
- JWT authentication
- Shopping cart
- Order management
- Order history
- Product image uploads
- Cloud-based image storage

## Learning Objectives

This project demonstrates practical experience with:

- React.js frontend development
- REST API development
- CRUD operations
- MongoDB database design
- Mongoose
- Express.js middleware
- Form validation
- Role-based access control
- State management with React Context API
- Frontend and backend integration
- Application deployment

## License

This project was developed for educational and certificate submission purposes.