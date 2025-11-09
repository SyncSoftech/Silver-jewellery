// pages/order/success.js
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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=' + encodeURIComponent('/order/success' + window.location.search));
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { orderId } = router.query;
        console.log('Order ID from URL:', orderId);

        const lastOrderRaw = localStorage.getItem('lastOrder');
        let lastOrder = null;
        if (lastOrderRaw) {
          try { lastOrder = JSON.parse(lastOrderRaw); } catch (e) { console.error('Invalid lastOrder in localStorage', e); }
        }

        if (orderId && orderId !== 'undefined') {
          const token = localStorage.getItem('token');
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/${orderId}`, {
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.order) {
                setOrder(data.order);
                setLoading(false);
                return;
              }
            } else {
              console.warn('Order fetch failed:', response.status);
            }
          } catch (err) {
            console.error('Error fetching order from API:', err);
          }
        }

        // fallback to lastOrder in localStorage
        if (lastOrder) {
          // normalize fallback shape to match UI usage
          const normalized = {
            _id: lastOrder._id || lastOrder.orderId,
            amount: lastOrder.amount || lastOrder.totalAmount || lastOrder.total || 0,
            status: lastOrder.status || 'Processing',
            createdAt: lastOrder.createdAt || new Date().toISOString(),
            paymentMethod: lastOrder.paymentMethod || 'Online Payment (Razorpay)'
          };
          setOrder(normalized);
          setLoading(false);
          return;
        }

        setError('No order details found');
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchOrderDetails:', err);
        setError(err.message || 'An error occurred while fetching your order');
        setLoading(false);
      }
    };

    if (router.isReady) fetchOrderDetails();
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
          <Link href="/orders" className="text-indigo-600 hover:text-indigo-800 font-medium">View All Orders</Link>
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
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Order Placed Successfully!</h1>
          <p className="mt-4 text-lg text-gray-600">Thank you for your purchase. We've sent you an email with your order confirmation.</p>
          <p className="mt-2 text-sm text-gray-500">Order ID: {order?._id || 'N/A'}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order?._id || 'N/A'}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date placed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">₹{order?.amount ? Number(order.amount).toLocaleString('en-IN') : '0.00'}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Payment method</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order?.paymentInfo?.method || order?.paymentMethod || 'Online Payment (Razorpay)'}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order?.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order?.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order?.status === 'Paid' || order?.status === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{order?.status || 'Processing'}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link href="/orders" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">View All Orders</Link>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
