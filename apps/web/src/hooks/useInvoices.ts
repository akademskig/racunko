import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAddNotification } from '../stores/appStore'
import { getTranslation } from './useTranslation'
import { useLocale } from '../contexts/LocaleContext'

// Types
export interface Invoice {
    id: string
    invoiceNumber: string
    issueDate: string
    dueDate?: string
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    total: number
    currency: string
    client: {
        name: string
    }
    company: {
        name: string
    }
}

// API Base URL
const API_BASE_URL = 'http://localhost:3001/api'

// Query Keys
export const queryKeys = {
    invoices: ['invoices'] as const,
    invoice: (id: string) => ['invoices', id] as const,
}

// API Functions
const fetchInvoices = async (): Promise<Invoice[]> => {
    const response = await fetch(`${API_BASE_URL}/invoices`)
    if (!response.ok) {
        throw new Error('Failed to fetch invoices')
    }
    return response.json()
}

const deleteInvoice = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete invoice')
    }
}

const downloadInvoicePDF = async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/pdf/invoice/${id}`, {
        method: 'POST',
    })
    if (!response.ok) {
        throw new Error('Failed to generate PDF')
    }
    return response.blob()
}

// Hooks
export const useInvoices = () => {
    return useQuery({
        queryKey: queryKeys.invoices,
        queryFn: fetchInvoices,
    })
}

export const useDeleteInvoice = () => {
    const queryClient = useQueryClient()
    const addNotification = useAddNotification()
    const { locale } = useLocale()

    return useMutation({
        mutationFn: deleteInvoice,
        onSuccess: () => {
            // Invalidate and refetch invoices
            queryClient.invalidateQueries({ queryKey: queryKeys.invoices })
            const t = getTranslation(locale)
            addNotification({
                type: 'success',
                message: t.notifications.invoiceDeleted,
            })
        },
        onError: (error) => {
            const t = getTranslation(locale)
            addNotification({
                type: 'error',
                message: error.message || t.notifications.invoiceDeleteError,
            })
        },
    })
}

export const useDownloadInvoicePDF = () => {
    const addNotification = useAddNotification()
    const { locale } = useLocale()

    return useMutation({
        mutationFn: downloadInvoicePDF,
        onSuccess: (blob, invoiceId) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `invoice-${invoiceId}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            const t = getTranslation(locale)
            addNotification({
                type: 'success',
                message: t.notifications.pdfDownloaded,
            })
        },
        onError: (error) => {
            const t = getTranslation(locale)
            addNotification({
                type: 'error',
                message: error.message || t.notifications.pdfDownloadError,
            })
        },
    })
}
