# E-Commerce Application

A full-featured e-commerce application built with React and TypeScript, utilizing the DummyJSON API for backend services. 

## Features

- **User Authentication**: Login with JWT token management
- **Product Browsing**: Infinite scroll with 20 items per load, search products by name
- **Shopping Cart**: Add, remove, and adjust product quantities, view cart for logged-in user
- **Checkout Process**: Complete shipping and payment information forms
- **Order Completion**: Simulated order processing with address updates

## Tech Stack

- **React** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **DummyJSON API** - Mock backend services
- **React Router** - Client-side routing

## Folder Structure

```
ecommerce-app-react/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, fonts, and other static resources
│   ├── components/           # Reusable React components
│   │   ├── Header.tsx        # Navigation header component
│   │   ├── ProductCard.tsx   # Product display card
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   └── CheckoutForm/     # Checkout process components
│   │       ├── OrderSummary.tsx
│   │       ├── Payment.tsx
│   │       ├── Review.tsx
│   │       └── Shipping.tsx
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state management
│   │   └── CartContext.tsx   # Shopping cart state management
│   ├── pages/                # Page components
│   │   ├── CartPage.tsx      # Shopping cart page
│   │   ├── CheckoutPage.tsx  # Checkout process page
│   │   ├── ConfirmationPage.tsx # Order confirmation page
│   │   ├── LoginPage.tsx     # User login page
│   │   └── ProductsPage.tsx  # Products listing page
│   ├── services/             # External service integrations
│   │   └── api.ts            # API calls and HTTP client
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # Global type definitions
│   ├── utils/                # Utility functions and helpers
│   │   ├── constants.ts      # Application constants
│   │   └── index.ts          # Utility functions
│   ├── App.css               # Main application styles
│   ├── App.tsx               # Root application component
│   ├── index.css             # Global styles
│   └── main.tsx              # Application entry point
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # TypeScript app-specific configuration
├── tsconfig.node.json        # TypeScript node-specific configuration
├── vite.config.ts            # Vite build tool configuration
└── README.md                 # Project documentation
``` 

## How to Run the Project

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

Use these credentials to login:
- **Username**: `emilys`
- **Password**: `emilyspass`
