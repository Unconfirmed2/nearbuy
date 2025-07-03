import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileFormProps {
  user: any; // Pass the current user object
  profile: any; // Pass the current profile/user row (name, address, etc.)
  onUpdate?: () => void; // Optional callback after update
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ user, profile, onUpdate }) => {
  const [form, setForm] = useState({
    name: profile?.name || '',
    email: user?.email || '',
    address: profile?.address || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Update email/password in Supabase Auth
      if (form.email !== user.email || form.password) {
        const updates: any = {};
        if (form.email !== user.email) updates.email = form.email;
        if (form.password) {
          if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          updates.password = form.password;
        }
        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }
      // Update name/address in user/profile table
      const { error: dbError } = await supabase
        .from('users') // Change to 'profiles' if that's your table
        .update({
          name: form.name,
          address: form.address,
        })
        .eq('id', user.id);
      if (dbError) throw dbError;
      setSuccess('Profile updated successfully!');
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium">New Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default UserProfileForm;
