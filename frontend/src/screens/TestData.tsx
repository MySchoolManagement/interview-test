import React, { useState } from 'react';
import { useInvoiceNotifications } from '../hooks/useWebSocket';

export const TestData: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useInvoiceNotifications(() => {
    setLogs((prev) => [`New Invoice Detected at ${new Date().toLocaleTimeString()}`, ...prev]);
  });

  const createInvoice = async () => {
    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100.00, reference: 'TEST-DATA' }),
    });
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Actions</h2>
        <button 
          onClick={createInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Create Random Invoice ($100)
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded border shadow-inner h-64 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Live Event Log</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {logs.length === 0 && <li>Waiting for events...</li>}
          {logs.map((log, i) => <li key={i} className="border-b pb-1">{log}</li>)}
        </ul>
      </div>
    </div>
  );
};
