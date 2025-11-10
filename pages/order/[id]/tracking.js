// pages/orders/[id]/tracking.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Link from 'next/link';

export default function OrderTrackingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}/track`);
        if (res.ok) {
          const data = await res.json();
          setTimeline(data);
        } else {
          console.error('Failed to fetch');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="text-indigo-600">Home</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      {loading ? <div>Loading...</div> : (
        <>
          <p className="mb-4">Timeline for order <strong>#{id}</strong></p>
          {timeline.length === 0 ? <p>No tracking events yet.</p> : (
            <ul className="space-y-4">
              {timeline.map(evt => (
                <li key={evt._id ?? evt.createdAt} className="border rounded p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{(evt.status || '').charAt(0).toUpperCase() + evt.status.slice(1)}</div>
                      {evt.note && <div className="text-gray-600">{evt.note}</div>}
                      {evt.carrier && <div className="text-sm text-gray-600">Carrier: {evt.carrier} — {evt.trackingNumber}</div>}
                      {evt.trackingUrl && <div className="text-sm"><a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">Track shipment</a></div>}
                    </div>
                    <div className="text-sm text-gray-500">{format(new Date(evt.createdAt), 'PPP p')}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
