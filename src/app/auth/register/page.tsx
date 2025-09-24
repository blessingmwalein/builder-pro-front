import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with Builder Pro"
    >
      <RegisterForm />
    </AuthLayout>
  );
}


