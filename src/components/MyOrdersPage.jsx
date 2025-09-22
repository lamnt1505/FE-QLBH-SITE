import React, { useEffect, useState } from "react";
import "./MyOrdersPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";
import { useAlert } from "react-alert";

const MyOrdersPage = () => {
  const alert = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
    const accountIdStr = localStorage.getItem("accountId");
    if (!accountIdStr || accountIdStr === "undefined") {
      setLoading(false);
      return;
    }

    const accountId = Number(accountIdStr);
    if (isNaN(accountId)) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/orders/account/${accountId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => console.error("Lỗi khi lấy đơn hàng:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchOrders = async () => {
    try {
      const accountIdStr = localStorage.getItem("accountId");
      if (!accountIdStr || accountIdStr === "undefined") return;

      const accountId = Number(accountIdStr);
      if (isNaN(accountId)) return;

      const res = await fetch(
        `http://localhost:8080/orders/account/${accountId}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:8080/orders/${orderId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không tìm thấy chi tiết đơn hàng");
      const data = await res.json();

      setSelectedOrder({ orderId, products: data.oldOrders });

      const modal = new Modal(document.getElementById("orderDetailModal"));
      modal.show();
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    }
  };

  const handleShowConfirm = (orderId) => {
    setOrderToCancel(orderId);
    const modal = new Modal(document.getElementById("cancelOrderModal"));
    modal.show();
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setOrderToCancel(null);
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      const res = await fetch(
        `http://localhost:8080/dossier-statistic/cancel-order?orderID=${orderToCancel}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await res.json().catch(() => null);

      if (res.ok) {
        alert.success(result?.message || "Đơn hàng đã được hủy thành công ✅");
        window.location.reload();
      } else {
        alert.error(result || "Không thể hủy đơn hàng ❌");
      }
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      alert.error("Không thể kết nối server!");
    } finally {
      handleCloseConfirm();
    }
  };

  if (loading) return <p className="text-center mt-4">⏳ Đang tải...</p>;

  return (
    <div className="row g-3">
      {orders.map((order) => (
        <div key={order.orderId} className="col-md-4 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Đơn #{order.orderId}</h6>
              <p className="mb-1">
                <strong>Ngày:</strong> {order.orderDate}
              </p>
              <p className="mb-1">
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`badge ${
                    order.status === "Đã hoàn thành"
                      ? "bg-success"
                      : order.status === "Đã Hủy"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="fw-bold text-danger">
                {order.orderTotal.toLocaleString()} đ
              </p>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => {
                  setSelectedOrder(order);
                  fetchOrderDetails(order.orderId);
                }}
                data-bs-toggle="modal"
                data-bs-target="#orderDetailModal"
              >
                Xem chi tiết
              </button>
              {order.status === "Chờ duyệt" && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleShowConfirm(order.orderId)}
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <div
        className="modal fade"
        id="orderDetailModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                📦 Chi tiết đơn #{selectedOrder?.orderId}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedOrder?.products ? (
                <table className="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>SL</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((p) => (
                      <tr key={p.productId}>
                        <td>{p.productName}</td>
                        <td>{p.amount}</td>
                        <td>{p.price.toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">⏳ Đang tải chi tiết...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="cancelOrderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận hủy đơn hàng</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn hủy đơn hàng #{orderToCancel}?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Đóng
              </button>
              <button className="btn btn-danger" onClick={cancelOrder}>
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
