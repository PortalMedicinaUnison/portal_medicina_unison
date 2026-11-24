import AuthCard from '../components/AuthCard';
import SignUpForm from '../components/SignUpForm';

function SignUpPage() {
  return (
    <AuthCard title="Crear cuenta" wide>
      <SignUpForm />
    </AuthCard>
  );
}

export default SignUpPage;
