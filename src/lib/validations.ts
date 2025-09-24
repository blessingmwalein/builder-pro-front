import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  device_name: yup.string().default('web'),
});

export const completeProfileSchema = yup.object({
  name: yup.string().optional(),
  position: yup.string().required('Position is required'),
  account_type: yup.mixed<'company' | 'individual'>().oneOf(['company', 'individual']).required('Account type is required'),
  phone: yup.string().required('Phone is required'),
  avatar_url: yup.string().url('Must be a valid URL').optional(),
});

export const createCompanySchema = yup.object({
  name: yup.string().required('Company name is required'),
  slug: yup
    .string()
    .matches(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only')
    .required('Slug is required'),
  phone: yup.string().required('Company phone is required'),
  country: yup.string().required('Country is required'),
  timezone: yup.string().required('Timezone is required'),
  currency: yup.string().required('Currency is required'),
});


