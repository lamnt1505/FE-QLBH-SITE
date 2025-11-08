import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import "../styles/CartPage/CartPage.css";
import { useNavigate } from "react-router-dom";
import { updateQuantity } from "../redux/reducers/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import API_BASE_URL from "../config/config.js";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const alert = useAlert();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVnpayModal, setShowVnpayModal] = useState(false);

  const getValueOrFallback = (primary, fallback) => {
    if (primary && primary.trim() !== "") {
      return primary;
    }
    return fallback || "";
  };

  const handleGetFromAccount = async () => {
    try {
      const accountID = localStorage.getItem("accountId");

      const res = await fetch(
        `${API_BASE_URL}/address/account/${accountID}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Lỗi lấy thông tin tài khoản");

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        receiverName: getValueOrFallback(data.receiverName, data.username),
        receiverPhone: getValueOrFallback(data.receiverPhone, data.phoneNumber),
        shippingAddress: getValueOrFallback(data.shippingAddress, data.local),
        note: data.note || prev.note,
        email: getValueOrFallback(data.email, ""),
      }));

      alert.success("✅ Đã lấy thông tin từ tài khoản!");
    } catch (error) {
      alert.error("❌ Không thể lấy thông tin tài khoản");
    }
  };

  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    shippingAddress: "",
    note: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/product-cart`, {
          credentials: "include",
        });
        const data = await res.json();
        const mappedCart = (data.cart || []).map((item) => ({
          id: item.productID,
          name: item.name,
          price: item.price,
          amount: item.amount,
          imageUrl: item.image
        }));
        setCartItems(mappedCart);
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateCart = () => {
    cartItems.forEach((item) => {
      dispatch(updateQuantity({ productID: item.id, amount: item.amount }))
        .unwrap()
        .then((res) => {
          console.log("res từ thunk:", res);
          if (res.result === 1) {
            alert.success(`✅ Đã cập nhật ${item.name}`);
          } else if (res.result === 2) {
            alert.info(`🗑 ${item.name} đã bị xoá khỏi giỏ`);
          } else if (res.result === 0) {
            alert.warning(
              `⚠️ Không tìm thấy ${item.name}, vui lòng tải lại giỏ`
            );
          } else {
            alert.error("❌ Cập nhật thất bại!");
          }
        })
        .catch(() => alert.error("🚨 Lỗi server khi cập nhật"));
    });
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/dossier-statistic/update--quantities`,
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

  const changeQuantity = (id, newAmount) => {
    if (newAmount < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, amount: newAmount } : item
      )
    );
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      alert.error("⚠️ Vui lòng nhập mã giảm giá!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/dossier-statistic/apply`, {
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

      if (!res.ok) {
        alert.error(data.message || "❌ Mã giảm giá không hợp lệ!");
        return;
      }

      if (data.success) {
        setDiscountedTotal(data.discountedTotal);

        alert.success(
          `✅ ${
            data.message
          }\nTổng sau giảm: ${data.discountedTotal.toLocaleString()}₫`
        );
        console.log("Chi tiết sản phẩm giảm giá:", data.discountedProducts);
      } else {
        alert.warning(data.message || "⚠️ Mã giảm giá không hợp lệ!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi áp dụng mã giảm giá:", err);
      alert.error("⚠️ Đã xảy ra lỗi hệ thống, vui lòng thử lại!");
    }
  };

  const placeOrder = async () => {
    const { receiverName, receiverPhone, email, shippingAddress } = formData;

    if (!receiverName || !receiverPhone || !email || !shippingAddress) {
      alert.error("⚠ Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(receiverPhone)) {
      alert.error("⚠ Số điện thoại không hợp lệ!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert.error("⚠ Email không hợp lệ!");
      return;
    }

    console.log("Đặt hàng với data:", formData);

    try {
      const res = await fetch(
        `${API_BASE_URL}/dossier-statistic/orders`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.text();

      if (result === "1") {
        alert.success("Đặt hàng thành công!");
        setCartItems([]);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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

  const handleVnpayPayment = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/create-payment`, {
        method: "POST",
        credentials: "include",
      });

      const text = await res.text();
      console.log("Payment URL:", text);

      if (text.startsWith("http")) {
        alert.success("✅ Chuyển hướng tới VNPAY...");
        setTimeout(() => {
          window.location.href = text;
        }, 1500);
      } else {
        alert.error("❌ " + text);
      }
    } catch (error) {
      console.error("Error:", error);
      alert.error("⚠ Lỗi kết nối tới server!");
    }
  };

  const handleVnpayPaymentEdit = async () => {
    try {
      const orderRes = await fetch(`${API_BASE_URL}/orders/vnpay`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const orderData = await orderRes.json();

      if (orderData.status !== "success") {
        alert.error("❌ " + orderData.message);
        return;
      }

      const payRes = await fetch(
        `${API_BASE_URL}/create-payment?txnRef=${orderData.txnRef}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const payData = await payRes.json();

      if (payData.status === "success") {
        alert.success("✅ Chuyển hướng tới VNPAY...");
        setTimeout(() => {
          window.location.href = payData.paymentUrl;
        }, 1500);
      } else {
        alert.error("❌ " + payData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert.error("⚠ Lỗi kết nối server!");
    }
  };

  return (
    <div className="cart-page d-flex flex-column min-vh-100">
      <div className="cart-table card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0 text-center">
            <thead className="table-dark">
              <tr>
                <th></th>
                <th className="text-start">SẢN PHẨM</th>
                <th>GIÁ TIỀN</th>
                <th>SỐ LƯỢNG</th>
                <th>TỔNG</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    GIỎ HÀNG TRỐNG
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
                            changeQuantity(item.id, item.amount - 1)
                          }
                          disabled={item.amount <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) =>
                            changeQuantity(item.id, Number(e.target.value))
                          }
                          className="form-control text-center"
                          style={{ width: "60px" }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-circle"
                          onClick={() =>
                            changeQuantity(item.id, item.amount + 1)
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
          <div className="text-end p-3 d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/index")}
            >
              TIẾP TỤC MUA HÀNG
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdateCart}
              disabled={loading}
            >
              {loading ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT GIỎ HÀNG"}
            </button>
          </div>
        </div>
      </div>
      <div className="cart-footer card shadow-sm border-0 p-4 mt-4">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2">
              <label className="fw-semibold">🎟 MÃ GIẢM GIÁ:</label>
              <input
                type="text"
                placeholder="Nhập mã..."
                className="form-control"
                style={{ maxWidth: "200px" }}
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button className="btn btn-outline-dark" onClick={applyDiscount}>
                ÁP DỤNG
              </button>
            </div>
          </div>
          <div className="col-md-6 text-md-end text-center">
            <h4 className="fw-bold mb-3">
              {discountedTotal ? (
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                      marginRight: "8px",
                      fontSize: "1rem",
                    }}
                  >
                    {getTotal().toLocaleString()} đ
                  </span>
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    {discountedTotal.toLocaleString()} đ
                  </span>
                  <br />
                  <small style={{ color: "green" }}>
                    Tiết kiệm: {(getTotal() - discountedTotal).toLocaleString()}{" "}
                    đ
                  </small>
                </>
              ) : (
                <span className="text-danger" style={{ fontSize: "1.5rem" }}>
                  {getTotal().toLocaleString()} đ
                </span>
              )}
            </h4>
            <div className="d-flex gap-3 justify-content-md-end justify-content-center">
              <button
                onClick={() => {
                  const account = localStorage.getItem("accountName");
                  if (!account) {
                    alert.error("⚠ Bạn cần đăng nhập để đặt hàng!");
                    setTimeout(() => navigate("/login"), 1500);
                  } else {
                    setShowModal(true);
                  }
                }}
                className="btn btn-primary px-4"
              >
                ĐẶT HÀNG
              </button>
              <button
                className="btn btn-danger px-4"
                onClick={() => {
                  const account = localStorage.getItem("accountName");
                  if (!account) {
                    alert.error("⚠ Bạn cần đăng nhập để thanh toán!");
                    setTimeout(() => navigate("/login"), 1500);
                  } else {
                    setShowVnpayModal(true);
                  }
                }}
              >
                THANH TOÁN VNPAY
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">THÔNG TIN GIAO HÀNG</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="receiverName"
                  placeholder="HỌ VÀ TÊN"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="receiverPhone"
                  placeholder="SỐ ĐIỆN THOẠI"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="shippingAddress"
                  placeholder="ĐỊA CHỈ GIAO HÀNG"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <textarea
                  name="note"
                  placeholder="Ghi chú (không bắt buộc)"
                  value={formData.note}
                  onChange={handleChange}
                  className="form-control"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary mb-3 w-100"
                  onClick={handleGetFromAccount}
                >
                  LẤY THÔNG TIN TỪ TÀI KHOẢN
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  HỦY
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={placeOrder}
                >
                  XÁC NHẬN ĐẶT HÀNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showVnpayModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">THÔNG TIN THANH TOÁN VNPAY</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowVnpayModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="receiverName"
                  placeholder="HỌ VÀ TÊN"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="receiverPhone"
                  placeholder="SỐ ĐIỆN THOẠI"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="shippingAddress"
                  placeholder="ĐỊA CHỈ GIAO HÀNG"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <textarea
                  name="note"
                  placeholder="Ghi chú (không bắt buộc)"
                  value={formData.note}
                  onChange={handleChange}
                  className="form-control"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary mb-3 w-100"
                  onClick={handleGetFromAccount}
                >
                  LẤY THÔNG TIN TỪ TÀI KHOẢN
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowVnpayModal(false)}
                >
                  HỦY
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleVnpayPaymentEdit}
                >
                  XÁC NHẬN THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
