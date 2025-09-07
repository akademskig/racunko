'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
    Box,
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    Stack,
    Tooltip
} from '@mui/material'
import {
    Add as AddIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon
} from '@mui/icons-material'
import { ThemeToggle } from '../../components/theme/ThemeToggle'
import { Sidebar } from '../../components/Sidebar'
import { useInvoices, useDeleteInvoice, useDownloadInvoicePDF, Invoice } from '../../hooks/useInvoices'

export default function InvoicesPage() {
    const { data: invoices = [], isLoading, error } = useInvoices()
    const deleteInvoiceMutation = useDeleteInvoice()
    const downloadPDFMutation = useDownloadInvoicePDF()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return
        deleteInvoiceMutation.mutate(id)
    }

    const handleDownloadPDF = async (id: string) => {
        downloadPDFMutation.mutate(id)
    }

    const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
        switch (status) {
            case 'DRAFT': return 'warning'
            case 'SENT': return 'info'
            case 'PAID': return 'success'
            case 'OVERDUE': return 'error'
            case 'CANCELLED': return 'default'
            default: return 'default'
        }
    }

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box textAlign="center">
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading invoices...
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Sidebar />
                        <Box>
                            <Typography variant="h3" component="h1" gutterBottom>
                                Invoices
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Manage your invoices and track payments
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <ThemeToggle />
                        <Button
                            component={Link}
                            href="/invoices/create"
                            variant="contained"
                            startIcon={<AddIcon />}
                            size="large"
                        >
                            New Invoice
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error.message || 'Failed to load invoices. Please check if the API server is running.'}
                    </Alert>
                )}

                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Invoice</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Issue Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Box textAlign="center">
                                            <DescriptionIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                No invoices yet
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Create your first invoice to get started
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice: Invoice) => (
                                    <TableRow key={invoice.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {invoice.invoiceNumber}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {invoice.client.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={invoice.status}
                                                color={getStatusColor(invoice.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {invoice.total.toLocaleString()} {invoice.currency}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Download PDF">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDownloadPDF(invoice.id)}
                                                        color="primary"
                                                        disabled={downloadPDFMutation.isPending}
                                                    >
                                                        {downloadPDFMutation.isPending ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <DownloadIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View">
                                                    <IconButton
                                                        size="small"
                                                        component={Link}
                                                        href={`/invoices/${invoice.id}`}
                                                        color="default"
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        component={Link}
                                                        href={`/invoices/${invoice.id}/edit`}
                                                        color="primary"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(invoice.id)}
                                                        color="error"
                                                        disabled={deleteInvoiceMutation.isPending}
                                                    >
                                                        {deleteInvoiceMutation.isPending ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <DeleteIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    )
}

