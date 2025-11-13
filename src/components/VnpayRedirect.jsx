import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VnpayRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 VnpayRedirect mounted');
    console.log('📍 Current URL:', window.location.href);
    console.log('📝 Query string:', window.location.search);
    const query = window.location.search;

    console.log('✅ Có query params, chuyển sang /payment-result');
    navigate(`/payment-result${query}`, { replace: true });
  }, [navigate]);

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h3>🔄 Đang chuyển hướng đến trang kết quả thanh toán...</h3>
    </div>
  );
}