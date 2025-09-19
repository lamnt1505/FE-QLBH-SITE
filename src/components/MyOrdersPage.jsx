import React, { useEffect, useState } from "react";
import "./MyOrdersPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";
const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
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

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:8080/orders/${orderId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không tìm thấy chi tiết đơn hàng");
      const data = await res.json();

      setSelectedOrder({ orderId, products: data.oldOrders });

      // show modal
      const modal = new Modal(document.getElementById("orderDetailModal"));
      modal.show();
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
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
                className="btn btn-sm btn-outline-primary"
                onClick={() => fetchOrderDetails(order.orderId)}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ✅ Modal để ngoài vòng map */}
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
    </div>
  );
};

export default MyOrdersPage;