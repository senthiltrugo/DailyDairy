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
  createProduct: {
    request: {
      name: "paneer",
      unit: "kg",
      selling_price: 340,
    },
    response: {
      success: true,
      message: "Product created successfully",
      data: {
        id: "9f4f680f-c72f-4f38-a5be-905281f7b2aa",
        name: "paneer",
        unit: "kg",
        selling_price: 340,
        created_at: "2026-04-18T13:00:00.000Z",
      },
    },
  },
  updateStockIncrease: {
    request: {
      product_id: "9f4f680f-c72f-4f38-a5be-905281f7b2aa",
      batch_id: "BATCH-PANEER-001",
      expiry_date: "2026-04-30",
      quantity: 20,
      movement_type: "INCREASE",
      source: "processing",
      note: "from dispatch output",
    },
    response: {
      success: true,
      message: "Stock updated successfully",
      data: {
        product_id: "9f4f680f-c72f-4f38-a5be-905281f7b2aa",
        product_name: "paneer",
        unit: "kg",
        quantity_available: 120.5,
        batch_id: "BATCH-PANEER-001",
        expiry_date: "2026-04-30T00:00:00.000Z",
        movement: {
          id: "14ebeb8f-529f-4452-9120-72f2cb6fc9cb",
          movement_type: "INCREASE",
          quantity: 20,
          source: "processing",
          note: "from dispatch output",
          created_at: "2026-04-18T13:05:00.000Z",
        },
        stock_balance: {
          previous_quantity: 100.5,
          updated_quantity: 120.5,
        },
      },
    },
  },
  updateStockReduce: {
    request: {
      product_id: "9f4f680f-c72f-4f38-a5be-905281f7b2aa",
      batch_id: "BATCH-PANEER-001",
      quantity: 5.5,
      movement_type: "REDUCE",
      source: "sale",
      note: "retail billing #INV-1043",
    },
    response: {
      success: true,
      message: "Stock updated successfully",
      data: {
        product_id: "9f4f680f-c72f-4f38-a5be-905281f7b2aa",
        product_name: "paneer",
        unit: "kg",
        quantity_available: 115,
        batch_id: "BATCH-PANEER-001",
        expiry_date: "2026-04-30T00:00:00.000Z",
        movement: {
          id: "4f3f1d13-0f5e-44a2-b0c0-8206e9fcb5c4",
          movement_type: "REDUCE",
          quantity: 5.5,
          source: "sale",
          note: "retail billing #INV-1043",
          created_at: "2026-04-18T13:15:00.000Z",
        },
        stock_balance: {
          previous_quantity: 120.5,
          updated_quantity: 115,
        },
      },
    },
  },
  getInventory: {
    response: {
      success: true,
      data: [
        {
          product_id: "9f4f680f-c72f-4f38-a5be-905281f7b2aa",
          product_name: "paneer",
          unit: "kg",
          quantity_available: 115,
          batch_id: "BATCH-PANEER-001",
          expiry_date: "2026-04-30T00:00:00.000Z",
        },
      ],
    },
  },
  createOrder: {
    request: {
      customer: {
        type: "D2C",
        name: "Priya",
        phone: "9876501234",
        address: "12 Lake View Street",
      },
      product_id: "26c59de8-153a-49be-8d90-205f822fa65e",
      quantity: 3,
      price: 62,
      order_date: "2026-04-18",
    },
    response: {
      success: true,
      message: "Order created successfully",
      data: {
        id: "d3d58f93-f455-4b7d-86a9-4f3f4e53b622",
        customer_id: "3d4acacd-7363-4be2-82f1-c55c3980e39b",
        product_id: "26c59de8-153a-49be-8d90-205f822fa65e",
        subscription_id: null,
        quantity: 3,
        price: 62,
        total: 186,
        order_date: "2026-04-18T00:00:00.000Z",
        source: "MANUAL",
        customer: {
          id: "3d4acacd-7363-4be2-82f1-c55c3980e39b",
          type: "D2C",
          name: "Priya",
          phone: "9876501234",
          address: "12 Lake View Street",
        },
        product: {
          id: "26c59de8-153a-49be-8d90-205f822fa65e",
          name: "milk",
          unit: "litre",
        },
        stock_consumption: [
          {
            batch_id: "BATCH-MILK-001",
            reduced_quantity: 3,
            remaining_quantity: 45,
          },
        ],
      },
    },
  },
  createSubscription: {
    request: {
      customer_id: "3d4acacd-7363-4be2-82f1-c55c3980e39b",
      product_id: "26c59de8-153a-49be-8d90-205f822fa65e",
      quantity_per_day: 2,
      start_date: "2026-04-18",
      is_active: true,
    },
    response: {
      success: true,
      message: "Subscription created successfully",
      data: {
        id: "85fc4aa0-367d-4a9d-a43a-9ff70fcb90f8",
        customer_id: "3d4acacd-7363-4be2-82f1-c55c3980e39b",
        product_id: "26c59de8-153a-49be-8d90-205f822fa65e",
        quantity_per_day: 2,
        start_date: "2026-04-18T00:00:00.000Z",
        is_active: true,
      },
      auto_generated_daily_orders: {
        generated_count: 1,
        skipped_existing: 0,
        failed: [],
      },
    },
  },
  getOrders: {
    response: {
      success: true,
      data: [
        {
          id: "d3d58f93-f455-4b7d-86a9-4f3f4e53b622",
          customer_id: "3d4acacd-7363-4be2-82f1-c55c3980e39b",
          product_id: "26c59de8-153a-49be-8d90-205f822fa65e",
          subscription_id: null,
          quantity: 3,
          price: 62,
          total: 186,
          order_date: "2026-04-18T00:00:00.000Z",
          source: "MANUAL",
        },
        {
          id: "e47d77d3-1e0a-48f8-a4ab-7d381b653581",
          customer_id: "3d4acacd-7363-4be2-82f1-c55c3980e39b",
          product_id: "26c59de8-153a-49be-8d90-205f822fa65e",
          subscription_id: "85fc4aa0-367d-4a9d-a43a-9ff70fcb90f8",
          quantity: 2,
          price: 62,
          total: 124,
          order_date: "2026-04-18T00:00:00.000Z",
          source: "SUBSCRIPTION_AUTO",
        },
      ],
      auto_generated_daily_orders: {
        generated_count: 1,
        skipped_existing: 2,
        failed: [],
      },
    },
  },
  createInvestor: {
    request: {
      name: "Arun Prakash",
      phone: "9876540001",
      email: "arun.prakash@example.com",
      KYC_status: "VERIFIED",
    },
    response: {
      success: true,
      message: "Investor created successfully",
      data: {
        id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
        name: "Arun Prakash",
        phone: "9876540001",
        email: "arun.prakash@example.com",
        KYC_status: "VERIFIED",
        created_at: "2026-04-18T14:00:00.000Z",
      },
    },
  },
  createInvestment: {
    request: {
      investor_id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
      amount: 250000,
      category: "value-added",
      date: "2026-04-18",
    },
    response: {
      success: true,
      message: "Investment recorded successfully",
      data: {
        id: "da5dd0de-c6bc-40c6-869b-b9cb26881356",
        investor_id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
        amount: 250000,
        category: "value-added",
        date: "2026-04-18T00:00:00.000Z",
        created_at: "2026-04-18T14:10:00.000Z",
      },
    },
  },
  getInvestorById: {
    response: {
      success: true,
      data: {
        id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
        name: "Arun Prakash",
        phone: "9876540001",
        email: "arun.prakash@example.com",
        KYC_status: "VERIFIED",
        created_at: "2026-04-18T14:00:00.000Z",
        total_investments: 2,
        total_investment_amount: 400000,
        investments: [
          {
            id: "da5dd0de-c6bc-40c6-869b-b9cb26881356",
            investor_id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
            amount: 250000,
            category: "value-added",
            date: "2026-04-18T00:00:00.000Z",
            created_at: "2026-04-18T14:10:00.000Z",
          },
          {
            id: "8cde1658-f584-4369-9f7a-8531a5f47fc1",
            investor_id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
            amount: 150000,
            category: "milk",
            date: "2026-04-16T00:00:00.000Z",
            created_at: "2026-04-16T11:00:00.000Z",
          },
        ],
      },
    },
  },
  getInvestorPortfolio: {
    response: {
      success: true,
      data: {
        investor: {
          id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
          name: "Arun Prakash",
          phone: "9876540001",
          email: "arun.prakash@example.com",
          KYC_status: "VERIFIED",
          created_at: "2026-04-18T14:00:00.000Z",
        },
        total_invested_amount: 400000,
        allocation_percentages: {
          milk: 25,
          hubs: 37.5,
          "value-added": 37.5,
        },
        category_amounts: {
          milk: 100000,
          hubs: 150000,
          "value-added": 150000,
        },
        roi_rates: {
          milk: "15%",
          hubs: "22%",
          "value-added": "30%",
        },
        expected_returns_by_category: {
          milk: 15000,
          hubs: 33000,
          "value-added": 45000,
        },
        total_expected_returns: 93000,
        total_roi_percentage: 23.25,
        breakdown: [
          {
            category: "milk",
            invested_amount: 100000,
            allocation_percentage: 25,
            roi_rate_percentage: 15,
            expected_return: 15000,
          },
          {
            category: "hubs",
            invested_amount: 150000,
            allocation_percentage: 37.5,
            roi_rate_percentage: 22,
            expected_return: 33000,
          },
          {
            category: "value-added",
            invested_amount: 150000,
            allocation_percentage: 37.5,
            roi_rate_percentage: 30,
            expected_return: 45000,
          },
        ],
      },
    },
  },
  investorDashboard: {
    response: {
      success: true,
      data: {
        investor: {
          id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
          name: "Arun Prakash",
          phone: "9876540001",
          email: "arun.prakash@example.com",
          KYC_status: "VERIFIED",
          created_at: "2026-04-18T14:00:00.000Z",
        },
        summary_cards: {
          total_cows_funded: 2,
          active_farms_hubs: 3,
          daily_milk_production_litres: 83.3,
          total_investment: 400000,
          current_returns: 93000,
          roi_percentage: 23.25,
        },
        portfolio_breakdown: {
          allocation_percentages: {
            milk: 25,
            hubs: 37.5,
            "value-added": 37.5,
          },
          category_amounts: {
            milk: 100000,
            hubs: 150000,
            "value-added": 150000,
          },
          expected_returns_by_category: {
            milk: 15000,
            hubs: 33000,
            "value-added": 45000,
          },
          roi_rates: {
            milk: "15%",
            hubs: "22%",
            "value-added": "30%",
          },
          pie_chart_data: [
            {
              name: "Milk (low risk)",
              value: 25,
              amount: 100000,
            },
            {
              name: "Dairy hubs",
              value: 37.5,
              amount: 150000,
            },
            {
              name: "Value-added products",
              value: 37.5,
              amount: 150000,
            },
          ],
        },
        recent_transactions: [
          {
            id: "da5dd0de-c6bc-40c6-869b-b9cb26881356",
            category: "value-added",
            amount: 250000,
            date: "2026-04-18T00:00:00.000Z",
          },
          {
            id: "8cde1658-f584-4369-9f7a-8531a5f47fc1",
            category: "milk",
            amount: 150000,
            date: "2026-04-16T00:00:00.000Z",
          },
        ],
      },
    },
  },
  farmerPayouts: {
    response: {
      success: true,
      month: "2026-04",
      data: [
        {
          farmer_id: "2de1c147-2de8-479c-8f0e-4b0afcbccf8d",
          farmer_name: "Ravi Kumar",
          phone: "9876543210",
          total_quantity_litres: 320.5,
          total_payout_amount: 12890,
          entries_count: 5,
          entries: [
            {
              milk_entry_id: "4ad074bf-e4ae-4b8d-b77e-e45d7360e7f8",
              date: "2026-04-18T00:00:00.000Z",
              quantity_litres: 100,
              total_amount: 4100,
            },
          ],
        },
      ],
      totals: {
        farmers_count: 1,
        grand_total_payout_amount: 12890,
      },
      payout_logic: "Farmer payout is based on milk entries total_amount in the selected month.",
    },
  },
  investorPayouts: {
    response: {
      success: true,
      month: "2026-04",
      data: [
        {
          investor_id: "ee860395-15b8-40c9-886e-f3cb48d2f705",
          investor_name: "Arun Prakash",
          month: "2026-04",
          invested_amount: 400000,
          investments_count: 3,
          monthly_returns_by_category: {
            milk: 15000,
            hubs: 33000,
            "value-added": 45000,
          },
          total_monthly_return: 93000,
        },
      ],
      totals: {
        investors_count: 1,
        grand_total_monthly_return: 93000,
      },
      payout_logic: {
        milk: "15% of monthly investment in milk category",
        hubs: "22% of monthly investment in hub category",
        value_added: "30% of monthly investment in value-added category",
      },
    },
  },
};

module.exports = sampleResponses;
