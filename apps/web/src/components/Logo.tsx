import { Box } from '@mui/material';
import Image from 'next/image';

const Logo = () => {
  return (
    <Box>
      <Image src='/racunko-logo-2.png' alt='Logo' width={100} height={100} />
    </Box>
  );
};

export default Logo;
