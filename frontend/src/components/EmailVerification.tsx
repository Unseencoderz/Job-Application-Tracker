import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Clock, RefreshCcw } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth';

interface EmailVerificationProps {
  email: string;
  onVerificationSuccess?: () => void;
}

export function EmailVerification({ email, onVerificationSuccess }: EmailVerificationProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { setUser } = useAuthStore();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const verifyEmailMutation = useMutation({
    mutationFn: authAPI.verifyEmail,
    onSuccess: (data) => {
      toast.success('Email verified successfully!');
      // Set user and authentication state
      if (data.user) {
        setUser(data.user);
      }
      onVerificationSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Verification failed');
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: authAPI.resendOTP,
    onSuccess: () => {
      toast.success('New OTP sent successfully!');
      setTimeLeft(300); // Reset timer
      setOtp(''); // Clear current OTP
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    verifyEmailMutation.mutate({ email, otp });
  };

  const handleResendOTP = () => {
    resendOTPMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={verifyEmailMutation.isPending || otp.length !== 6}
            >
              {verifyEmailMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          {timeLeft > 0 ? (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                OTP expires in {formatTime(timeLeft)}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                Your OTP has expired. Please request a new one.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOTP}
              disabled={resendOTPMutation.isPending || timeLeft > 240} // Allow resend after 1 minute
              className="w-full"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              {resendOTPMutation.isPending ? 'Sending...' : 'Resend OTP'}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}