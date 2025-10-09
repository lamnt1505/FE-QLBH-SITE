import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentResult() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      const res = await fetch(
        `http://localhost:8080/vnpay-return${window.location.search}`
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
      {result.amount && <p>Số tiền: {result.amount} VND</p>}
      {result.orderId && <p>Mã đơn hàng: {result.orderId}</p>}
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
        Quay về đơn hàng của tôi
      </button>
    </div>
  );
}
