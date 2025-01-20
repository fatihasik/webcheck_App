import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const validationSchema = yup.object({
  email: yup
    .string('Email adresinizi girin')
    .email('Geçerli bir email adresi girin')
    .required('Email adresi gereklidir'),
});

const ResetPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        setStatus({ success: 'Şifre sıfırlama e-postası gönderildi.' });
      } catch (error) {
        console.error('Şifre sıfırlama hatası:', error.message);
        setErrors({ server: 'Şifre sıfırlama hatası: Lütfen tekrar deneyin.' });
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
        Şifre Sıfırla
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
        {formik.errors.server && (
          <Typography color="error" variant="body2">
            {formik.errors.server}
          </Typography>
        )}
        {formik.status && formik.status.success && (
          <Typography color="success" variant="body2">
            {formik.status.success}
          </Typography>
        )}
        <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
          Şifre Sıfırla
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
