import { PrismaClient } from "@prisma/client";

// Prevents many prisma clients because of Next.js hot reload
const client = global.prismadb || new PrismaClient();

if (process.env.NODE_ENV === "production") {
  global.prismadb = client;
}

export default client;
