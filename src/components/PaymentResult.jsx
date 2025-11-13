import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/config.js";

export default function PaymentResult() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('💳 PaymentResult mounted');g
    console.log('📝 Query string:', window.location.search);
    
    const fetchResult = async () => {
      const res = await fetch(
        `${API_BASE_URL}/vnpay-return${window.location.search}`
      );
      
      const data = await res.json();
      console.log("👉 Gọi API:", data);
      setResult(data);
    };
    fetchResult();
  }, []);

  if (!result) return <p>Đang kiểm tra giao dịch...</p>;

  return (
    <div style={{ padding: 20 }}>
      {result.status === "success" ? (
        <h2 style={{ color: "green" }}>✅ {result.message}</h2>
      ) : (
        <h2 style={{ color: "red" }}>❌ {result.message}</h2>
      )}
      {result.amount && <p>SỐ TIỀN: {result.amount} VND</p>}
      {result.orderId && <p>MÃ ĐƠN HÀNG: {result.orderId}</p>}
      <button
        onClick={() => navigate("/myorder")}
            className="btn"
            style={{
              background: "linear-gradient(45deg, #4facfe, #00f2fe)",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "30px",
              padding: "8px 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
      >
        QUAY VỀ ĐƠN HÀNG CỦA TÔI
      </button>
    </div>
  );
}
