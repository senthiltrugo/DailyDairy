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
};

module.exports = sampleResponses;
