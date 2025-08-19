// uniform-frontend/src/components/student/StudentSettings.tsx
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/context/useAuth';
import { deleteAccount } from '@/api'; // Import the deleteAccount API function
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Mail,
  Lock,
  Trash2,
  Shield,
  User,
  Bell,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import type { UserData } from '@/components/student/types';

interface StudentSettingsProps {
  userData: UserData;
  onLogout: () => void;
}

export default function StudentSettings({ userData }: StudentSettingsProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: true
  });

  // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail !== confirmEmail) {
      toast.error("Email Mismatch", {
        description: "The email addresses you entered do not match."
      });
      return;
    }
    setIsUpdatingEmail(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Verification Email Sent", {
        description: `We've sent a verification link to ${newEmail}. Please check your inbox.`
      });
      setNewEmail('');
      setConfirmEmail('');
    } catch (error) {
      console.error(error);
      toast.error("Update Failed", {
        description: "Could not send verification email. Please try again."
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // Handle password reset
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

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Password Required", {
        description: "Please enter your password to delete your account."
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Call the actual API function
      const success = await deleteAccount(deletePassword);

      if (success) {
        toast.success("Account Deleted", {
          description: "Your account has been permanently deleted."
        });
        logout();
        navigate({ to: '/login' });
      } else {
        toast.error("Deletion Failed", {
          description: "Could not delete your account. Please check your password and try again."
        });
      }
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Could not delete your account. Please try again.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast.error("Deletion Failed", {
        description: errorMessage
      });
    } finally {
      setIsDeletingAccount(false);
      setDeletePassword('');
    }
  };

  // Handle notification preferences change
  const handleNotificationChange = (type: 'email' | 'sms' | 'push') => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success("Preferences Updated", {
      description: `Notification preferences have been saved.`
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full h-fit grid-cols-2 sm:grid-cols-4 mb-2 gap-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Danger Zone</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-6">
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
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
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
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                </div>
                <Button
                  variant={notificationPreferences.email ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNotificationChange('email')}
                >
                  {notificationPreferences.email ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">SMS</span>
                  </div>
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via text message</p>
                  </div>
                </div>
                <Button
                  variant={notificationPreferences.sms ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNotificationChange('sms')}
                >
                  {notificationPreferences.sms ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates in your browser</p>
                  </div>
                </div>
                <Button
                  variant={notificationPreferences.push ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNotificationChange('push')}
                >
                  {notificationPreferences.push ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-red-200">
            <CardHeader className="text-red-600">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription className="text-red-500">
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Warning: This action is irreversible</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Deleting your account will permanently remove all your data, including applications,
                      academic records, and personal information. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="mt-2"
                  >
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Confirm Account Deletion</DialogTitle>
                    <DialogDescription>
                      Are you absolutely sure you want to delete your account? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-4 py-4">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-10 w-10 text-red-500" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>
                        All your data will be permanently removed, including:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Personal profile information</li>
                        <li>Academic records</li>
                        <li>Application history</li>
                        <li>Account settings</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Enter your password to confirm</Label>
                    <div className="relative">
                      <Input
                        id="delete-password"
                        type={showDeletePassword ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                      >
                        {showDeletePassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeletePassword('')}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={!deletePassword || isDeletingAccount}
                    >
                      {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}