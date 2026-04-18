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
