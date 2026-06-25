import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found.");
      return;
    }
    
    console.log("Trying to insert setup for user:", user.id);
    const setup = await prisma.setup.create({
      data: {
        name: "Test Setup",
        description: "Test description",
        userId: user.id
      }
    });
    console.log("Setup created successfully:", setup.id);
    
    // clean up
    await prisma.setup.delete({ where: { id: setup.id } });
    console.log("Setup deleted successfully.");
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
