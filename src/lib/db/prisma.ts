import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// const prisma = prismaBase.$extends({
//   query: {
//     cart: {
//       async update({ args, query }) {
//         args.data = { ...args.data, updatedAt: new Date() };
//         return query(args);
//       },
//     },
//   },
// }) as PrismaClient;
// export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
