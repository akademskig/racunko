import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a default company
  const company = await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {},
    create: {
      id: 'default-company',
      name: 'Računko Company',
      address: 'Zagreb, Croatia',
      email: 'info@racunko.com',
      oib: '12345678901',
      vatNumber: 'HR12345678901',
    },
  });

  // Create a sample client
  const client = await prisma.client.upsert({
    where: { id: 'sample-client' },
    update: {},
    create: {
      id: 'sample-client',
      name: 'Sample Client',
      address: 'Zagreb, Croatia',
      email: 'client@example.com',
      oib: '98765432109',
      companyId: company.id,
    },
  });

  // Create default tax rules
  await prisma.taxRule.upsert({
    where: { id: 'vat-standard' },
    update: {},
    create: {
      id: 'vat-standard',
      name: 'Standard VAT Rate',
      description: 'Standard VAT rate for Croatia',
      vatRate: 25.0,
      category: 'standard',
      effectiveFrom: new Date('2023-01-01'),
      source: 'Porezna uprava',
    },
  });

  await prisma.taxRule.upsert({
    where: { id: 'vat-reduced' },
    update: {},
    create: {
      id: 'vat-reduced',
      name: 'Reduced VAT Rate',
      description: 'Reduced VAT rate for Croatia',
      vatRate: 13.0,
      category: 'reduced',
      effectiveFrom: new Date('2023-01-01'),
      source: 'Porezna uprava',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
