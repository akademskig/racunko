import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '@racunko/db'

const router = Router()

const invoiceSchema = z.object({
    invoiceNumber: z.string(),
    issueDate: z.string().transform(str => new Date(str)),
    dueDate: z.string().transform(str => new Date(str)).optional(),
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
    subtotal: z.number(),
    vatRate: z.number().optional(),
    vatAmount: z.number(),
    total: z.number(),
    currency: z.string().optional(),
    notes: z.string().optional(),
    paymentTerms: z.string().optional(),
    companyId: z.string(),
    clientId: z.string(),
    items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        total: z.number(),
        vatRate: z.number().optional(),
    }))
})

// GET /api/invoices - Get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                company: true,
                client: true,
                items: true,
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(invoices)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoices' })
    }
})

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', async (req, res) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: req.params.id },
            include: {
                company: true,
                client: true,
                items: true,
            }
        })

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' })
        }

        res.json(invoice)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoice' })
    }
})

// POST /api/invoices - Create new invoice
router.post('/', async (req, res) => {
    try {
        const data = invoiceSchema.parse(req.body)

        const invoice = await prisma.invoice.create({
            data: {
                ...data,
                items: {
                    create: data.items.map(item => ({
                        ...item,
                        vatRate: item.vatRate || 25.00
                    }))
                }
            },
            include: {
                company: true,
                client: true,
                items: true,
            }
        })

        res.status(201).json(invoice)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.errors })
        }
        res.status(500).json({ error: 'Failed to create invoice' })
    }
})

// PUT /api/invoices/:id - Update invoice
router.put('/:id', async (req, res) => {
    try {
        const { items, ...invoiceData } = invoiceSchema.partial().parse(req.body)

        const invoice = await prisma.invoice.update({
            where: { id: req.params.id },
            data: invoiceData,
            include: {
                company: true,
                client: true,
                items: true,
            }
        })

        // Update items if provided
        if (items) {
            // Delete existing items
            await prisma.invoiceItem.deleteMany({
                where: { invoiceId: req.params.id }
            })

            // Create new items
            await prisma.invoiceItem.createMany({
                data: items.map(item => ({
                    ...item,
                    vatRate: item.vatRate || 25.00,
                    invoiceId: req.params.id
                }))
            })

            // Fetch updated invoice with items
            const updatedInvoice = await prisma.invoice.findUnique({
                where: { id: req.params.id },
                include: {
                    company: true,
                    client: true,
                    items: true,
                }
            })

            return res.json(updatedInvoice)
        }

        res.json(invoice)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.errors })
        }
        res.status(500).json({ error: 'Failed to update invoice' })
    }
})

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', async (req, res) => {
    try {
        await prisma.invoice.delete({
            where: { id: req.params.id }
        })

        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete invoice' })
    }
})

export { router as invoiceRoutes }
