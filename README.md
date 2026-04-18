# DailyDairy

## Module 1: Farmer & Milk Procurement

This repository now includes a backend module for Farmer Management and Milk Procurement built with:

- **Backend:** Node.js (Express)
- **Database ORM:** Prisma
- **API Docs:** Swagger (OpenAPI)

> Note: Your platform-wide preference mentions MongoDB, but this module is implemented with **PostgreSQL + Prisma ORM** as requested for Module 1.

### Project Structure

```
prisma/
  schema.prisma
src/
  app.js
  server.js
  config/
    prisma.js
  controllers/
    farmer.controller.js
    milkProcurement.controller.js
  routes/
    index.js
    farmer.routes.js
    milkProcurement.routes.js
  docs/
    swagger.js
    sampleResponses.js
```

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

3. Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run the API:

   ```bash
   npm run dev
   ```

### API Endpoints

- `POST /farmers`
- `GET /farmers`
- `PUT /farmers/:id`
- `POST /milk-entry`
- `GET /milk-entries?farmer_id=&date=`
- `POST /collection-centers`
- `GET /collection-centers`
- `POST /collect-milk`
- `GET /daily-collection-summary?date=YYYY-MM-DD`
- `POST /manufacturers`
- `POST /dispatch-milk`
- `GET /processing-report?date=YYYY-MM-DD&manufacturer_id=`
- `POST /products`
- `GET /inventory?product_id=`
- `POST /update-stock`
- `POST /orders`
- `GET /orders?customer_id=&product_id=&date=`
- `POST /subscriptions`
- `POST /investors`
- `POST /investments`
- `GET /investor/:id`

Swagger docs are available at:

- `GET /api-docs`

### Business Logic Implemented

- `total_amount = quantity_litres * price_per_litre`
- Quality bonus rule:
  - If `fat_percentage > 4`, add `₹2` per litre to the total amount.

Formula used:

```text
total_amount = (quantity_litres * price_per_litre) + (fat_percentage > 4 ? quantity_litres * 2 : 0)
```

### Validations Implemented

- Reject when `quantity_litres <= 0`
- Reject when `fat_percentage` is missing
- Additional numeric/date validation for key fields

### Sample API Responses

Sample request/response payloads are provided in:

- `src/docs/sampleResponses.js`

These include success and validation error examples for all required endpoints.

## Module 2: Milk Collection & Logistics

Implemented features:

1. **Collection Center**
   - `id`
   - `name`
   - `location`
   - `capacity_litres`
   - `manager_name`
   - optional geolocation (`latitude`, `longitude`) for nearest-center assignment

2. **Collection Records**
   - `farmer_id`
   - `center_id`
   - `quantity`
   - `timestamp`

3. **Logic**
   - Tracks daily total quantity per center
   - Returns alert status when daily total exceeds center capacity
   - Assigns farmer to nearest center (if `center_id` is not explicitly provided)

4. **APIs**
   - `POST /collection-centers`
   - `GET /collection-centers`
   - `POST /collect-milk`
   - `GET /daily-collection-summary`

5. **Aggregation Query**

Daily collection summary uses Prisma aggregation equivalent to:

```sql
SELECT
  center_id,
  DATE(timestamp) AS date,
  SUM(quantity) AS daily_total
FROM collection_records
WHERE timestamp >= :start AND timestamp < :end
GROUP BY center_id, DATE(timestamp);
```

## Module 3: Processing Partner Integration

Implemented features:

1. **Manufacturer**
   - `id`
   - `name`
   - `location`
   - `capacity_per_day`
   - `supported_products` (JSON/array)

2. **Milk Dispatch**
   - `id`
   - `center_id`
   - `manufacturer_id`
   - `quantity`
   - `date`
   - tracked outputs:
     - `paneer_output_kg`
     - `ghee_output_kg`

3. **Conversion Logic**
   - `10L milk -> 1kg paneer`
   - `25L milk -> 1kg ghee`

4. **Track Input/Output**
   - Input milk tracked per dispatch and aggregated per manufacturer/day
   - Output products tracked and reported per manufacturer/day

5. **APIs**
   - `POST /manufacturers`
   - `POST /dispatch-milk`
   - `GET /processing-report`

### Processing aggregation query

Processing report uses Prisma aggregation equivalent to:

```sql
SELECT
  manufacturer_id,
  DATE(date) AS day,
  SUM(quantity) AS input_litres,
  SUM(paneer_output_kg) AS paneer_kg,
  SUM(ghee_output_kg) AS ghee_kg
FROM milk_dispatches
WHERE date >= :start AND date < :end
GROUP BY manufacturer_id, DATE(date);
```

## Module 4: Product & Inventory

Implemented features:

1. **Product**
   - `id`
   - `name` (`milk`, `curd`, `paneer`, `ghee`)
   - `unit` (`litre` / `kg`)
   - `selling_price`

2. **Inventory**
   - `product_id`
   - `quantity_available`
   - `batch_id`
   - `expiry_date`

3. **Logic**
   - **Reduce stock on sale** via `movement_type: REDUCE`
   - **Increase stock after processing** via `movement_type: INCREASE`
   - Stock movement ledger recorded in `stock_movements`
   - Validation blocks negative stock balances

4. **APIs**
   - `POST /products`
   - `GET /inventory`
   - `POST /update-stock`

### Inventory engine behavior

- Create/increase stock batch:
  - send `movement_type: INCREASE`
  - `expiry_date` is required when creating a new batch
- Reduce stock batch (e.g., sale):
  - send `movement_type: REDUCE`
  - rejected if reduction exceeds available quantity

## Module 5: Sales

Implemented features:

1. **Customer**
   - `id`
   - `type` (`B2B` / `D2C`)
   - `name`
   - `phone`
   - `address`

2. **Orders**
   - `product_id`
   - `quantity`
   - `price`
   - `total`
   - also linked to customer and optional subscription

3. **Subscription**
   - daily delivery subscription
   - `quantity_per_day`

4. **APIs**
   - `POST /orders`
   - `GET /orders`
   - `POST /subscriptions`

5. **Logic**
   - Auto-generates daily orders for active subscriptions
   - `GET /orders` triggers daily generation run
   - `POST /subscriptions` generates today's subscription order immediately
   - Orders reduce stock from inventory batches (FIFO by expiry)

## Module 6: Investor Management

Implemented features:

1. **Investor**
   - `id`
   - `name`
   - `phone`
   - `email`
   - `KYC_status`

2. **Investments**
   - `investor_id`
   - `amount`
   - `category` (`milk` / `hub` / `value-added`)
   - `date`

3. **APIs**
   - `POST /investors`
   - `POST /investments`
   - `GET /investor/:id`

4. **Output**
   - Investor database with investment history
   - Investor profile API includes:
     - total investment count
     - total investment amount
     - full investment records
