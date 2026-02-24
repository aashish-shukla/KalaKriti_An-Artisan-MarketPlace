// artisan/app/(account)/account/page.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { userService } from '@/lib/api/services';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userService.updateProfile(formData);
      setUser(response.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}