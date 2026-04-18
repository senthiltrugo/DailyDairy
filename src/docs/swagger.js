const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DailyDairy Farmer & Milk Procurement API",
    version: "1.0.0",
    description:
      "API for Farmer Management and Milk Procurement with quality-based bonus logic.",
  },
  components: {
    schemas: {
      Farmer: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d" },
          name: { type: "string", example: "Ravi Kumar" },
          phone: { type: "string", example: "9876543210" },
          village: { type: "string", example: "Kovilpatti" },
          district: { type: "string", example: "Thoothukudi" },
          bank_account_number: { type: "string", example: "123456789012" },
          ifsc_code: { type: "string", example: "SBIN0000123" },
          number_of_cattle: { type: "integer", example: 12 },
          avg_daily_milk_litres: { type: "number", example: 95.5 },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateFarmerRequest: {
        type: "object",
        required: [
          "name",
          "phone",
          "village",
          "district",
          "bank_account_number",
          "ifsc_code",
          "number_of_cattle",
          "avg_daily_milk_litres",
        ],
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          village: { type: "string" },
          district: { type: "string" },
          bank_account_number: { type: "string" },
          ifsc_code: { type: "string" },
          number_of_cattle: { type: "integer", minimum: 0 },
          avg_daily_milk_litres: { type: "number", minimum: 0 },
        },
      },
      UpdateFarmerRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          village: { type: "string" },
          district: { type: "string" },
          bank_account_number: { type: "string" },
          ifsc_code: { type: "string" },
          number_of_cattle: { type: "integer", minimum: 0 },
          avg_daily_milk_litres: { type: "number", minimum: 0 },
        },
      },
      FarmerCreateResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Farmer created successfully" },
          data: { $ref: "#/components/schemas/Farmer" },
        },
      },
      FarmerUpdateResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Farmer updated successfully" },
          data: { $ref: "#/components/schemas/Farmer" },
        },
      },
      FarmerListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Farmer" },
          },
        },
      },
      MilkEntry: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          farmer_id: { type: "string", format: "uuid" },
          date: { type: "string", format: "date-time" },
          quantity_litres: { type: "number", example: 120.0 },
          fat_percentage: { type: "number", example: 4.2 },
          snf_percentage: { type: "number", example: 8.5 },
          price_per_litre: { type: "number", example: 39 },
          total_amount: { type: "number", example: 4920 },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: { type: "string" },
            example: ["quantity_litres must be greater than 0"],
          },
        },
      },
      CreateMilkEntryRequest: {
        type: "object",
        required: [
          "farmer_id",
          "date",
          "quantity_litres",
          "fat_percentage",
          "snf_percentage",
          "price_per_litre",
        ],
        properties: {
          farmer_id: { type: "string", format: "uuid" },
          date: { type: "string", format: "date" },
          quantity_litres: { type: "number", minimum: 0.01 },
          fat_percentage: { type: "number" },
          snf_percentage: { type: "number" },
          price_per_litre: { type: "number" },
        },
      },
      MilkEntryCreateResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Milk entry created successfully" },
          data: { $ref: "#/components/schemas/MilkEntry" },
        },
      },
      MilkEntryListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/MilkEntry" },
          },
        },
      },
    },
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local server",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
