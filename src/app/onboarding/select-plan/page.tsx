import { AuthLayout } from '@/components/auth/AuthLayout';
import { SelectPlanForm } from '@/components/onboarding/SelectPlanForm';

export default function SelectPlanPage() {
  return (
    <AuthLayout
      title="Choose your plan"
      subtitle="Select the perfect plan for your team"
    >
      <SelectPlanForm />
    </AuthLayout>
  );
}




