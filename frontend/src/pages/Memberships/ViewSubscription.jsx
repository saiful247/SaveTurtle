import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner"; // Assuming you have a Spinner component
import { MdReceipt } from "react-icons/md"; // Example icon
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ViewSubscription = () => {
  const { id } = useParams(); // Get the subscription ID from the URL
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/subscriptions/${id}`) // Fetch subscription by ID
      .then((response) => {
        setSubscription(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Subscription Receipt", 14, 16);

    const tableColumn = ["Field", "Details"];
    const tableRows = [
      ["User ID", subscription.userId],
      ["First Name", subscription.firstName],
      ["Last Name", subscription.lastName],
      ["Email", subscription.email],
      ["Payment Slip", subscription.paymentSlip], // You can add the path to the payment slip here
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("subscription-receipt.pdf");
  };

  if (loading) {
    return <Spinner />; // Show spinner while loading
  }

  if (!subscription) {
    return <p>No subscription found</p>; // If no subscription is found
  }

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        Subscription Details
      </h1>
      <div className="border-2 border-blue-400 rounded-lg shadow-lg p-6 mx-auto w-full max-w-md bg-white">
        <div className="flex items-center justify-center mb-4">
          <MdReceipt className="text-5xl text-blue-700 mr-2" />
          <h2 className="text-2xl font-semibold">
            Your Subscription Information
          </h2>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>First Name:</strong> {subscription.firstName}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Last Name:</strong> {subscription.lastName}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Email:</strong> {subscription.email}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Payment Slip:</strong>
            <a
              href={`/subscriptions/${subscription._id}/payment-slip`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Payment Slip
            </a>
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Subscription Date:</strong>{" "}
            {new Date(subscription.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all mt-4"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default ViewSubscription;
