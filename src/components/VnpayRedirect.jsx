import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VnpayRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🔍 VnpayRedirect mounted");
    console.log("📍 Current URL:", window.location.href);

    // Delay nhỏ để React Router parse xong pathname + query
    setTimeout(() => {
      const query = location.search;
      console.log("➡️ Điều hướng sang /payment-result với query:", query);

      navigate(`/payment-result${query}`, { replace: true });
    }, 10);  // 👈 Delay giúp tránh lỗi 404

  }, [navigate, location.search]);

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h3>🔄 Đang chuyển hướng đến trang kết quả thanh toán...</h3>
    </div>
  );
}