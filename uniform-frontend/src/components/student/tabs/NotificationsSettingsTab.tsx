// uniform-frontend/src/components/student/tabs/NotificationsSettingsTab.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Bell } from 'lucide-react';

export default function NotificationsSettingsTab() {
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: true
  });

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
  );
}