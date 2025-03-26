import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

export default function VerifyPayment() {
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { backendUrl, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("Invalid payment session.");
        toast.error("Invalid payment session.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${backendUrl}/bookings/verify-payment`,
          { sessionId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          setStatus("Payment Verified! Redirecting...");
          toast.success("Payment successful!");
          setTimeout(() => navigate("/my-bookings"), 3000);
        } else {
          setStatus("Payment failed. Please try again.");
          toast.error("Payment verification failed.");
        }
      } catch (err) {
        setStatus("Error verifying payment. Try again later.");
        toast.error("Error verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Verify Stripe Payment
        </h2>
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-3 text-gray-600">{status}</p>
          </div>
        ) : (
          <p className={`mt-3 ${status.includes("failed") ? "text-red-500" : "text-green-600"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
