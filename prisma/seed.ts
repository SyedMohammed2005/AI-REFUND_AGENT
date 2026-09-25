import "dotenv/config";
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const customers = [
  {
    customerNumber: "CUS-1001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91-9876501001",
  },
  {
    customerNumber: "CUS-1002",
    name: "Priya Reddy",
    email: "priya.reddy@example.com",
    phone: "+91-9876501002",
  },
  {
    customerNumber: "CUS-1003",
    name: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    phone: "+91-9876501003",
  },
  {
    customerNumber: "CUS-1004",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91-9876501004",
  },
  {
    customerNumber: "CUS-1005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91-9876501005",
  },
  {
    customerNumber: "CUS-1006",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91-9876501006",
  },
  {
    customerNumber: "CUS-1007",
    name: "Arjun Nair",
    email: "arjun.nair@example.com",
    phone: "+91-9876501007",
  },
  {
    customerNumber: "CUS-1008",
    name: "Ishita Patel",
    email: "ishita.patel@example.com",
    phone: "+91-9876501008",
  },
  {
    customerNumber: "CUS-1009",
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    phone: "+91-9876501009",
  },
  {
    customerNumber: "CUS-1010",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91-9876501010",
  },
  {
    customerNumber: "CUS-1011",
    name: "Karan Malhotra",
    email: "karan.malhotra@example.com",
    phone: "+91-9876501011",
  },
  {
    customerNumber: "CUS-1012",
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    phone: "+91-9876501012",
  },
  {
    customerNumber: "CUS-1013",
    name: "Aditya Kumar",
    email: "aditya.kumar@example.com",
    phone: "+91-9876501013",
  },
  {
    customerNumber: "CUS-1014",
    name: "Pooja Desai",
    email: "pooja.desai@example.com",
    phone: "+91-9876501014",
  },
  {
    customerNumber: "CUS-1015",
    name: "Manish Gupta",
    email: "manish.gupta@example.com",
    phone: "+91-9876501015",
  },
];

const orders = [
  {
    orderNumber: "ORD-1001",
    customerNumber: "CUS-1001",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-10T10:00:00Z"),
    deliveredAt: new Date("2026-09-15T10:00:00Z"),
    items: [
      {
        productName: "Wireless Headphones",
        sku: "WH-100",
        quantity: 1,
        unitPrice: new Prisma.Decimal("49.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1002",
    customerNumber: "CUS-1002",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-07-20T10:00:00Z"),
    deliveredAt: new Date("2026-08-01T10:00:00Z"),
    items: [
      {
        productName: "Mechanical Keyboard",
        sku: "KB-200",
        quantity: 1,
        unitPrice: new Prisma.Decimal("89.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1003",
    customerNumber: "CUS-1003",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-05T10:00:00Z"),
    deliveredAt: new Date("2026-09-10T10:00:00Z"),
    items: [
      {
        productName: "USB-C Dock",
        sku: "DOCK-300",
        quantity: 1,
        unitPrice: new Prisma.Decimal("79.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1004",
    customerNumber: "CUS-1004",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-08T10:00:00Z"),
    deliveredAt: new Date("2026-09-12T10:00:00Z"),
    items: [
      {
        productName: "Digital Gift Card",
        sku: "GC-400",
        quantity: 1,
        unitPrice: new Prisma.Decimal("50.00"),
        isRefundable: false,
      },
    ],
  },
  {
    orderNumber: "ORD-1005",
    customerNumber: "CUS-1005",
    status: "CANCELLED" as const,
    orderedAt: new Date("2026-09-18T10:00:00Z"),
    deliveredAt: null,
    items: [
      {
        productName: "Smart Watch",
        sku: "SW-500",
        quantity: 1,
        unitPrice: new Prisma.Decimal("129.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1006",
    customerNumber: "CUS-1006",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-12T10:00:00Z"),
    deliveredAt: new Date("2026-09-17T10:00:00Z"),
    items: [
      {
        productName: "Laptop Stand",
        sku: "LS-600",
        quantity: 1,
        unitPrice: new Prisma.Decimal("39.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1007",
    customerNumber: "CUS-1007",
    status: "SHIPPED" as const,
    orderedAt: new Date("2026-09-20T10:00:00Z"),
    deliveredAt: null,
    items: [
      {
        productName: "Bluetooth Speaker",
        sku: "BS-700",
        quantity: 1,
        unitPrice: new Prisma.Decimal("59.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1008",
    customerNumber: "CUS-1008",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-01T10:00:00Z"),
    deliveredAt: new Date("2026-09-06T10:00:00Z"),
    items: [
      {
        productName: "Webcam",
        sku: "WC-800",
        quantity: 1,
        unitPrice: new Prisma.Decimal("69.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1009",
    customerNumber: "CUS-1009",
    status: "CONFIRMED" as const,
    orderedAt: new Date("2026-09-22T10:00:00Z"),
    deliveredAt: null,
    items: [
      {
        productName: "Ergonomic Mouse",
        sku: "EM-900",
        quantity: 1,
        unitPrice: new Prisma.Decimal("34.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1010",
    customerNumber: "CUS-1010",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-08-25T10:00:00Z"),
    deliveredAt: new Date("2026-08-30T10:00:00Z"),
    items: [
      {
        productName: "Portable SSD",
        sku: "SSD-1000",
        quantity: 1,
        unitPrice: new Prisma.Decimal("109.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1011",
    customerNumber: "CUS-1011",
    status: "PENDING" as const,
    orderedAt: new Date("2026-09-23T10:00:00Z"),
    deliveredAt: null,
    items: [
      {
        productName: "USB-C Cable",
        sku: "USB-1100",
        quantity: 2,
        unitPrice: new Prisma.Decimal("14.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1012",
    customerNumber: "CUS-1012",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-11T10:00:00Z"),
    deliveredAt: new Date("2026-09-16T10:00:00Z"),
    items: [
      {
        productName: "Tablet Case",
        sku: "TC-1200",
        quantity: 1,
        unitPrice: new Prisma.Decimal("24.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1013",
    customerNumber: "CUS-1013",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-03T10:00:00Z"),
    deliveredAt: new Date("2026-09-08T10:00:00Z"),
    items: [
      {
        productName: "Power Bank",
        sku: "PB-1300",
        quantity: 1,
        unitPrice: new Prisma.Decimal("44.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1014",
    customerNumber: "CUS-1014",
    status: "SHIPPED" as const,
    orderedAt: new Date("2026-09-19T10:00:00Z"),
    deliveredAt: null,
    items: [
      {
        productName: "Smart LED Lamp",
        sku: "SL-1400",
        quantity: 1,
        unitPrice: new Prisma.Decimal("32.99"),
        isRefundable: true,
      },
    ],
  },
  {
    orderNumber: "ORD-1015",
    customerNumber: "CUS-1015",
    status: "DELIVERED" as const,
    orderedAt: new Date("2026-09-13T10:00:00Z"),
    deliveredAt: new Date("2026-09-18T10:00:00Z"),
    items: [
      {
        productName: "Fitness Tracker",
        sku: "FT-1500",
        quantity: 1,
        unitPrice: new Prisma.Decimal("74.99"),
        isRefundable: true,
      },
    ],
  },
];

async function main() {
  console.log("Starting database seed...");

  const customerMap = new Map<string, string>();

  for (const customer of customers) {
    const record = await prisma.customer.upsert({
      where: {
        customerNumber: customer.customerNumber,
      },
      update: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      create: customer,
    });

    customerMap.set(customer.customerNumber, record.id);
  }

  for (const order of orders) {
    const customerId = customerMap.get(order.customerNumber);

    if (!customerId) {
      throw new Error(
        `Customer ${order.customerNumber} not found for order ${order.orderNumber}`,
      );
    }

    const totalAmount = order.items.reduce(
      (total, item) =>
        total.add(item.unitPrice.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    const savedOrder = await prisma.order.upsert({
      where: {
        orderNumber: order.orderNumber,
      },
      update: {
        customerId,
        status: order.status,
        totalAmount,
        orderedAt: order.orderedAt,
        deliveredAt: order.deliveredAt,
      },
      create: {
        orderNumber: order.orderNumber,
        customerId,
        status: order.status,
        totalAmount,
        orderedAt: order.orderedAt,
        deliveredAt: order.deliveredAt,
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        orderId: savedOrder.id,
      },
    });

    await prisma.orderItem.createMany({
      data: order.items.map((item) => ({
        orderId: savedOrder.id,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        isRefundable: item.isRefundable,
      })),
    });
  }

  const order1003 = await prisma.order.findUnique({
    where: {
      orderNumber: "ORD-1003",
    },
  });

  const customer1003 = await prisma.customer.findUnique({
    where: {
      customerNumber: "CUS-1003",
    },
  });

  if (!order1003 || !customer1003) {
    throw new Error("Required ORD-1003 seed data was not found");
  }

  await prisma.refund.upsert({
    where: {
      orderId: order1003.id,
    },
    update: {
      customerId: customer1003.id,
      amount: new Prisma.Decimal("79.99"),
      status: "PROCESSED",
      reason: "Product returned and refund completed",
      processedAt: new Date("2026-09-12T10:00:00Z"),
    },
    create: {
      customerId: customer1003.id,
      orderId: order1003.id,
      amount: new Prisma.Decimal("79.99"),
      status: "PROCESSED",
      reason: "Product returned and refund completed",
      processedAt: new Date("2026-09-12T10:00:00Z"),
    },
  });

  console.log("Seed completed successfully.");
  console.log(`Customers: ${customers.length}`);
  console.log(`Orders: ${orders.length}`);
  console.log("Refund scenarios prepared: ORD-1001 through ORD-1005");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });