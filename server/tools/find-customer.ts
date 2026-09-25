import { prisma } from "../../lib/prisma";

export type FindCustomerInput = {
  email?: string;
  customerNumber?: string;
};

export async function findCustomer({
  email,
  customerNumber,
}: FindCustomerInput) {
  if (!email && !customerNumber) {
    throw new Error(
      "Either customer email or customer number is required.",
    );
  }

  const customer = await prisma.customer.findFirst({
    where: {
      OR: [
        email ? { email } : undefined,
        customerNumber ? { customerNumber } : undefined,
      ].filter(Boolean) as {
        email?: string;
        customerNumber?: string;
      }[],
    },
    select: {
      id: true,
      customerNumber: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!customer) {
    return {
      found: false,
      reason: "Customer was not found.",
    };
  }

  return {
    found: true,
    customer,
  };
}