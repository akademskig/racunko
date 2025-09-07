import { Box } from '@mui/material';
import Image from 'next/image';

const Logo = () => {
  return (
    <Box>
      <Image src='/racunko-logo.png' alt='Logo' width={140} height={55} />
    </Box>
  );
};

export default Logo;
