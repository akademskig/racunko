'use client'

import Link from "next/link";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper
} from '@mui/material';
import {
  Description,
  People,
  Business,
  Calculate
} from '@mui/icons-material';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            Računko
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Smart Invoice Management with Tax Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            Create, manage, and export invoices with automatic VAT calculations and
            real-time tax regulation updates from Croatian tax authorities.
          </Typography>
        </Box>

        <Grid container spacing={4} mb={8}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Description color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Invoices
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create and manage your invoices with automatic calculations
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href="/invoices" size="small">
                  Manage Invoices
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Clients
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage your client database and contact information
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href="/clients" size="small">
                  Manage Clients
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Business color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Company
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Configure your company details and settings
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href="/companies" size="small">
                  Manage Company
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Calculate color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Tax Rules
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View current tax rates and regulations
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href="/tax" size="small">
                  View Tax Rules
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Invoice Management
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" gutterBottom>
                  Create professional invoices
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Automatic VAT calculations
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  PDF export functionality
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Invoice status tracking
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Recurring invoice support
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Tax Intelligence
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" gutterBottom>
                  Real-time tax rate updates
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Croatian VAT regulations
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Automatic compliance checking
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Tax rule notifications
                </Typography>
                <Typography component="li" variant="body2" gutterBottom>
                  Multi-currency support
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}