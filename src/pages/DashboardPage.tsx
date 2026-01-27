import { useQuery } from '@tanstack/react-query';
import { FileText, Truck, Package, DollarSign, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const dashboardApi = {
  getStats: async () => {
    const response = await fetch('http://localhost:8080/api/dashboard');
    return response.json();
  }
};

export const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats
  });

  const statCards = [
    {
      title: 'Active Orders',
      value: stats?.activeOrders || '24',
      change: '+12%',
      positive: true,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'In Transit',
      value: stats?.inTransit || '18',
      change: '+8%',
      positive: true,
      icon: Truck,
      color: 'orange'
    },
    {
      title: 'Pending Delivery',
      value: stats?.pendingDelivery || '6',
      change: '-3%',
      positive: false,
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || '€284K',
      change: '+15%',
      positive: true,
      icon: DollarSign,
      color: 'green'
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', client: 'AutoMax GmbH', vehicle: '2024 BMW X5', status: 'In Transit', value: '€52,000' },
    { id: 'ORD-002', client: 'Premium Motors', vehicle: '2024 Mercedes E-Class', status: 'Pending', value: '€48,500' },
    { id: 'ORD-003', client: 'Elite Cars Ltd', vehicle: '2024 Audi Q7', status: 'Confirmed', value: '€61,200' },
    { id: 'ORD-004', client: 'Luxury Imports', vehicle: '2024 Porsche Cayenne', status: 'In Transit', value: '€75,800' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            orange: 'bg-orange-100 text-orange-600',
            purple: 'bg-purple-100 text-purple-600',
            green: 'bg-green-100 text-green-600',
          }[stat.color];

          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link to="/orders" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ORDER ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CLIENT</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">VEHICLE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STATUS</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">VALUE</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-4 px-4 text-gray-700">{order.client}</td>
                  <td className="py-4 px-4 text-gray-700">{order.vehicle}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">{order.value}</td>
                  <td className="py-4 px-4 text-right">
                    <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions - Removed bottom cards, less cluttered */}
    </div>
  );
};
