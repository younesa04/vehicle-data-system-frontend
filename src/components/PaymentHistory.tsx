import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments';

interface PaymentHistoryProps {
  orderId: number;
}

export default function PaymentHistory({ orderId }: PaymentHistoryProps) {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', orderId],
    queryFn: () => paymentsApi.getByOrderId(orderId)
  });

  if (isLoading) return <div className="text-center py-4">Loading payments...</div>;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">💳 Payment History</h3>
        <div className="text-sm">
          <span className="text-gray-600">Total Paid: </span>
          <span className="font-bold text-green-600">€{totalPaid.toFixed(2)}</span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No payments recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      €{payment.amount.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {payment.paymentType}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {payment.paymentStatus}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 Date: {payment.paymentDate}</p>
                    <p>💳 Method: {payment.paymentMethod}</p>
                    {payment.proofLink && (
                      <p>
                        🔗 <a href={payment.proofLink} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">View Proof</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
