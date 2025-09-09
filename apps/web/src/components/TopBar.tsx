'use client';
import { alpha, Box } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import Logo from './Logo';
import { Container } from '@mui/material';
import { Button } from '@mui/material';
import { Link } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useTheme } from '@web/stores/appStore';
import { useTranslation } from '@web/hooks/useTranslation';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

export const TopBar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const { t } = useTranslation();
  return (
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
      <Container maxWidth='xl'>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' gap={2}>
            <Logo />
            {!isLanding && <Sidebar />}
          </Box>
          <Box display='flex' alignItems='center' gap={2}>
            <LanguageSwitcher />
            <ThemeToggle />
            {isLanding && (
              <Button
                component={Link}
                href={`/invoices`}
                variant='contained'
                endIcon={<ArrowForward />}
                sx={{ borderRadius: 2 }}
              >
                {t.landing.header.getStarted}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
