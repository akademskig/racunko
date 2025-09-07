'use client';
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { ThemeToggle } from '@web/components/ThemeToggle';
import { LanguageSwitcher } from '@web/components/LanguageSwitcher';
import { useTranslation } from '@web/hooks/useTranslation';
import Link from 'next/link';
import Logo from '@web/components/Logo';

export default function LandingPage() {
  const { t } = useTranslation();
  const theme = useTheme();

  const features = [
    {
      icon: <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t.landing.features.invoicing.title,
      description: t.landing.features.invoicing.description,
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t.landing.features.automation.title,
      description: t.landing.features.automation.description,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t.landing.features.security.title,
      description: t.landing.features.security.description,
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t.landing.features.cloud.title,
      description: t.landing.features.cloud.description,
    },
  ];

  const stats = [
    { number: '10K+', label: t.landing.stats.invoices },
    { number: '500+', label: t.landing.stats.clients },
    { number: '99.9%', label: t.landing.stats.uptime },
    { number: '24/7', label: t.landing.stats.support },
  ];

  const testimonials = [
    {
      name: t.landing.testimonials.user1.name,
      role: t.landing.testimonials.user1.role,
      content: t.landing.testimonials.user1.content,
      avatar: '👨‍💼',
    },
    {
      name: t.landing.testimonials.user2.name,
      role: t.landing.testimonials.user2.role,
      content: t.landing.testimonials.user2.content,
      avatar: '👩‍💻',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth='lg'>
          <Box display='flex' justifyContent='space-between' alignItems='center' py={2}>
            <Box display='flex' alignItems='center' gap={2}>
              <Logo />
            </Box>
            <Box display='flex' alignItems='center' gap={2}>
              <LanguageSwitcher />
              <ThemeToggle />
              <Button
                component={Link}
                href={`/invoices`}
                variant='contained'
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2 }}
              >
                {t.landing.header.getStarted}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth='lg'>
          <Grid container spacing={6} alignItems='center'>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Chip
                  label={t.landing.hero.badge}
                  color='primary'
                  variant='outlined'
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Typography
                  variant='h2'
                  component='h1'
                  fontWeight='bold'
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t.landing.hero.title}
                </Typography>
                <Typography variant='h6' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                  {t.landing.hero.subtitle}
                </Typography>
                <Stack direction='row' spacing={2} sx={{ mt: 4 }}>
                  <Button
                    component={Link}
                    href={`/invoices`}
                    variant='contained'
                    size='large'
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    {t.landing.hero.cta}
                  </Button>
                  <Button variant='outlined' size='large' sx={{ borderRadius: 2, px: 4 }}>
                    {t.landing.hero.demo}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: 4,
                    opacity: 0.1,
                    zIndex: -1,
                  },
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  }}
                >
                  <Stack spacing={3}>
                    <Box display='flex' alignItems='center' gap={2}>
                      <ReceiptIcon color='primary' />
                      <Typography variant='h6' fontWeight='bold'>
                        {t.landing.hero.demoTitle}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        {t.landing.hero.demoDescription}
                      </Typography>
                    </Box>
                    <Box display='flex' gap={1}>
                      <Chip label='PDF' size='small' color='primary' />
                      <Chip label='Email' size='small' color='secondary' />
                      <Chip label='Tracking' size='small' color='success' />
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Box textAlign='center'>
                <Typography variant='h3' fontWeight='bold' color='primary'>
                  {stat.number}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
        <Container maxWidth='lg'>
          <Box textAlign='center' mb={6}>
            <Typography variant='h3' component='h2' fontWeight='bold' gutterBottom>
              {t.landing.features.title}
            </Typography>
            <Typography variant='h6' color='text.secondary'>
              {t.landing.features.subtitle}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box mb={3}>{feature.icon}</Box>
                    <Typography variant='h5' fontWeight='bold' gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Box textAlign='center' mb={6}>
          <Typography variant='h3' component='h2' fontWeight='bold' gutterBottom>
            {t.landing.testimonials.title}
          </Typography>
          <Typography variant='h6' color='text.secondary'>
            {t.landing.testimonials.subtitle}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display='flex' alignItems='center' mb={3}>
                    <Avatar sx={{ mr: 2, fontSize: '2rem' }}>{testimonial.avatar}</Avatar>
                    <Box>
                      <Typography variant='h6' fontWeight='bold'>
                        {testimonial.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {testimonial.role}
                      </Typography>
                    </Box>
                    <Box ml='auto'>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: 'warning.main', fontSize: 20 }} />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant='body1' sx={{ fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          py: 8,
        }}
      >
        <Container maxWidth='md'>
          <Box textAlign='center' color='white'>
            <Typography variant='h3' component='h2' fontWeight='bold' gutterBottom>
              {t.landing.cta.title}
            </Typography>
            <Typography variant='h6' sx={{ mb: 4, opacity: 0.9 }}>
              {t.landing.cta.subtitle}
            </Typography>
            <Button
              component={Link}
              href={`/invoices`}
              variant='contained'
              size='large'
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                borderRadius: 2,
                px: 4,
                '&:hover': {
                  bgcolor: alpha('#fff', 0.9),
                },
              }}
            >
              {t.landing.cta.button}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
        <Container maxWidth='lg'>
          <Box textAlign='center'>
            <Typography variant='body2' color='text.secondary'>
              © 2024 Racunko. {t.landing.footer.rights}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
