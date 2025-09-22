import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const alert = useAlert();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:8080/product-cart", {
          credentials: "include",
        });
        const data = await res.json();
        const mappedCart = (data.cart || []).map((item) => ({
          id: item.productID,
          name: item.name,
          price: item.price,
          amount: item.amount,
          imageUrl: item.imageBase64
            ? `data:image/jpeg;base64,${item.imageBase64}`
            : "https://via.placeholder.com/80",
        }));
        setCartItems(mappedCart);
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
      }
    };
    fetchCart();
  }, []);

  const removeItem = async (id) => {
    try {
      const res = await fetch(
        "http://localhost:8080/dossier-statistic/update--quantities",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: new URLSearchParams({ productID: id, amount: 0 }),
        }
      );

      const result = await res.text();
      if (result === "2") {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        alert.success("🗑 Xóa sản phẩm thành công!");
      } else {
        alert.error("❌ Xóa sản phẩm thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert.error("⚠ Lỗi hệ thống!");
    }
  };

  const updateQuantity = (id, amount) => {
    if (amount < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount } : item))
    );
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      alert.error("⚠ Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/dossier-statistic/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          discountCode,
          products: cartItems.map((item) => ({
            productID: item.id,
            price: item.price,
            quantity: item.amount,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setDiscountedTotal(data.discountedTotal);
        alert.success("✅ " + data.message);
      } else {
        alert.error("❌ " + data.message);
      }
    } catch (err) {
      console.error("Lỗi khi áp dụng mã giảm giá:", err);
      alert.error("⚠ Lỗi hệ thống!");
    }
  };

  const placeOrder = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/dossier-statistic/orders",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const result = await res.text();

      if (result === "1") {
        alert.success("Đặt hàng thành công!");
        setCartItems([]);
      } else if (result === "0") {
        alert.error("⚠ Bạn cần đăng nhập để đặt hàng.");
        setTimeout(() => navigate("/login"), 1500);
      } else if (result === "-1") {
        alert.error("Giỏ hàng trống, không thể đặt hàng.");
      } else {
        alert.error("Đặt hàng thất bại!");
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert.error("Lỗi hệ thống khi đặt hàng.");
    }
  };

  return (
    <div className="cart-page container py-4">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0 text-center">
            <thead className="table-dark">
              <tr>
                <th></th>
                <th className="text-start">Sản phẩm</th>
                <th>Giá tiền</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Giỏ hàng trống.
                  </td>
                </tr>
              ) : (
                cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑
                      </button>
                    </td>
                    <td className="text-start d-flex align-items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        width={70}
                        className="rounded border"
                      />
                      <span className="fw-semibold">{item.name}</span>
                    </td>
                    <td className="fw-semibold text-primary">
                      {item.price.toLocaleString()} đ
                    </td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-circle"
                          onClick={() =>
                            updateQuantity(item.id, item.amount - 1)
                          }
                          disabled={item.amount <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          className="form-control text-center"
                          style={{ width: "60px" }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-circle"
                          onClick={() =>
                            updateQuantity(item.id, item.amount + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="fw-bold text-success">
                      {(item.price * item.amount).toLocaleString()} đ
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cart-footer card shadow-sm border-0 p-4">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2">
              <label className="fw-semibold">🎟 Mã giảm giá:</label>
              <input
                type="text"
                placeholder="Nhập mã..."
                className="form-control"
                style={{ maxWidth: "200px" }}
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button className="btn btn-outline-dark" onClick={applyDiscount}>
                Áp dụng
              </button>
            </div>
          </div>

          <div className="col-md-6 text-md-end text-center">
            <h4 className="fw-bold mb-3">
              Tổng cộng:{" "}
              <span className="text-danger">
                {getTotal().toLocaleString()} đ
              </span>
            </h4>
            <div className="d-flex gap-3 justify-content-md-end justify-content-center">
              <button onClick={placeOrder} className="btn btn-primary px-4">
                Đặt Hàng
              </button>
              <button className="btn btn-danger px-4">Thanh toán VNPAY</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
