import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Box } from '@mui/material';

const lightGreen = '#81c784';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#e7f5e9',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
});

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 10px',
  transition: 'transform 0.3s ease-in-out',
  ...(theme.palette.mode === 'dark' && {
    color: '#fff',
  }),
}));

export { lightTheme, darkTheme, IconWrapper, lightGreen };
