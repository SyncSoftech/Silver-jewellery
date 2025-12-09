"use client";

import { useEffect, useState } from "react";

export default function UserGiftCards() {
  const [giftcards, setGiftcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  // form data
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");

  const userToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // decode token (no secret needed)
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const user = userToken ? decodeToken(userToken) : null;
  const userId = user?.user;

  // Fetch gift cards for logged-in user
  const loadGiftCards = async () => {
    if (!userId) return;

    setLoading(true);
    const res = await fetch(`/api/giftcards?userId=${userId}`);
    const data = await res.json();
    if (data.success) {
      setGiftcards(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGiftCards();
  }, [userId]);

  // Create Gift Card
  const handleCreate = async () => {
  if (!receiverName || !receiverEmail || !purpose || !amount) {
    alert("Please fill all details");
    return;
  }

  // 1️⃣ Create Razorpay Order
  const orderRes = await fetch("/api/payment/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const orderData = await orderRes.json();

  if (!orderData.success) {
    alert("Payment initialization failed");
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: "INR",
    name: "Gift Card Purchase",
    description: purpose,
    order_id: orderData.order.id,

    handler: async function (response) {
      // 2️⃣ Verify payment
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        alert("Payment verification failed");
        return;
      }

      // 3️⃣ Payment success → Create gift card + coupon
      const createRes = await fetch("/api/giftcards/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          receiverName,
          receiverEmail,
          purpose,
          amount,
          paymentId: response.razorpay_payment_id,
        }),
      });

      const createData = await createRes.json();

      if (createData.success) {
        alert("Gift Card Created! Email Sent.");
        setOpenForm(false);
        setReceiverName("");
        setReceiverEmail("");
        setPurpose("");
        setAmount("");
        loadGiftCards();
      } else {
        alert(createData.message || "Gift card creation failed");
      }
    },

    theme: {
      color: "#e11d48",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};


  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-rose-700 mb-6">🎁 Your Gift Cards</h1>

      <button
        onClick={() => setOpenForm(true)}
        className="px-4 py-3 bg-rose-600 text-white rounded-lg mb-5"
      >
        + Create New Gift Card
      </button>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : giftcards.length === 0 ? (
        <p className="text-gray-600">You haven't created any gift cards yet.</p>
      ) : (
        <div className="space-y-4">
          {giftcards.map((g) => (
            <div key={g._id} className="border rounded-lg p-4 shadow bg-white">
              <p><strong>Receiver:</strong> {g.receiverName}</p>
              <p><strong>Email:</strong> {g.receiverEmail}</p>
              <p><strong>Purpose:</strong> {g.purpose}</p>
              <p><strong>Amount:</strong> ₹{g.amount}</p>
              <p className="mt-2 text-rose-700 font-bold">
                Coupon Code: {g.couponCode}
              </p>
              <p className="text-xs text-gray-500">
                Expires: {new Date(g.expiryDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CREATE GIFT CARD MODAL */}
      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold text-rose-600 mb-4">
              Create Gift Card
            </h2>

            <input
              type="text"
              placeholder="Receiver Name"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="email"
              placeholder="Receiver Email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="text"
              placeholder="Purpose (Birthday, Gift, etc)"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="bg-rose-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Create
              </button>

              <button
                onClick={() => setOpenForm(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
