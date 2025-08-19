# Food Ordering Frontend (React)

A modern, minimalistic, responsive frontend for browsing restaurants and menus, managing a cart, authenticating users, placing orders, and viewing order history.

## Features
- User authentication (login/register)
- Restaurant list sidebar with search
- Menu browsing per restaurant
- Cart management (add/update/remove/clear)
- Order placement with mock payment intent/confirmation
- Order history and status
- Responsive mobile/desktop layout
- Vanilla CSS styling, no heavy UI libs

## Environment Variables
Copy `.env.example` to `.env` and adjust:
- `REACT_APP_API_BASE`: Backend API base URL (default `http://localhost:3001`)

Do NOT commit secrets. The orchestrator will set env vars for deployments.

## Development
- `npm start` — run dev server at http://localhost:3000
- `npm test` — run tests
- `npm run build` — production build

## Backend API
This app integrates with the provided backend OpenAPI.
Key endpoints: `/auth/register`, `/auth/login`, `/auth/me`, `/restaurants`, `/restaurants/{id}/menu`, `/cart`, `/cart/items`, `/orders`, `/payments/intents`, `/payments/confirm`.

## Project Structure
- `src/services/api.js` — API client abstraction
- `src/context/AuthContext.js` — auth state and helpers
- `src/context/CartContext.js` — cart state and helpers
- `src/components/` — Header, Sidebar, CartPanel
- `src/pages/` — HomePage, LoginPage, RegisterPage, OrdersPage, RestaurantPage
- `src/App.js` — wiring contexts and routes
- `src/App.css` — theme, layout, responsive styles

## Notes
- Some backend response shapes may vary; the UI normalizes where possible.
- For checkout, this frontend uses a mock payment flow via `payments/*` endpoints.
