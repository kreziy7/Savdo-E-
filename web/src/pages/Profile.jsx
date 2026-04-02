import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Package, MapPin, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { OrderStatusBadge } from '../components/ui/Badge';
import * as ordersApi from '../api/orders.api';
import api from '../api/axios';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Lock },
];

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersApi.getMyOrders({ limit: 10 }),
    enabled: activeTab === 'orders',
  });

  const orders = ordersData?.data?.data?.orders || [];

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/users/profile', profileForm);
      updateUser(res.data.data.user);
      toast.success('Profile updated');
    } catch (_) {
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/users/change-password', pwForm);
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (_) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Tabs sidebar */}
        <div className="card p-3 h-fit">
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="font-bold mb-4">Profile Information</h2>
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                <Input label="Full Name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                <Input label="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+1 234 567 8900" />
                <div>
                  <label className="label">Email</label>
                  <input className="input opacity-60" value={user?.email} disabled />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <Button type="submit" isLoading={saving}>Save Changes</Button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card p-6">
              <h2 className="font-bold mb-4">Order History</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-xl p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <OrderStatusBadge status={order.orderStatus} />
                      <span className="font-bold text-sm">${order.totalPrice?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <h2 className="font-bold mb-4">Saved Addresses</h2>
              {user?.addresses?.length === 0 ? (
                <p className="text-gray-500 text-sm">No addresses saved yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {user?.addresses?.map((addr) => (
                    <div key={addr._id} className="border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium badge bg-gray-100 dark:bg-gray-800">{addr.label}</span>
                        {addr.isDefault && <span className="text-xs text-primary-600">Default</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{addr.street}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{addr.country}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="font-bold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
                <Input label="Current Password" type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                <Input label="New Password" type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required placeholder="Min 8 chars, uppercase & number" />
                <Button type="submit" isLoading={saving}>Update Password</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
