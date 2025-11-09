import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsCheckCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../utils/auth';

export default function OrderSuccess() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

// Update the useEffect in success.js
// In success.js
useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login?redirect=' + encodeURIComponent('/order/success' + window.location.search));
      return;
    }
  
    const fetchOrderDetails = async () => {
      try {
        // Get orderId from URL
        const { orderId } = router.query;
        console.log('Order ID from URL:', orderId); // Debug log
        
        // Try to get order from localStorage as fallback
        const lastOrder = localStorage.getItem('lastOrder');
        let orderData = null;
        
        if (lastOrder) {
          try {
            orderData = JSON.parse(lastOrder);
            console.log('Order from localStorage:', orderData); // Debug log
          } catch (e) {
            console.error('Error parsing lastOrder from localStorage:', e);
          }
        }
  
        // If we have an orderId from URL, try to fetch from API
        if (orderId && orderId !== 'undefined') {
          const token = localStorage.getItem('token');
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/${orderId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
  
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setOrder(data.order);
                return;
              }
            }
            console.warn('Failed to fetch order from API, falling back to localStorage');
          } catch (error) {
            console.error('Error fetching order from API:', error);
          }
        }
  
        // If we couldn't get order from API, try localStorage
        if (orderData) {
          setOrder(orderData);
          setLoading(false);
          return;
        }
  
        // If we get here, we couldn't find the order
        setError('No order details found');
        setLoading(false);
  
      } catch (err) {
        console.error('Error in fetchOrderDetails:', err);
        setError(err.message || 'An error occurred while fetching your order');
        setLoading(false);
      }
    };
  
    // Only run this effect when router is ready and query is available
    if (router.isReady) {
      fetchOrderDetails();
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/orders" className="text-indigo-600 hover:text-indigo-800 font-medium">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <BsCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Order Placed Successfully!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your purchase. We've sent you an email with your order confirmation.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Order ID: {order?.orderId || 'N/A'}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order?.orderId || 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date placed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                  ₹{order?.totalAmount?.toLocaleString('en-IN') || '0.00'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Payment method</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order?.paymentMethod || 'Online Payment (Razorpay)'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order?.status === 'processing' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : order?.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order?.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order?.status ? order.status.replace('_', ' ') : 'Processing'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link 
            href="/orders" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View All Orders
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}   