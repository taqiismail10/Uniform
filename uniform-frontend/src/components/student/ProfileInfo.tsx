import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Camera, Save, X } from 'lucide-react';
import type { UserData } from '@/components/student/types';

interface ProfileInfoProps {
  userData: UserData;
  onLogout: () => void;
  onUpdate?: (updatedData: Partial<UserData>) => void;
}

export default function ProfileInfo({ userData, onLogout, onUpdate }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData>({ ...userData });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ ...userData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          Profile Information
          {!isEditing && onUpdate && (
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-xl font-semibold text-gray-600">
                    {userData.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1.5 shadow-md hover:bg-gray-800 transition-colors"
                onClick={triggerFileInput}
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {isEditing && (
            <p className="text-sm text-gray-500 text-center">
              Click the camera icon to update your profile picture
            </p>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            {isEditing ? (
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 font-medium">{userData.userName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 font-medium">{userData.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            {isEditing ? (
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 font-medium">{userData.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 font-medium">{userData.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 font-medium">
                {new Date(userData.dob).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="examPath">Exam Path</Label>
            <p className="text-gray-900 font-medium">{userData.examPath}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium">Medium</Label>
            <p className="text-gray-900 font-medium">{userData.medium}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveClick} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}

        {/* Logout Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={onLogout}
            disabled={isLoading}
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}