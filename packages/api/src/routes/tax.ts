import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@racunko/db';

const router = Router();

const taxRuleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  vatRate: z.number(),
  category: z.string().optional(),
  effectiveFrom: z.string().transform(str => new Date(str)),
  effectiveTo: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  source: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/tax/rules - Get all tax rules
router.get('/rules', async (req, res) => {
  try {
    const rules = await prisma.taxRule.findMany({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax rules' });
  }
});

// GET /api/tax/rules/:id - Get tax rule by ID
router.get('/rules/:id', async (req, res) => {
  try {
    const rule = await prisma.taxRule.findUnique({
      where: { id: req.params.id },
    });

    if (!rule) {
      return res.status(404).json({ error: 'Tax rule not found' });
    }

    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax rule' });
  }
});

// POST /api/tax/rules - Create new tax rule
router.post('/rules', async (req, res) => {
  try {
    const data = taxRuleSchema.parse(req.body);

    const rule = await prisma.taxRule.create({
      data,
    });

    res.status(201).json(rule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create tax rule' });
  }
});

// PUT /api/tax/rules/:id - Update tax rule
router.put('/rules/:id', async (req, res) => {
  try {
    const data = taxRuleSchema.partial().parse(req.body);

    const rule = await prisma.taxRule.update({
      where: { id: req.params.id },
      data,
    });

    res.json(rule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update tax rule' });
  }
});

// DELETE /api/tax/rules/:id - Delete tax rule
router.delete('/rules/:id', async (req, res) => {
  try {
    await prisma.taxRule.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tax rule' });
  }
});

export { router as taxRoutes };
