import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@racunko/db';

const router = Router();

const companySchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  oib: z.string().optional(),
  vatNumber: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
});

// GET /api/companies - Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET /api/companies/:id - Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        clients: true,
        invoices: true,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// POST /api/companies - Create new company
router.post('/', async (req, res) => {
  try {
    const data = companySchema.parse(req.body);

    const company = await prisma.company.create({
      data,
    });

    res.status(201).json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// PUT /api/companies/:id - Update company
router.put('/:id', async (req, res) => {
  try {
    const data = companySchema.partial().parse(req.body);

    const company = await prisma.company.update({
      where: { id: req.params.id },
      data,
    });

    res.json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// DELETE /api/companies/:id - Delete company
router.delete('/:id', async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export { router as companyRoutes };
