import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patients = [
    {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-03-15'),
      patientId: 'P001',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      address: '123 Main St, Anytown, USA'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-07-22'),
      patientId: 'P002',
      email: 'jane.smith@email.com',
      phone: '+1-555-0456',
      address: '456 Oak Ave, Somewhere, USA'
    },
    {
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: new Date('1978-11-08'),
      patientId: 'P003',
      email: 'robert.johnson@email.com',
      phone: '+1-555-0789',
      address: '789 Pine Rd, Elsewhere, USA'
    }
  ];

  for (const patientData of patients) {
    await prisma.patient.upsert({
      where: { patientId: patientData.patientId },
      update: {},
      create: patientData,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
