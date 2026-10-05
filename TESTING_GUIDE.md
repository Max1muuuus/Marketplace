# Marketplace Manual Test Guide

## Start the application

1. Confirm SQL Server LocalDB is available on this machine. The backend connection is configured in `backend/appsettings.json` as `MarketplaceDb`.
2. Start the API from the repository root with `dotnet run --project backend/backend.csproj --launch-profile http`. On startup, EF Core applies pending migrations and the seed adds default records to an empty catalog.
3. Start the frontend in a second terminal with `cd frontent` and `npm run dev`.
4. Open `http://localhost:5173`. Keep the API running during all tests.
5. For administrator tests, sign in with `admin@marketplace.test` and `Admin123!`. Create two customer accounts, Customer A and Customer B, using distinct email addresses. Use disposable accounts for deletion tests.

## Seed and storefront

1. Open Home. Confirm featured/popular products and category links load.
2. Open Catalog. Confirm seeded products appear. Search for a brand or product name; filter by category, brand, price, rating, and availability; change sort order. Confirm each change affects the visible results.
3. Open Categories and a category. Confirm the category list and its products correspond to the database catalog.
4. Open a product detail. Check gallery images, specifications, seller information, stock, and product reviews. Open a related item and confirm its detail route works.
5. Open Search from the header, search for a partial product name, and open a result. Try a query with no matches.
6. Test header and footer navigation, About, and Contacts. Change language and theme; confirm navigation and visible page content remain usable.

## Accounts and account-owned data

1. Register Customer A and confirm registration signs the customer in. Log out, sign in again, and confirm the same account is restored. Try an incorrect password and registering the same email again; both should fail with a visible error.
2. As Customer A, favorite a product and add it to the cart. Change its quantity, remove another item, and reload the page. The account's saved favorites and cart should return.
3. Log out and sign in as Customer B. Confirm Customer A's favorites and cart are not shown. Save different products as Customer B, then switch back to A and confirm each account retains its own choices.
4. Repeat the account-isolation check in a second browser profile or private window. The same account should load the same database-backed collections on either device/profile.
5. As Customer A, submit a product review while signed in. Confirm it appears on that product and that its rating/review count updates. Edit the review and confirm it replaces the existing review for that account/product rather than creating a duplicate.
6. On About, submit a marketplace rating. Confirm it appears in the public feedback list and the account's existing rating is loaded for editing after a reload.

## Checkout and orders

1. Add one or more available products to Customer A's cart and open Checkout.
2. Submit with required fields empty; the form should identify missing values and keep the cart unchanged.
3. Complete the form and place the order. Confirm success appears only after the API accepts it and the cart clears only on success. Confirm a failed request leaves the cart intact.
4. Confirm the persisted total equals the item subtotal plus the UAH 299 delivery fee, and product stock decreases by the purchased quantity. A request exceeding available stock must be rejected without creating an order or changing stock.
5. Open Orders as Customer A and confirm the new order, status, date, total, and item count appear. Confirm Customer B cannot see A's order.
6. Sign in as Admin and open Admin > Orders. Confirm the same order is visible to the administrator.

## Seller listings

1. As Customer A, open Profile > My products. Add a listing with a valid category, image URL, price, and stock.
2. Reload My Products and confirm the listing remains. Open it from Catalog or Favorites and confirm the public detail is available.
3. Edit its name, price, description, and stock; reload and confirm the changes persist in both My Products and Catalog.
4. Delete the listing. Confirm it no longer appears in Catalog or My Products. If another account had favorited or carted it, those references should disappear; existing order history should remain readable.
5. Try editing/deleting a listing while signed in as a different customer. The API should reject ownership violations.

## Administrator management

1. Sign in as Admin and open Admin. Confirm user, product, category, seller, order, review, and rating views show database records.
2. Add and edit a category, then reload Catalog and Admin. Confirm the category persists and can be used for a product. Attempt to delete a category that still has products; deletion should be rejected. Delete an unused test category and confirm it is gone after reload.
3. Add and edit a seller. Confirm the seller remains after reload. Attempt to delete a seller assigned to products; deletion should be rejected. Delete an unused test seller and confirm it is gone.
4. Edit an existing product as Admin and verify the change in Catalog. Delete a disposable product and verify it is no longer publicly listed.
5. Open Admin > Reviews. Confirm Customer A's product review appears with the product name. Delete a disposable review and confirm it disappears and the product rating/count recalculate.
6. Open Admin > Users. Confirm both test accounts are present. Admin accounts cannot be deleted from this view; the currently signed-in administrator cannot delete itself.

## Account deletion and cleanup

1. Have Customer A create a listing, a product review, a marketplace rating, a favorite, and cart contents. Have Customer B favorite and cart Customer A's listing. Create orders for A in Pending, Shipped, and Delivered states; also try an already-Cancelled order.
2. As Admin, delete Customer A from Admin > Users.
3. Confirm A is removed from Admin > Users and can no longer log in.
4. If Customer A was signed in in another browser tab, make an account-backed request there. The deleted session should be cleared and the UI should return to guest state instead of exposing an unhandled server error.
5. Confirm A's owned products, authored reviews, marketplace rating, favorites, and cart rows are removed from the database and no longer appear publicly.
6. Confirm B's favorite/cart references to A's deleted listing are gone, while B's other saved products remain.
7. Confirm orders placed by A remain as historical orders with the deleted account detached. Pending and Shipped orders should become `Cancelled`; Delivered and already-Cancelled orders should keep their existing status. Any order line referencing A's deleted product should retain its product-name/price snapshot with a null product reference.

## Database verification

For each persistence check, reload the page or sign out/in before deciding it passed; this distinguishes database persistence from in-memory UI state. When inspecting SQL Server, check `Users`, `Products.OwnerUserId`, `Reviews`, `MarketplaceRatings`, `CartItems`, `Favorites`, `Orders`, and `OrderItems`. Confirm each product's `ReviewCount` and `Rating` match its actual `Reviews` rows. The account-owned schema and aggregate repair are introduced by the migrations under `backend/Migrations/`.
