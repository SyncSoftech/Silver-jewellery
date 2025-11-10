// pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { format } from 'date-fns';

// Dynamically import charts with no SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [salesRes, ordersRes, productsRes, customersRes, orderAnalyticsRes] = await Promise.all([
          fetch('/api/admin/analytics/sales', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/products/count', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/users/count', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/analytics/orders', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const [sales, orders, products, customers, orderAnalytics] = await Promise.all([
          salesRes.json(),
          ordersRes.json(),
          productsRes.json(),
          customersRes.json(),
          orderAnalyticsRes.json()
        ]);

        setStats({
          totalSales: sales.total,
          totalOrders: orders.length,
          totalProducts: products.count,
          totalCustomers: customers.count,
          orderAnalytics,
          recentOrders: Array.isArray(orders) ? orders.slice(0, 5) : [] // Get the 5 most recent orders
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate last 12 months data
  const generateMonthlyData = (orders) => {
    const monthlyData = Array(12).fill(0);
    const monthlyOrders = Array(12).fill(0);
    const now = new Date();
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthDiff = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());
      
      if (monthDiff >= 0 && monthDiff < 12) {
        const monthIndex = 11 - monthDiff; // Most recent month at the end
        monthlyData[monthIndex] += order.amount || 0;
        monthlyOrders[monthIndex] += 1;
      }
    });
    
    return { monthlyData, monthlyOrders };
  };

  // Get month names for the last 12 months
  const getMonthNames = () => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      date.setMonth(date.getMonth() - 1);
      months.unshift(date.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  const { monthlyData, monthlyOrders } = generateMonthlyData(stats.recentOrders || []);
  const monthNames = getMonthNames();

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#4F46E5', '#10B981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: monthNames,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Sales ($)',
          style: {
            color: '#4F46E5'
          }
        },
        labels: {
          style: {
            colors: '#4F46E5'
          },
          formatter: (value) => `$${value.toLocaleString()}`
        }
      },
      {
        opposite: true,
        title: {
          text: 'Orders',
          style: {
            color: '#10B981'
          }
        },
        labels: {
          style: {
            colors: '#10B981'
          }
        }
      }
    ],
    tooltip: {
      x: {
        format: 'MMM yyyy'
      },
      y: [
        {
          formatter: (value) => `$${value.toLocaleString()}`
        },
        {
          formatter: (value) => `${value} orders`
        }
      ]
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -10
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4
    }
  };

  const chartSeries = [
    {
      name: 'Sales',
      type: 'area',
      data: monthlyData
    },
    {
      name: 'Orders',
      type: 'line',
      data: monthlyOrders
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="w-4 h-4" /> },
      'processing': { color: 'bg-blue-100 text-blue-800', icon: <FiClock className="w-4 h-4" /> },
      'completed': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="w-4 h-4" /> },
      'shipped': { color: 'bg-indigo-100 text-indigo-800', icon: <FiTruck className="w-4 h-4" /> },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <FiXCircle className="w-4 h-4" /> },
      'refunded': { color: 'bg-gray-100 text-gray-800', icon: <FiDollarSign className="w-4 h-4" /> }
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', icon: null };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiDollarSign className="h-6 w-6" />} 
          title="Total Sales" 
          value={`$${stats.totalSales.toLocaleString()}`} 
          color="bg-green-100 text-green-600" 
        />
        <StatCard 
          icon={<FiShoppingCart className="h-6 w-6" />} 
          title="Total Orders" 
          value={stats.totalOrders.toLocaleString()} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          icon={<FiPackage className="h-6 w-6" />} 
          title="Total Products" 
          value={stats.totalProducts.toLocaleString()} 
          color="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          icon={<FiUsers className="h-6 w-6" />} 
          title="Total Customers" 
          value={stats.totalCustomers.toLocaleString()} 
          color="bg-yellow-100 text-yellow-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales & Orders Overview</h2>
          <div className="h-80">
            <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Pending</span>
                <span className="text-sm font-medium text-gray-900">{stats.orderAnalytics?.pending || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.orderAnalytics?.pending / Math.max(stats.totalOrders, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Processing</span>
                <span className="text-sm font-medium text-gray-900">{stats.orderAnalytics?.processing || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.orderAnalytics?.processing / Math.max(stats.totalOrders, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Completed</span>
                <span className="text-sm font-medium text-gray-900">{stats.orderAnalytics?.completed || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.orderAnalytics?.completed / Math.max(stats.totalOrders, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-800 text-sm">
            View All Orders →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/admin/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900">
                        #{order.orderId || order._id.substring(18, 24).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer?.name  || 'Guest'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status || 'pending')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}