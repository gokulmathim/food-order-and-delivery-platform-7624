# Food Ordering Frontend (React)

Modern, minimalistic React app for browsing restaurants, menus, adding to cart, placing orders, and viewing order history. Responsive for mobile and desktop.

## Environment
Copy `.env.example` to `.env` and adjust:
- REACT_APP_API_BASE_URL: Backend API base URL, e.g. http://localhost:3001

## Run
- npm install
- npm start

## Features
- User registration and login (JWT)
- Restaurant list with menu browsing
- Add/remove items in cart
- Place order with simple payment modal
- Order history and details
- Responsive layout and theme toggle (light/dark)

## Notes
- All API calls use the Express backend as defined in interfaces/openapi.json.
- Tokens are stored in localStorage. Logout clears token.
