import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useInvoiceNotifications} from '../hooks/useWebSocket';

interface Invoice {
    id: number;
    amount: number;
    reference: string;
    formattedAmount?: string; // Optional if your backend sends virtual properties
}

export const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvoices = async () => {
        try {
            const response = await fetch('/api/invoices');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Initial Load
    useEffect(() => {
        fetchInvoices();
    }, []);

    // 2. 🚀 Real-time Update: Refetch when a new invoice event arrives
    useInvoiceNotifications(() => {
        fetchInvoices();
    });

    if (loading) return <div className="p-6">Loading invoices...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
                <Link
                    to="/test-data"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
                >
                    + Create New
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                No invoices found. Create one to get started!
                            </td>
                        </tr>
                    ) : (
                        invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{invoice.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.reference}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex flex-col">
                                        <span className="font-bold">${invoice.amount.toFixed(2)}</span>
                                        {invoice.paid > 0 && (
                                            <span
                                                className="text-xs text-green-600">Paid: ${invoice.paid.toFixed(2)}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {invoice.status === 'paid' ? (
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                          Paid
                                        </span>
                                    ) : (
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                          Due: ${invoice.balance.toFixed(2)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {invoice.status !== 'paid' && (
                                        <Link to={`/payment/${invoice.id}`}
                                              className="text-blue-600 hover:text-blue-900 font-bold">
                                            Pay
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
