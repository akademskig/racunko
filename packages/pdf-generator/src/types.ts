export interface InvoiceWithRelations {
    id: string
    invoiceNumber: string
    issueDate: Date
    dueDate?: Date | null
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    subtotal: number
    vatRate: number
    vatAmount: number
    total: number
    currency: string
    notes?: string | null
    paymentTerms?: string | null
    companyId: string
    clientId: string
    createdAt: Date
    updatedAt: Date
    company: {
        id: string
        name: string
        address?: string | null
        city?: string | null
        postalCode?: string | null
        country: string
        oib?: string | null
        vatNumber?: string | null
        email?: string | null
        phone?: string | null
        website?: string | null
        logo?: string | null
    }
    client: {
        id: string
        name: string
        address?: string | null
        city?: string | null
        postalCode?: string | null
        country: string
        oib?: string | null
        vatNumber?: string | null
        email?: string | null
        phone?: string | null
        website?: string | null
    }
    items: Array<{
        id: string
        description: string
        quantity: number
        unitPrice: number
        total: number
        vatRate: number
    }>
}

