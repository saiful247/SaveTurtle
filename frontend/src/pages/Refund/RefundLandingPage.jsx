import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCcw, Clock, Shield, CheckCircle } from 'lucide-react';

const RefundLandingPage = () => {
  const navigate = useNavigate();

  const refundFeatures = [
    {
      icon: <RefreshCcw className="w-8 h-8 text-teal-500" />,
      title: "Quick Processing",
      description: "Most refunds are processed within 3-5 business days after approval"
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-500" />,
      title: "Secure Transactions",
      description: "Your financial information is protected with industry-standard encryption"
    },
    {
      icon: <Clock className="w-8 h-8 text-teal-500" />,
      title: "24/7 Submission",
      description: "Submit your refund request anytime, anywhere through our online portal"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-teal-500" />,
      title: "Easy Process",
      description: "Simple step-by-step form with clear instructions for quick submission"
    }
  ];

  const handleCreateRefund = () => {
    navigate('/userRefunds');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple and Secure Refund Processing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get your refund quickly and easily with our streamlined process
          </p>
          <button
            onClick={handleCreateRefund}
            className="group bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 flex items-center mx-auto"
          >
            Make a Refund
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {refundFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-teal-100 hover:border-teal-300 transition-all duration-200"
            >
              <div className="flex justify-center items-center mb-4">
                {feature.icon}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Refund Process Information */}
        <div className="max-w-3xl mx-auto bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Understanding Our Refund Process</h2>
          <div className="space-y-6 text-gray-700">
            <p>
              Our refund process is designed to be as straightforward as possible. Here's what you need to know:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <span className="font-semibold">Eligibility:</span> Refunds can be requested within 30 days of the original purchase date.
              </li>
              <li>
                <span className="font-semibold">Required Information:</span> You'll need your event name, user ID, and the email associated with your purchase.
              </li>
              <li>
                <span className="font-semibold">Documentation:</span> After submission, you'll receive both PDF and CSV copies of your refund request for your records.
              </li>
              <li>
                <span className="font-semibold">Processing Time:</span> Standard processing time is 3-5 business days, though some cases may require additional review.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundLandingPage;