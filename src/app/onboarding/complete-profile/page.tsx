import { AuthLayout } from '@/components/auth/AuthLayout';
import { CompleteProfileForm } from '@/components/onboarding/CompleteProfileForm';

export default function CompleteProfilePage() {
  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Tell us a bit more about yourself"
    >
      <CompleteProfileForm />
    </AuthLayout>
  );
}




