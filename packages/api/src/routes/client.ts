import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '@racunko/db'

const router = Router()

const clientSchema = z.object({
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
    companyId: z.string(),
})

// GET /api/clients - Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                company: true,
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(clients)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' })
    }
})

// GET /api/clients/:id - Get client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: req.params.id },
            include: {
                company: true,
                invoices: true,
            }
        })

        if (!client) {
            return res.status(404).json({ error: 'Client not found' })
        }

        res.json(client)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch client' })
    }
})

// POST /api/clients - Create new client
router.post('/', async (req, res) => {
    try {
        const data = clientSchema.parse(req.body)

        const client = await prisma.client.create({
            data,
            include: {
                company: true,
            }
        })

        res.status(201).json(client)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.errors })
        }
        res.status(500).json({ error: 'Failed to create client' })
    }
})

// PUT /api/clients/:id - Update client
router.put('/:id', async (req, res) => {
    try {
        const data = clientSchema.partial().parse(req.body)

        const client = await prisma.client.update({
            where: { id: req.params.id },
            data,
            include: {
                company: true,
            }
        })

        res.json(client)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.errors })
        }
        res.status(500).json({ error: 'Failed to update client' })
    }
})

// DELETE /api/clients/:id - Delete client
router.delete('/:id', async (req, res) => {
    try {
        await prisma.client.delete({
            where: { id: req.params.id }
        })

        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' })
    }
})

export { router as clientRoutes }
