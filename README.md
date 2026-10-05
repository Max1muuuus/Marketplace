# Marketplace

## Start on a fresh clone

Requirements: Node.js/npm, the .NET 10 SDK, and SQL Server LocalDB (`MSSQLLocalDB`). The connection string is in `backend/appsettings.json`.

1. Open a terminal in `Marketplace/frontent`.
2. Install frontend packages: `npm install` (first time only).
3. Start everything: `npm run dev:full`.
4. Wait until Vite prints `http://localhost:5173`, then open that address.
5. Keep the terminal running while using the app. Press Ctrl+C to stop the API and frontend.

The startup command runs the API, waits for `http://localhost:5079/api/health`, then starts Vite. The API applies migrations and seeds an empty database at startup; Vite proxies `/api` requests to it.

Admin login: `admin@marketplace.test` / `Admin123!`.

## About the project

Marketplace is a full-stack online marketplace where customers can browse a product catalog, save favorites, fill a cart, and place orders, while registered users can also sell their own products. Administrators manage the whole platform from a dedicated admin panel.

## Features

**Storefront**
- Home page with featured, newest, and popular products
- Catalog with search, filtering (category, brand, price, rating, availability), and sorting
- Categories, product detail pages (gallery, specifications, seller info, stock, reviews), and global search
- About and Contacts pages, language switcher, and light/dark theme

**Customers**
- Registration and login with JWT authentication
- Favorites and shopping cart saved to the account and stored in the database
- Checkout and order history (delivery fee: UAH 299; stock is checked and reduced on purchase)
- Product reviews and a rating for the marketplace itself

**Sellers**
- "My products": create, edit, and delete your own listings (ownership is enforced by the API)

**Administrators**
- Manage users, categories, sellers, products, orders, reviews, and ratings
- Safeguards: categories and sellers that are still in use cannot be deleted, and admin accounts cannot be removed

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, React Router 7, Vite, SCSS modules, ESLint |
| Backend | ASP.NET Core Web API (.NET 10), JWT bearer authentication, Swagger (Swashbuckle) |
| Data | Entity Framework Core 10, SQL Server LocalDB, automatic migrations and seed data |

## Project structure

```
Marketplace/
├── backend/            ASP.NET Core API
│   ├── Controllers/    HTTP endpoints (auth, catalog, account, orders, admin, health)
│   ├── Services/       Business logic
│   ├── Repositories/   Data access layer
│   ├── Entities/       Database models
│   ├── DTOs/           Request/response contracts
│   ├── Data/           EF Core DbContext and migrations
│   └── Seed/           Initial data for an empty database
├── frontent/           React application (Vite)
│   └── src/
│       ├── pages/      Route-level pages (Home, Catalog, Product, Cart, Admin, ...)
│       ├── components/ Reusable UI components (Header, Footer, ProductCard, ...)
│       ├── context/    Auth, cart, favorites, and language state
│       └── services/   API client
├── Marketplace.slnx    .NET solution file
└── TESTING_GUIDE.md    Manual test scenarios
```

## API overview

All endpoints are served under `/api`.

| Area | Base route | Description |
| --- | --- | --- |
| Health | `/api/health` | API status check used by the startup script |
| Auth | `/api/auth` | Register and log in |
| Catalog | `/api/catalog` | Products, categories, sellers, reviews, featured/newest/popular, and the seller's own products |
| Account | `/api/account` | Cart, favorites, and marketplace rating of the signed-in user |
| Orders | `/api/orders` | Order history and order placement |
| Admin | `/api/admin` | Administrator-only management endpoints |

## Useful commands

Run these from the `frontent` folder:

| Command | Description |
| --- | --- |
| `npm run dev:full` | Start the API and the frontend together |
| `npm run dev` | Start only the frontend (the API must already be running) |
| `npm run build` | Create a production build of the frontend |
| `npm run lint` | Run ESLint |

To run the API on its own, execute `dotnet run --project backend/backend.csproj --launch-profile http` from the repository root.

## Testing

Manual test scenarios for the storefront, accounts, checkout, seller listings, and admin tools are described in [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Team

| Name | Role |
| --- | --- |
| Maksym Perepichka | Team Lead |
| Stanislav Kashevko | Developer |
| Lev Dobrianskyi | Developer |
| Mykhailo Serhus | Developer |
