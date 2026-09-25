import { prisma } from "../lib/prisma";

async function main() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      refunds: true,
    },
    orderBy: {
      orderNumber: "asc",
    },
  });

  for (const order of orders) {
    console.log({
      order: order.orderNumber,
      customer: order.customer.email,
      status: order.status,
      refunded: order.refunds.length > 0,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });