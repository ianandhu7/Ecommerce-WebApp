# Ecommerce Web Application

A full-stack ecommerce application built with React frontend and Node.js backend.

## Features

- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart functionality
- Razorpay payment integration
- Order management
- Admin dashboard
- PostgreSQL database

## Tech Stack

### Frontend
- React.js
- Vite
- CSS3
- Razorpay SDK

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Razorpay API

## Environment Variables

### Backend (.env)
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
PORT=5002
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5002/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/ianandhu7/Ecommerce-WebApp.git
cd Ecommerce-WebApp
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
- Copy `.env.example` to `.env` in backend directory
- Copy `.env.local.example` to `.env.local` in frontend directory
- Update the variables with your actual values

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Deployment

The application is configured for deployment on:
- Frontend: Vercel
- Backend: Railway/Heroku
- Database: Neon PostgreSQL

## Payment Integration

This project uses Razorpay for payment processing:
- Test Key ID: `rzp_test_S70nWJUtFYoyam`
- Integration includes order creation, payment verification, and webhook handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.