import * as yup from 'yup';

// Register schema validation
export const registerSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
  device_name: yup.string().required(),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

// Project creation schema validation
export const createProjectSchema = yup.object().shape({
  code: yup.string().required('Project code is required'),
  title: yup.string().required('Project title is required'),
  description: yup.string().required('Description is required'),
  status: yup
    .string()
    .oneOf(['planned', 'in_progress', 'on_hold', 'completed', 'archived'], 'Invalid status')
    .required('Status is required'),
  location_text: yup.string().required('Location is required'),
  latitude: yup
    .number()
    .min(-90, 'Latitude must be >= -90')
    .max(90, 'Latitude must be <= 90')
    .required('Latitude is required'),
  longitude: yup
    .number()
    .min(-180, 'Longitude must be >= -180')
    .max(180, 'Longitude must be <= 180')
    .required('Longitude is required'),
  budget_total_cents: yup
    .number()
    .min(0, 'Budget must be at least 0')
    .required('Budget is required'),
  currency: yup.string().required('Currency is required'),
  start_date: yup.date().required('Start date is required'),
  end_date: yup
    .date()
    .min(yup.ref('start_date'), 'End date must be after start date')
    .required('End date is required'),
});

// Task creation schema validation
export const createTaskSchema = yup.object().shape({
  task_list_id: yup.number().required('Task list is required'),
  parent_task_id: yup.string().nullable(),
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  status: yup
    .string()
    .oneOf(['todo', 'in_progress', 'blocked', 'done'], 'Invalid status')
    .required('Status is required'),
  priority: yup.string().required('Priority is required'),
  start_date: yup.string().nullable(),
  due_date: yup
    .date()
    .required('Due date is required'),
  assignee_id: yup.string(),
//   progress_pct: yup
//     .number()
//     .min(0, 'Progress must be at least 0')
//     .max(100, 'Progress cannot exceed 100')
//     .required('Progress is required'),
//   estimate_hours: yup
//     .number()
//     .min(0, 'Estimate hours must be at least 0')
//     .required('Estimate hours is required'),
//   actual_hours: yup
//     .number()
//     .min(0, 'Actual hours must be at least 0')
//     .required('Actual hours is required'),
});