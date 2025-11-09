// pages/order.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OrderPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // redirect if not logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent('/order' + (orderId ? `?orderId=${orderId}` : ''))}`);
      return;
    }

    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent('/order?orderId=' + orderId)}`);
          return;
        }
        if (res.status === 404) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to fetch order (${res.status})`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch order');
        }
        setOrder(data.order);
      } catch (err) {
        console.error('Error loading order:', err);
        setError(err.message || 'Could not load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-lg w-full bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Could not load order</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => router.back()} className="px-4 py-2 rounded bg-gray-200">Go Back</button>
            <Link href="/orders"><a className="px-4 py-2 rounded bg-indigo-600 text-white">My Orders</a></Link>
          </div>
        </div>
      </div>
    );
  }

  // Render order details
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-12 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Your Store</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
              Order {order.orderNumber || `#${order._id}`}
            </h1>

            <p className="leading-relaxed mb-4">Status: <strong>{order.status}</strong></p>

            <div className="flex mb-4 font-medium text-gray-700">
              <div className="flex-grow">Item Description</div>
              <div className="w-24 text-center">Quantity</div>
              <div className="w-28 text-right">Item Total</div>
            </div>

            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((it, i) => (
                <div key={i} className="flex border-t border-gray-200 py-4">
                  <div className="flex-grow">
                    <div className="text-gray-900">{it.name}</div>
                    <div className="text-sm text-gray-500">{it.product ? `ProductId: ${it.product}` : ''}</div>
                  </div>
                  <div className="w-24 text-center text-gray-900">{it.quantity}</div>
                  <div className="w-28 text-right text-gray-900">₹{Number(it.price * it.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))
            ) : (
              <div className="py-4 text-gray-500">No items found for this order.</div>
            )}

            <div className="flex border-t border-b mt-6 mb-6 border-gray-200 py-6">
              <div className="flex-grow">
                <p className="text-gray-700">Shipping Address</p>
                <p className="text-gray-900">
                  {order.shippingAddress?.fullName}<br />
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.country}<br />
                  Phone: {order.shippingAddress?.phone}
                </p>
              </div>
              <div className="w-48">
                <p className="text-gray-500">Payment</p>
                <p className="text-gray-900">{order.paymentInfo?.method || order.paymentMethod || 'Online Payment (Razorpay)'}</p>
                <p className="text-sm text-gray-500">Payment status: {order.paymentInfo?.status || (order.isPaid ? 'paid' : 'pending')}</p>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="title-font font-medium text-2xl text-gray-900">Total: ₹{Number(order.amount).toLocaleString('en-IN')}</span>
              <div className="my-6">
                <button className="flex mx-0 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded mr-3">
                  Track Order
                </button>
                <button onClick={() => router.back()} className="ml-2 px-4 py-2 rounded border">Back</button>
              </div>
            </div>
          </div>

          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={order.orderItems?.[0]?.image || 'https://dummyimage.com/400x400'} />
        </div>
      </div>
    </section>
  );
}
