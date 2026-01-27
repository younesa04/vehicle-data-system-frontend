import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, Truck, Users, Building2, 
  Building, FileSpreadsheet, Settings, LogOut, ChevronDown 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: FileText },
  { name: 'Shipments', href: '/shipments', icon: Truck },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Building2 },
  { name: 'Companies', href: '/companies', icon: Building },
  { name: 'Client Invoices', href: '/client-invoices', icon: FileSpreadsheet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const companies = [
  { id: 1, name: 'A&D International Car Trading' },
  { id: 2, name: 'Britannia Auto Exports' },
  { id: 3, name: 'Global Motors Ltd' },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const environment = import.meta.env.MODE;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo & Company */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white mb-1">{selectedCompany.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-400">{selectedCompany.name.split(' ').slice(1).join(' ')}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Version */}
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
          Version 1.0.0
          {environment === 'development' && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-yellow-900 rounded text-xs font-semibold">
              DEV
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Company Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCompanyMenu(!showCompanyMenu)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Building size={18} className="text-gray-600" />
                <span className="font-medium text-gray-700">{selectedCompany.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showCompanyMenu && (
                <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowCompanyMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                        company.id === selectedCompany.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {company.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{user?.name || 'Demo User'}</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(user?.name || 'D')[0]}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition text-gray-700"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition text-red-600"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};