// ViewPaymentSlip.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner"; // Assuming you have a Spinner component

const ViewPaymentSlip = () => {
  const { id } = useParams(); // Get the subscription ID from the URL
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentSlip = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5555/subscriptions/${id}`
        );
        setPaymentSlip(response.data.paymentSlip);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load payment slip");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSlip();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!paymentSlip) return <p>No payment slip found</p>;
  //D:\Turtle Project\SaveTurtleFinal-1\backend\uploads\1728101932872-images.jpg
  return (
    <div className="flex flex-col items-center p-6 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        Payment Slip
      </h1>
      <div className="border-2 border-blue-400 rounded-lg shadow-lg p-6 bg-white">
        <img
          src={`http://localhost:5555/${paymentSlip}`}
          alt="Payment Slip"
          className="max-w-full max-h-screen"
        />
      </div>
    </div>
  );
};

export default ViewPaymentSlip;
