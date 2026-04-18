const sampleResponses = {
  createFarmer: {
    request: {
      name: "Ravi Kumar",
      phone: "9876543210",
      village: "Kovilpatti",
      district: "Thoothukudi",
      bank_account_number: "123456789012",
      ifsc_code: "SBIN0000123",
      number_of_cattle: 12,
      avg_daily_milk_litres: 95.5,
    },
    response: {
      success: true,
      message: "Farmer created successfully",
      data: {
        id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
        name: "Ravi Kumar",
        phone: "9876543210",
        village: "Kovilpatti",
        district: "Thoothukudi",
        bank_account_number: "123456789012",
        ifsc_code: "SBIN0000123",
        number_of_cattle: 12,
        avg_daily_milk_litres: 95.5,
        created_at: "2026-04-18T10:15:00.000Z",
      },
    },
  },
  getFarmers: {
    response: {
      success: true,
      data: [
        {
          id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
          name: "Ravi Kumar",
          phone: "9876543210",
          village: "Kovilpatti",
          district: "Thoothukudi",
          bank_account_number: "123456789012",
          ifsc_code: "SBIN0000123",
          number_of_cattle: 12,
          avg_daily_milk_litres: 95.5,
          created_at: "2026-04-18T10:15:00.000Z",
        },
      ],
    },
  },
  updateFarmer: {
    request: {
      village: "Ettayapuram",
      number_of_cattle: 14,
    },
    response: {
      success: true,
      message: "Farmer updated successfully",
      data: {
        id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
        name: "Ravi Kumar",
        phone: "9876543210",
        village: "Ettayapuram",
        district: "Thoothukudi",
        bank_account_number: "123456789012",
        ifsc_code: "SBIN0000123",
        number_of_cattle: 14,
        avg_daily_milk_litres: 95.5,
        created_at: "2026-04-18T10:15:00.000Z",
      },
    },
  },
  createMilkEntry: {
    request: {
      farmer_id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
      date: "2026-04-18",
      quantity_litres: 100,
      fat_percentage: 4.2,
      snf_percentage: 8.4,
      price_per_litre: 39,
    },
    response: {
      success: true,
      message: "Milk entry created successfully",
      data: {
        id: "4ad074bf-e4ae-4b8d-b77e-e45d7360e7f8",
        farmer_id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
        date: "2026-04-18T00:00:00.000Z",
        quantity_litres: 100,
        fat_percentage: 4.2,
        snf_percentage: 8.4,
        price_per_litre: 39,
        total_amount: 4100,
      },
    },
    notes: "total_amount = (100 * 39) + (100 * 2 bonus because fat_percentage > 4) = 4100",
  },
  getMilkEntries: {
    response: {
      success: true,
      data: [
        {
          id: "4ad074bf-e4ae-4b8d-b77e-e45d7360e7f8",
          farmer_id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
          date: "2026-04-18T00:00:00.000Z",
          quantity_litres: 100,
          fat_percentage: 4.2,
          snf_percentage: 8.4,
          price_per_litre: 39,
          total_amount: 4100,
        },
      ],
    },
  },
  validationErrors: {
    quantityError: {
      success: false,
      message: "Validation failed",
      errors: ["quantity_litres must be greater than 0"],
    },
    fatMissingError: {
      success: false,
      message: "Validation failed",
      errors: ["fat_percentage is required"],
    },
  },
  createCollectionCenter: {
    request: {
      name: "Center A",
      location: "Thoothukudi Main Road",
      capacity_litres: 5000,
      manager_name: "Suresh Babu",
      latitude: 8.805038,
      longitude: 78.151884,
    },
    response: {
      success: true,
      message: "Collection center created successfully",
      data: {
        id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
        name: "Center A",
        location: "Thoothukudi Main Road",
        capacity_litres: 5000,
        manager_name: "Suresh Babu",
        latitude: 8.805038,
        longitude: 78.151884,
        created_at: "2026-04-18T12:00:00.000Z",
      },
    },
  },
  collectMilk: {
    request: {
      farmer_id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
      quantity: 250,
      timestamp: "2026-04-18T06:00:00.000Z",
    },
    response: {
      success: true,
      message: "Milk collected successfully",
      data: {
        id: "f861b35e-a228-43fd-a297-5689e8c2cc69",
        farmer_id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
        center_id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
        quantity: 250,
        timestamp: "2026-04-18T06:00:00.000Z",
        assigned_center: {
          id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
          name: "Center A",
          location: "Thoothukudi Main Road",
        },
      },
      daily_capacity_status: {
        center_id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
        date: "2026-04-18",
        daily_total_quantity: 5100,
        capacity_litres: 5000,
        alert: "CAPACITY_EXCEEDED",
      },
    },
  },
  dailyCollectionSummary: {
    response: {
      success: true,
      data: [
        {
          center_id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
          center_name: "Center A",
          location: "Thoothukudi Main Road",
          date: "2026-04-18",
          daily_total_quantity: 5100,
          capacity_litres: 5000,
          alert: "CAPACITY_EXCEEDED",
        },
      ],
      aggregation_query: {
        type: "prisma",
        description: "Daily total quantity collected per center",
        pseudo_sql:
          "SELECT center_id, DATE(timestamp) AS date, SUM(quantity) AS daily_total FROM collection_records WHERE timestamp >= :start AND timestamp < :end GROUP BY center_id, DATE(timestamp)",
      },
    },
  },
  createManufacturer: {
    request: {
      name: "ABC Dairy Products",
      location: "Madurai Industrial Estate",
      capacity_per_day: 8000,
      supported_products: ["paneer", "ghee"],
    },
    response: {
      success: true,
      message: "Manufacturer created successfully",
      data: {
        id: "c2d57f2a-02cf-4892-a210-9f5c4ac5f2de",
        name: "ABC Dairy Products",
        location: "Madurai Industrial Estate",
        capacity_per_day: 8000,
        supported_products: ["paneer", "ghee"],
        created_at: "2026-04-18T12:30:00.000Z",
      },
    },
  },
  dispatchMilk: {
    request: {
      center_id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
      manufacturer_id: "c2d57f2a-02cf-4892-a210-9f5c4ac5f2de",
      quantity: 500,
      date: "2026-04-18",
    },
    response: {
      success: true,
      message: "Milk dispatched successfully",
      data: {
        id: "d2bf4cb7-47ee-4487-ad4e-15e7183e0674",
        center_id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
        manufacturer_id: "c2d57f2a-02cf-4892-a210-9f5c4ac5f2de",
        quantity: 500,
        date: "2026-04-18T00:00:00.000Z",
        paneer_output_kg: 50,
        ghee_output_kg: 20,
        conversion_output: {
          input_milk_litres: 500,
          paneer_output_kg: 50,
          ghee_output_kg: 20,
          conversion_rules: {
            paneer: "10L milk -> 1kg paneer",
            ghee: "25L milk -> 1kg ghee",
          },
        },
      },
      manufacturer_capacity_status: {
        manufacturer_id: "c2d57f2a-02cf-4892-a210-9f5c4ac5f2de",
        date: "2026-04-18",
        daily_input_milk_litres: 7600,
        capacity_per_day: 8000,
        alert: "OK",
      },
    },
  },
  processingReport: {
    response: {
      success: true,
      data: [
        {
          manufacturer_id: "c2d57f2a-02cf-4892-a210-9f5c4ac5f2de",
          manufacturer_name: "ABC Dairy Products",
          location: "Madurai Industrial Estate",
          date: "2026-04-18",
          input_milk_litres: 7600,
          output_products: {
            paneer_kg: 760,
            ghee_kg: 304,
          },
          dispatches: [
            {
              dispatch_id: "d2bf4cb7-47ee-4487-ad4e-15e7183e0674",
              center_id: "6f9bcc88-7ae7-48a0-aa22-b6e6f68457d3",
              center_name: "Center A",
              quantity: 500,
            },
          ],
        },
      ],
      conversion_rules: {
        paneer: "10L milk -> 1kg paneer",
        ghee: "25L milk -> 1kg ghee",
      },
      aggregation_query: {
        type: "prisma",
        description: "Grouped daily input milk and output products by manufacturer",
        pseudo_sql:
          "SELECT manufacturer_id, DATE(date) AS day, SUM(quantity) AS input_litres, SUM(paneer_output_kg) AS paneer_kg, SUM(ghee_output_kg) AS ghee_kg FROM milk_dispatches WHERE date >= :start AND date < :end GROUP BY manufacturer_id, DATE(date)",
      },
    },
  },
};

module.exports = sampleResponses;
