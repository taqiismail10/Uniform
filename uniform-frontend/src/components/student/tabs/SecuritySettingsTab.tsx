// uniform-frontend/src/components/student/tabs/SecuritySettingsTab.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import type { UserData } from '../types';

interface SecuritySettingsTabProps {
  userData: UserData;
}

export default function SecuritySettingsTab({ userData }: SecuritySettingsTabProps) {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Reset Email Sent", {
        description: `We've sent a password reset link to ${userData.email}. Please check your inbox.`
      });
    } catch (error) {
      console.error(error);
      toast.error("Reset Failed", {
        description: "Could not send password reset email. Please try again."
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password
          </CardTitle>
          <CardDescription>
            Change your account password. We'll send a reset link to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              For security reasons, we'll send a password reset link to your registered email address.
            </p>
            <Button
              onClick={handlePasswordReset}
              disabled={isResettingPassword}
              className="mt-2"
            >
              {isResettingPassword ? 'Sending Reset Link...' : 'Send Password Reset Email'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-factor authentication is not enabled</p>
              <p className="text-sm text-gray-600 mt-1">
                Protect your account with an additional security layer.
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}