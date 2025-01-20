import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

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

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        navigate('/home');
      } catch (error) {
        console.error('Kayıt hatası:', error.message);
        setErrors({ server: 'Kayıt hatası: Lütfen tekrar deneyin.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        width: 300,
        margin: 'auto',
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Kayıt Ol
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
          Kayıt Ol
        </Button>
      </form>
    </Box>
  );
};

export default Register;
