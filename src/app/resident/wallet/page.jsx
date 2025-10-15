'use client';
import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  BanknotesIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { get } from 'idb-keyval';

export default function Wallet() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' | 'error' | 'warning' | 'info'
  });

  // Mock wallet data - in real app, fetch from API
  useEffect(() => {
    const loadWalletData = async () => {
      const residentData = await get('resident_data');
    };

    loadWalletData();
  }, []);

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || !phoneNumber) {
      alert('Please fill in all fields');
      return;
    }

    //Validate Phone Number
    const phoneRegex = /^\+?[1-10]\d{7,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid phone number');
      return;
    }

    //Validate Amount
    const amountRegex = /^\d+(\.\d{2})?$/;
    if (!amountRegex.test(topUpAmount)) {
      alert('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual payment integration
      await new Promise(resolve => setTimeout(resolve, 4000));

      const newTransaction = {
        id: Date.now(),
        type: 'credit',
        amount: parseFloat(topUpAmount),
        description: `Top up via ${selectedPaymentMethod.toUpperCase()}`,
        date: new Date().toISOString(),
        status: 'completed'
      };

    //   setTransactions(prev => [newTransaction, ...prev]);
    //   setWalletBalance(prev => prev + parseFloat(topUpAmount));
    setShowTopUpModal(false);
    setTopUpAmount('');
    setPhoneNumber('');
    
    setModal({
      show: true,
      title: 'Top Up under development',
      message: 'Top up feature is currently under development. Please try again later.',
      type: 'info'
    });

    } catch (error) {
      alert('Top up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const faqs = [
    {
      question: "How does GreenBin's wallet system work?",
      answer: "GreenBin wallet allows you to pay for waste collection services digitally. You can top up your wallet using MTN Mobile Money or Telecel Cash, and use the balance to pay for waste collection requests automatically."
    },
    {
      question: "What are the benefits of using GreenBin wallet?",
      answer: "Using GreenBin wallet provides cashless payments, instant payment confirmation, transaction history tracking, and seamless integration with waste collection services. It eliminates the need for cash payments during collection."
    },
    {
      question: "How do I top up my GreenBin wallet?",
      answer: "You can top up your wallet using MTN Mobile Money or Telecel Cash. Select your preferred mobile money provider, enter your phone number and amount, then confirm the payment through your mobile money PIN."
    },
    {
      question: "What happens if my wallet balance is insufficient?",
      answer: "If your wallet balance is insufficient for a waste collection request, you'll need to top up your wallet first. The system will prompt you to add funds before proceeding with the collection request."
    },
    {
      question: "Are there any fees for using GreenBin wallet?",
      answer: "GreenBin does not charge any fees for wallet transactions. However, your mobile money provider may have their own charges for mobile money transfers."
    },
    {
      question: "How secure are wallet transactions?",
      answer: "All wallet transactions are secured with industry-standard encryption. Mobile money payments go through your provider's secure network, and GreenBin never stores your mobile money PIN or sensitive financial information."
    },
    {
      question: "Can I get a refund for wallet top-ups?",
      answer: "Wallet top-ups are generally non-refundable as they represent funds loaded into your account. However, if you encounter any issues, please contact GreenBin support for assistance."
    },
    {
      question: "What should I do if a payment fails?",
      answer: "If a payment fails, first check your mobile money balance and try again. If the issue persists, contact GreenBin support with your transaction reference number for assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        {modal.show && modal.type === 'info' && (<>
            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ show: false, title: '', message: '', type: '' })}
            />
        </>)
          }
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">GreenBin Wallet</h1>
                <p className="text-sm text-gray-600">Manage your waste collection payments</p>
              </div>
            </div>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <ArrowDownIcon className="w-5 h-5" />
              Top Up Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Balance */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BanknotesIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Wallet Balance</h3>
                <p className="text-3xl font-bold text-emerald-600 mb-4">
                  GH₵ {walletBalance.toFixed(2)}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available for payments</span>
                    <span className="font-medium text-green-600">GH₵ {walletBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending transactions</span>
                    <span className="font-medium text-yellow-600">
                      GH₵ {transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDownIcon className="w-5 h-5" />
                  Top Up Wallet
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  View Statement
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                <p className="text-sm text-gray-600 mt-1">Recent wallet activities</p>
              </div>

              <div className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions yet</p>
                    <p className="text-sm text-gray-500">Your wallet activities will appear here</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <ArrowDownIcon className="w-5 h-5" />
                            ) : (
                              <ArrowUpIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}GH₵ {transaction.amount.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {getStatusIcon(transaction.status)}
                            <span className="text-sm text-gray-600 capitalize">{transaction.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-600 mt-1">Everything you need to know about GreenBin wallet</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowTopUpModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">Top Up Wallet</h3>

            <form onSubmit={handleTopUp} className="space-y-5">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={selectedPaymentMethod === 'momo'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded text-white text-xs font-bold flex items-center justify-center">
                        MTN
                      </div>
                      MTN Mobile Money
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="telecel"
                      checked={selectedPaymentMethod === 'telecel'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                        T
                      </div>
                      Telecel Cash
                    </span>
                  </label>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedPaymentMethod === 'momo' ? 'MTN Mobile Money' : 'Telecel Cash'} Number
                </label>
                <input
                  type="tel"
                  placeholder="0241234567"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GH₵)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="50.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum top-up: GH₵ 1.00</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : `Top Up via ${selectedPaymentMethod.toUpperCase()}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


//Modal Component
const Modal = ({ show, title, message, type, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
