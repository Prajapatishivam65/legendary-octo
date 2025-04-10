import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/passwords";

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const password = await hashPassword("password123");

  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password,
      avatarUrl: "https://example.com/avatar.png",
    },
  });

  console.log("Database has been seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
