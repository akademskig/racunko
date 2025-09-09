'use client';

import Link from 'next/link';
import { format } from 'date-fns';
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
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { ThemeToggle } from '@web/components/ThemeToggle';
import { Sidebar } from '@web/components/Sidebar';
import { LanguageSwitcher } from '@web/components/LanguageSwitcher';
import {
  useInvoices,
  useDeleteInvoice,
  useDownloadInvoicePDF,
  Invoice,
} from '@web/hooks/useInvoices';
import { useTranslation } from '@web/hooks/useTranslation';

export default function InvoicesPage() {
  const { data: invoices = [], isLoading, error } = useInvoices();
  const deleteInvoiceMutation = useDeleteInvoice();
  const downloadPDFMutation = useDownloadInvoicePDF();
  const { t } = useTranslation();

  const handleDelete = async (id: string) => {
    if (!confirm(t.invoices.deleteConfirm)) return;
    deleteInvoiceMutation.mutate(id);
  };

  const handleDownloadPDF = async (id: string) => {
    downloadPDFMutation.mutate(id);
  };

  const getStatusColor = (
    status: string
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'DRAFT':
        return 'warning';
      case 'SENT':
        return 'info';
      case 'PAID':
        return 'success';
      case 'OVERDUE':
        return 'error';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    return t.invoices.statuses[status as keyof typeof t.invoices.statuses] || status;
  };

  if (isLoading) {
    return (
      <Box
        sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box textAlign='center'>
          <CircularProgress size={60} />
          <Typography variant='h6' sx={{ mt: 2 }}>
            {t.common.loading}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
          <Box display='flex' alignItems='center' gap={2}>
            <Box>
              <Typography variant='h3' component='h1' gutterBottom>
                {t.invoices.title}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {t.invoices.subtitle}
              </Typography>
            </Box>
          </Box>
          <Box display='flex' alignItems='center' gap={2}>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              component={Link}
              href='/invoices/create'
              variant='contained'
              startIcon={<AddIcon />}
              size='large'
            >
              {t.navigation.newInvoice}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error.message || t.notifications.invoicesLoadError}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t.invoices.invoiceNumber}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t.invoices.client}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t.invoices.issueDate}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t.invoices.status}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t.invoices.total}</TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  {t.common.actions}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center' sx={{ py: 8 }}>
                    <Box textAlign='center'>
                      <DescriptionIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                      <Typography variant='h6' color='text.secondary' gutterBottom>
                        {t.invoices.noInvoices}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {t.invoices.noInvoicesDescription}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice: Invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography variant='body2' fontWeight='medium'>
                        {invoice.invoiceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{invoice.client.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(invoice.status)}
                        color={getStatusColor(invoice.status)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight='medium'>
                        {invoice.total.toLocaleString()} {invoice.currency}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Stack direction='row' spacing={1} justifyContent='flex-end'>
                        <Tooltip title={t.invoices.downloadPDF}>
                          <IconButton
                            size='small'
                            onClick={() => handleDownloadPDF(invoice.id)}
                            color='primary'
                            disabled={downloadPDFMutation.isPending}
                          >
                            {downloadPDFMutation.isPending ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DownloadIcon fontSize='small' />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.common.view}>
                          <IconButton
                            size='small'
                            component={Link}
                            href={`/invoices/${invoice.id}`}
                            color='default'
                          >
                            <VisibilityIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.common.edit}>
                          <IconButton
                            size='small'
                            component={Link}
                            href={`/invoices/${invoice.id}/edit`}
                            color='primary'
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.common.delete}>
                          <IconButton
                            size='small'
                            onClick={() => handleDelete(invoice.id)}
                            color='error'
                            disabled={deleteInvoiceMutation.isPending}
                          >
                            {deleteInvoiceMutation.isPending ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteIcon fontSize='small' />
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
  );
}
