import { PrismaClient } from '@prisma/client';

// Pass generic options to avoid ESM resolution bugs in ts-node
const prisma = new PrismaClient({ log: ['warn', 'error'] });

async function main() {
  console.log('Menghapus semua data lomba dari database...');
  const deleted = await prisma.competition.deleteMany({});
  console.log(`Berhasil menghapus ${deleted.count} lomba!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
