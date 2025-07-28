import { useSearchParams, useNavigate } from 'react-router-dom';
import { EmailVerification } from '@/components/EmailVerification';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleVerificationSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <EmailVerification 
      email={email} 
      onVerificationSuccess={handleVerificationSuccess} 
    />
  );
};

export default EmailVerificationPage;