import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Link as MuiLink } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import logom from '../assets/logom.png';
import bakanliklogo from '../assets/bakanliklogo.png';

const validationSchema = yup.object({
  email: yup
    .string('Email adresinizi girin')
    .email('Geçerli bir email adresi girin')
    .required('Email adresi gereklidir'),
  password: yup
    .string('Şifrenizi girin')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        
        navigate('/home');
      } catch (error) {
        console.error('Giriş hatası:', error.message);
        setErrors({ server: 'Giriş hatası: Lütfen tekrar deneyin.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} p={2} bgcolor="background.default">
        <Box
          component="img"
          src={bakanliklogo}
          alt="BLogo"
          sx={{
            height: 80,
            marginLeft: 2,
          }}
        />
        <Typography variant="h5" textAlign="center">
          Enerji ve Tabii Kaynaklar Bakanlığı
          <br />
          SGOM Web Sitesi Kontrol Yazılımı
        </Typography>
        <Box
          component="img"
          src={logom}
          alt="Logo"
          sx={{
            height: 80,
            marginRight: 2,
          }}
        />
      </Box>
      <Box
        sx={{
          width: 300,
          margin: 'auto',
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Giriş Yap
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Şifre"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />
          {formik.errors.server && (
            <Typography color="error" variant="body2">
              {formik.errors.server}
            </Typography>
          )}
          <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
            Giriş Yap
          </Button>
        </form>
        <MuiLink component={Link} to="/reset-password" sx={{ marginTop: 2 }}>
          Şifreni mi unuttun?
        </MuiLink>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
