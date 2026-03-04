import { PrismaClient, SeatCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 300; i++) {
    let category: SeatCategory;

    if (i <= 100) category = 'Common';
    else if (i <= 200) category = 'Reserved';
    else category = 'Cabin';

    await prisma.seat.create({
      data: {
        seatNumber: i,
        category,
      },
    });
  }

  console.log('300 seats seeded');
}

main();