// uniform-frontend/src/components/student/tabs/AccountSettingsTab.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import { updateEmail } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import type { UserData } from '../types';

interface AccountSettingsTabProps {
  userData: UserData;
}

export default function AccountSettingsTab({ userData }: AccountSettingsTabProps) {
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address."
      });
      return;
    }

    if (newEmail !== confirmEmail) {
      toast.error("Email Mismatch", {
        description: "The email addresses you entered do not match."
      });
      return;
    }

    if (newEmail === userData.email) {
      toast.error("Same Email", {
        description: "Please enter a different email address than your current one."
      });
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const success = await updateEmail(userData.userId, newEmail);
      if (success) {
        toast.success("Verification Email Sent", {
          description: `We've sent a verification link to ${newEmail}. Please check your inbox and verify your new email.`
        });
        setNewEmail('');
        setConfirmEmail('');
      } else {
        toast.error("Update Failed", {
          description: "Could not update your email. Please try again."
        });
      }
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Could not update your email. Please try again.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast.error("Update Failed", {
        description: errorMessage
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Address
        </CardTitle>
        <CardDescription>
          Update your email address. We'll send a verification link to your new email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Current Email</Label>
            <Input
              id="current-email"
              type="email"
              value={userData.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-email">Confirm New Email</Label>
            <Input
              id="confirm-email"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Confirm your new email address"
              required
            />
          </div>
          <Button type="submit" disabled={isUpdatingEmail} className="mt-2">
            {isUpdatingEmail ? 'Sending Verification...' : 'Update Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}