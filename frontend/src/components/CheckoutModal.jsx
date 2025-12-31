import React, { useState, useEffect } from 'react';
import { orderAPI } from '../lib/api';
import { getAuth } from '../lib/auth';

export default function CheckoutModal() {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState(null);
  //const [email, setEmail] = useState('demo@demo.com');
  const [creating, setCreating] = useState(false);
  const authData = getAuth();
  const user = authData?.user; // Get logged-in user
  const email = user ? user.email : ''; // Use user's email or empty string if not logged in

  useEffect(() => {
    function handler(e) {
      setService(e.detail.service);
      setOpen(true);
    }
    window.addEventListener('openCheckout', handler);
    return () => window.removeEventListener('openCheckout', handler);
  }, []);

  if (!open || !service) return null;

  const handleCreateOrder = async () => {
    setCreating(true);
    try {
      const payload = { serviceName: service.title, customerEmail: email };
      const res = await orderAPI.create(payload);
      const order = res.data;
      // Call payments mock
      await fetch('/api/payments/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: String(order.id), method: 'mock' }) });
      // navigate to public order detail (non-dashboard)
      window.location.href = `/orders/${order.id}`;
    } catch (err) {
      console.error(err);
      alert('Failed to create order');
    } finally {
      setCreating(false);
      setOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 className="text-lg font-semibold">Checkout — {service.title}</h3>
        <p className="mt-2 text-sm text-gray-600">Select plan and complete payment to proceed. (Demo: mocked)</p>
        {email && (
          <div className="mt-4">
            <p className="block text-sm text-gray-600">Contact Email: {email}</p>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => { setOpen(false); setService(null); }} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleCreateOrder} disabled={creating} className="px-4 py-2 text-white bg-blue-600 rounded">{creating ? 'Processing...' : 'Pay & Avail'}</button>
        </div>
      </div>
    </div>
  );
}
