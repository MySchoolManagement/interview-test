import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const PaymentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [balance, setBalance] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState('');

  const fetchBalance = async () => {
    const res = await fetch(`/api/balance/${id || ''}`); // Fetch global or invoice specific
    const data = await res.json();
    setBalance(data.balance);
  };

  useEffect(() => {
    fetchBalance();
  }, [id]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountFloat = parseFloat(paymentAmount);
    const invoiceIdInt = id ? parseInt(id, 10) : null;

    if (!invoiceIdInt) {
      alert("Error: No Invoice ID found in URL");
      return;
    }
    if (isNaN(amountFloat) || amountFloat <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: amountFloat,
          invoice_id: invoiceIdInt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation Errors:", errorData);
        alert(`Error: ${errorData.detail || 'Validation failed'}`);
        return;
      }

      setPaymentAmount('');
      fetchBalance();
      alert("Payment Successful!");

    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-blue-100 p-4 rounded mb-6">
        <h1 className="text-2xl font-bold">Current Balance: ${balance.toFixed(2)}</h1>
      </div>

      <div className="border p-4 rounded shadow">
        <h2 className="text-xl mb-4">Make a Payment {id && `for Invoice #${id}`}</h2>
        <form onSubmit={handlePayment}>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 mr-2 rounded"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};
