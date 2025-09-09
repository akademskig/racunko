'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Button,
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
// Using regular Grid instead of Grid2 for compatibility
import {
  Receipt as ReceiptIcon,
  Euro as EuroIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTranslation } from '@web/hooks/useTranslation';
import { useInvoices, Invoice } from '@web/hooks/useInvoices';
import { ThemeToggle } from '@web/components/ThemeToggle';
import { LanguageSwitcher } from '@web/components/LanguageSwitcher';
import { format, subDays, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import Logo from '@web/components/Logo';
import Link from 'next/link';
import { TopBar } from '@web/components/TopBar';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    label: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.2),
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Box display='flex' alignItems='center' gap={0.5}>
              <TrendingUpIcon
                sx={{ color: trend.value >= 0 ? 'success.main' : 'error.main', fontSize: 16 }}
              />
              <Typography
                variant='caption'
                color={trend.value >= 0 ? 'success.main' : 'error.main'}
              >
                {trend.value >= 0 ? '+' : ''}
                {trend.value}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {value}
        </Typography>
        <Typography variant='h6' color='text.primary' gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant='body2' color='text.secondary'>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return { color: 'success', icon: <CheckCircleIcon /> };
      case 'SENT':
        return { color: 'primary', icon: <PaymentIcon /> };
      case 'OVERDUE':
        return { color: 'error', icon: <WarningIcon /> };
      case 'DRAFT':
        return { color: 'warning', icon: <ScheduleIcon /> };
      case 'CANCELLED':
        return { color: 'default', icon: <CancelIcon /> };
      default:
        return { color: 'default', icon: <PendingIcon /> };
    }
  };

  const { color, icon } = getStatusColor(status);

  return (
    <Chip
      icon={icon}
      label={status}
      size='small'
      color={color as any}
      variant='outlined'
      sx={{ minWidth: 80 }}
    />
  );
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: invoices = [], isLoading, error, refetch } = useInvoices();

  const stats = useMemo(() => {
    if (!invoices.length) return null;

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const unpaidAmount = totalAmount - paidAmount;
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE').length;
    const recentInvoices = invoices.filter(inv =>
      isAfter(new Date(inv.issueDate), subDays(new Date(), 30))
    ).length;

    // Calculate this month's data
    const thisMonth = invoices.filter(inv => {
      const issueDate = new Date(inv.issueDate);
      return issueDate >= startOfMonth(new Date()) && issueDate <= endOfMonth(new Date());
    });
    const thisMonthAmount = thisMonth.reduce((sum, invoice) => sum + invoice.total, 0);

    // Calculate last month's data for comparison
    const lastMonth = invoices.filter(inv => {
      const issueDate = new Date(inv.issueDate);
      const lastMonthStart = startOfMonth(
        new Date(new Date().getFullYear(), new Date().getMonth() - 1)
      );
      const lastMonthEnd = endOfMonth(
        new Date(new Date().getFullYear(), new Date().getMonth() - 1)
      );
      return issueDate >= lastMonthStart && issueDate <= lastMonthEnd;
    });
    const lastMonthAmount = lastMonth.reduce((sum, invoice) => sum + invoice.total, 0);

    const monthlyGrowth =
      lastMonthAmount > 0 ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 : 0;

    return {
      totalInvoices,
      totalAmount,
      paidAmount,
      unpaidAmount,
      overdueInvoices,
      recentInvoices,
      thisMonthAmount,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    };
  }, [invoices]);

  const statusDistribution = useMemo(() => {
    const distribution: Record<Invoice['status'], number> = {
      DRAFT: 0,
      SENT: 0,
      PAID: 0,
      OVERDUE: 0,
      CANCELLED: 0,
    };

    invoices.forEach(invoice => {
      distribution[invoice.status]++;
    });

    return Object.entries(distribution).map(([status, count]) => ({
      status: status as Invoice['status'],
      count,
      percentage: invoices.length > 0 ? Math.round((count / invoices.length) * 100) : 0,
    }));
  }, [invoices]);

  const recentInvoices = useMemo(() => {
    return invoices
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5);
  }, [invoices]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4 }}>
        <Container maxWidth='xl'>
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
            <Box textAlign='center'>
              <Typography variant='h6' gutterBottom>
                Loading dashboard...
              </Typography>
              <LinearProgress sx={{ width: 200, mt: 2 }} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4 }}>
        <Container maxWidth='xl'>
          <Box textAlign='center' py={8}>
            <Typography variant='h6' color='error' gutterBottom>
              Failed to load dashboard data
            </Typography>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Please check if the API server is running
            </Typography>
            <IconButton onClick={() => refetch()} sx={{ mt: 2 }}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant='h3' fontWeight='bold' gutterBottom>
            Welcome to your Dashboard
          </Typography>
          <Typography variant='h6' color='text.secondary'>
            Here's an overview of your invoicing activity
          </Typography>
        </Box>

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Total Invoices'
                value={stats.totalInvoices}
                subtitle='All time'
                icon={<ReceiptIcon />}
                color={theme.palette.primary.main}
                trend={{ value: 12.5, label: 'vs last month' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Total Revenue'
                value={`€${stats.totalAmount.toLocaleString()}`}
                subtitle='All invoices'
                icon={<EuroIcon />}
                color={theme.palette.success.main}
                trend={{ value: stats.monthlyGrowth, label: 'vs last month' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Paid Amount'
                value={`€${stats.paidAmount.toLocaleString()}`}
                subtitle={`${Math.round((stats.paidAmount / stats.totalAmount) * 100)}% collected`}
                icon={<CheckCircleIcon />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Pending Amount'
                value={`€${stats.unpaidAmount.toLocaleString()}`}
                subtitle={`${stats.overdueInvoices} overdue`}
                icon={<ScheduleIcon />}
                color={theme.palette.warning.main}
              />
            </Grid>
          </Grid>
        )}

        {/* Charts and Details */}
        <Grid container spacing={3}>
          {/* Status Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Invoice Status Distribution
                </Typography>
                <Stack spacing={2}>
                  {statusDistribution.map(({ status, count, percentage }) => (
                    <Box key={status}>
                      <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                        <Box display='flex' alignItems='center' gap={1}>
                          <StatusBadge status={status} />
                          <Typography variant='body2'>{count} invoices</Typography>
                        </Box>
                        <Typography variant='body2' fontWeight='bold'>
                          {percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Invoices */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Recent Invoices
                </Typography>
                <Stack spacing={2}>
                  {recentInvoices.slice(0, 4).map(invoice => (
                    <Paper
                      key={invoice.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Box>
                          <Typography variant='body1' fontWeight='medium'>
                            {invoice.invoiceNumber}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {invoice.client.name}
                          </Typography>
                        </Box>
                        <Box textAlign='right'>
                          <Typography variant='body1' fontWeight='bold'>
                            €{invoice.total.toLocaleString()}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                        <StatusBadge status={invoice.status} />
                      </Box>
                    </Paper>
                  ))}
                  {recentInvoices.length === 0 && (
                    <Box textAlign='center' py={4}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant='body2' color='text.secondary'>
                        No invoices yet
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      component={Link}
                      href='/invoices'
                      fullWidth
                      variant='contained'
                      startIcon={<ReceiptIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Create Invoice
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      component={Link}
                      href='/clients'
                      fullWidth
                      variant='outlined'
                      startIcon={<PeopleIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Client
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      component={Link}
                      href='/companies'
                      fullWidth
                      variant='outlined'
                      startIcon={<BusinessIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Company Settings
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      component={Link}
                      href='/calendar'
                      fullWidth
                      variant='outlined'
                      startIcon={<CalendarIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      View Calendar
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
