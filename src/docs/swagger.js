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
          latitude: { type: "number", nullable: true, example: 8.805038 },
          longitude: { type: "number", nullable: true, example: 78.151884 },
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
          latitude: { type: "number", minimum: -90, maximum: 90, nullable: true },
          longitude: { type: "number", minimum: -180, maximum: 180, nullable: true },
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
          latitude: { type: "number", minimum: -90, maximum: 90, nullable: true },
          longitude: { type: "number", minimum: -180, maximum: 180, nullable: true },
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
      CollectionCenter: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Center A" },
          location: { type: "string", example: "Thoothukudi Main Road" },
          capacity_litres: { type: "number", example: 5000 },
          manager_name: { type: "string", example: "Suresh Babu" },
          latitude: { type: "number", nullable: true, example: 8.805038 },
          longitude: { type: "number", nullable: true, example: 78.151884 },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateCollectionCenterRequest: {
        type: "object",
        required: ["name", "location", "capacity_litres", "manager_name"],
        properties: {
          name: { type: "string" },
          location: { type: "string" },
          capacity_litres: { type: "number", minimum: 0.01 },
          manager_name: { type: "string" },
          latitude: { type: "number", minimum: -90, maximum: 90, nullable: true },
          longitude: { type: "number", minimum: -180, maximum: 180, nullable: true },
        },
      },
      CollectionCenterCreateResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Collection center created successfully" },
          data: { $ref: "#/components/schemas/CollectionCenter" },
        },
      },
      CollectionCenterListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/CollectionCenter" },
          },
        },
      },
      CollectionRecord: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          farmer_id: { type: "string", format: "uuid" },
          center_id: { type: "string", format: "uuid" },
          quantity: { type: "number", example: 120.5 },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      CreateCollectionRecordRequest: {
        type: "object",
        required: ["farmer_id", "quantity"],
        properties: {
          farmer_id: { type: "string", format: "uuid" },
          center_id: {
            type: "string",
            format: "uuid",
            nullable: true,
            description: "Optional. If omitted, assigned nearest center is used.",
          },
          quantity: { type: "number", minimum: 0.01 },
          timestamp: { type: "string", format: "date-time", nullable: true },
        },
      },
      CollectionRecordCreateResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Milk collected successfully" },
          data: {
            allOf: [
              { $ref: "#/components/schemas/CollectionRecord" },
              {
                type: "object",
                properties: {
                  assigned_center: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      location: { type: "string" },
                    },
                  },
                },
              },
            ],
          },
          daily_capacity_status: {
            type: "object",
            properties: {
              center_id: { type: "string", format: "uuid" },
              date: { type: "string", format: "date" },
              daily_total_quantity: { type: "number" },
              capacity_litres: { type: "number" },
              alert: { type: "string", enum: ["OK", "CAPACITY_EXCEEDED"] },
            },
          },
        },
      },
      DailyCollectionSummaryItem: {
        type: "object",
        properties: {
          center_id: { type: "string", format: "uuid" },
          center_name: { type: "string" },
          location: { type: "string" },
          date: { type: "string", format: "date" },
          daily_total_quantity: { type: "number" },
          capacity_litres: { type: "number" },
          alert: { type: "string", enum: ["OK", "CAPACITY_EXCEEDED"] },
        },
      },
      DailyCollectionSummaryResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/DailyCollectionSummaryItem" },
          },
          aggregation_query: {
            type: "object",
            properties: {
              type: { type: "string", example: "prisma" },
              description: {
                type: "string",
                example: "Daily total quantity collected per center",
              },
              pseudo_sql: { type: "string" },
            },
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
