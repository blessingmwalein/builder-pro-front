import { AuthLayout } from '@/components/auth/AuthLayout';
import { CreateCompanyForm } from '@/components/onboarding/CreateCompanyForm';

export default function CreateCompanyPage() {
  return (
    <AuthLayout
      title="Create your company"
      subtitle="Set up your organization to get started"
    >
      <CreateCompanyForm />
    </AuthLayout>
  );
}



