"use client";

import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', values);

      // Show success notification
      toast.success('Login successful!', { autoClose: 2000 });

        setLoading(false);
        router.push('/admin/dashboard');
    } catch (error) {
      setLoading(false);
      toast.error('Login failed. Please try again.', { autoClose: 3000 });
    }
  };

  return (
    <>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    helperText={touched.email ? errors.email : ''}
                    error={touched.email && Boolean(errors.email)}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    helperText={touched.password ? errors.password : ''}
                    error={touched.password && Boolean(errors.password)}
                  />
                </Box>
                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Login
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
