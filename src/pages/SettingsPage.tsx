import { useState } from 'react';
import type { FormEvent } from 'react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, language, toggleTheme, setLanguage } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notifications'>('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
 //updated syntax and correct code above 11-13
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [shipmentAlerts, setShipmentAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>) },
    { id: 'security', name: 'Security', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>) },
    { id: 'preferences', name: 'Preferences', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>) },
    { id: 'notifications', name: 'Notifications', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>) },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings and preferences</p>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="col-span-9">
          <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 123 456 7890" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Position/Role</label>
                    <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Operations Manager" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Save Changes</button>
                </form>
              </div>
            )}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Password requirements:</strong><br/>• At least 8 characters<br/>• Include uppercase and lowercase letters<br/>• Include at least one number<br/>• Include at least one special character</p>
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Update Password</button>
                </form>
              </div>
            )}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Appearance</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Theme</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Choose light or dark mode</div>
                      </div>
                      <button onClick={toggleTheme} className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform flex items-center justify-center ${theme === 'dark' ? 'translate-x-11' : 'translate-x-1'}`}>{theme === 'dark' ? '🌙' : '☀️'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Language</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setLanguage('en')} className={`p-4 border-2 rounded-lg text-left transition-colors ${language === 'en' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                      <div className="font-semibold text-slate-900 dark:text-white">English</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">English (US)</div>
                    </button>
                    <button onClick={() => setLanguage('de')} className={`p-4 border-2 rounded-lg text-left transition-colors ${language === 'de' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                      <div className="font-semibold text-slate-900 dark:text-white">Deutsch</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">German</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Email Notifications</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</div>
                    </div>
                    <button onClick={() => setEmailNotifications(!emailNotifications)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Order Updates</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Notifications for order status changes</div>
                    </div>
                    <button onClick={() => setOrderUpdates(!orderUpdates)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${orderUpdates ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${orderUpdates ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Shipment Alerts</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Real-time shipment tracking updates</div>
                    </div>
                    <button onClick={() => setShipmentAlerts(!shipmentAlerts)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${shipmentAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${shipmentAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">System Updates</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Notifications about system maintenance</div>
                    </div>
                    <button onClick={() => setSystemUpdates(!systemUpdates)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${systemUpdates ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${systemUpdates ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
