import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VNPayCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      localStorage.setItem("orderConfirmed", "true");
      navigate("/cart/checkout/ordersuccess");
    } else if (status === "failed" || status === "error") {
      navigate("/cart/checkout/orderfailed");
    } else if (status === "cancel") {
      navigate("/cart/checkout/pending");
    }
  }, [navigate]);

  return <div>Processing payment...</div>;
}
