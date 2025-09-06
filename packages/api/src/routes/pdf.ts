import { Router } from 'express'
import { generateInvoicePDF } from '@racunko/pdf-generator'
import { prisma } from '@racunko/db'

const router = Router()

// POST /api/pdf/invoice/:id - Generate PDF for invoice
router.post('/invoice/:id', async (req, res) => {
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

        // Convert Decimal to number for PDF generation
        const invoiceForPDF = {
            ...invoice,
            subtotal: Number(invoice.subtotal),
            vatAmount: Number(invoice.vatAmount),
            total: Number(invoice.total),
            vatRate: Number(invoice.vatRate),
            items: invoice.items.map(item => ({
                ...item,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                total: Number(item.total),
                vatRate: Number(item.vatRate)
            }))
        }

        const pdfBuffer = await generateInvoicePDF(invoiceForPDF)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`)
        res.send(pdfBuffer)
    } catch (error) {
        console.error('PDF generation error:', error)
        res.status(500).json({ error: 'Failed to generate PDF' })
    }
})

export { router as pdfRoutes }
