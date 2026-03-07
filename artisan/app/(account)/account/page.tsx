// artisan/app/(account)/account/page.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { userService } from '@/lib/api/services';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Info } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only send fields the backend allows: firstName, lastName, phone, avatar, address
      const response = await userService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setUser(response.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] p-12 text-center">
        <p className="text-[#6b5e54]">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#f0ebe4] p-6">
      <h1 className="text-2xl font-bold text-[#2d3436] mb-6">My Profile</h1>

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

        {/* Email is display-only — backend does not allow email changes */}
        <div>
          <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
            Email Address
          </label>
          <div className="flex items-center gap-3 px-4 py-2.5 border border-[#f0ebe4] rounded-xl bg-[#faf6f1] text-[#6b5e54]">
            <Mail className="w-4 h-4 text-[#c2703e]" />
            <span>{user.email}</span>
          </div>
          <p className="mt-1 text-xs text-[#6b5e54] flex items-center gap-1">
            <Info className="w-3 h-3" />
            Email address cannot be changed
          </p>
        </div>

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