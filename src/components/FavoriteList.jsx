import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useAlert } from "react-alert";
import { Modal, Button, Table, Spinner } from "react-bootstrap";

export default function FavoriteList() {
  const alert = useAlert();
  const { accountID } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/dossier-statistic/list--favorite?accountID=${accountID}`
      );
      setFavorites(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleRemoveFavorite = async () => {
    if (!selectedItem) return;
    setDeleting(true);

    try {
      const res = await axios.delete(
        `http://localhost:8080/dossier-statistic/${accountID}/${selectedItem.id}`
      );

      if (res.data.success) {
        alert.success("✅ " + res.data.message);
        setFavorites((prev) =>
          prev.filter((item) => item.id !== selectedItem.id)
        );
      } else {
        alert.error("⚠️ " + res.data.message);
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert.error("❌ Lỗi khi xóa sản phẩm!");
    } finally {
      setDeleting(false);
      setSelectedItem(null);
      setShowModal(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [accountID]);

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <div
      className="container mt-4"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Tiêu đề */}
      <div className="text-center mb-4" style={{ width: "100%" }}>
        <h2
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "400",
            fontSize: "2.2rem",
            letterSpacing: "0.5px",
            color: "#222",
            marginBottom: "0",
            display: "inline-block",
            borderBottom: "2px solid #1976d2",
            paddingBottom: "8px",
          }}
        >
          ❤️ Sản Phẩm Tôi Yêu Thích
        </h2>
      </div>

      {/* Bảng */}
      <div style={{ width: "100%" }}>
        {favorites.length === 0 ? (
          <div className="alert alert-info text-center mt-3">
            Bạn chưa có sản phẩm yêu thích nào.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center shadow-sm">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "120px" }}>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: "150px" }}>Giá</th>
                  <th style={{ width: "100px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={`data:image/jpeg;base64,${item.imageBase64}`}
                        alt={item.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        fontWeight: "500",
                        fontSize: "1rem",
                        color: "#333",
                        textAlign: "left",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "#1976d2",
                      }}
                    >
                      {item.price
                        ? `${item.price.toLocaleString("vi-VN")} VND`
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleConfirmDelete(item)}
                      >
                        🗑 Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            Bạn có chắc muốn xóa <strong>{selectedItem?.name}</strong> khỏi danh
            sách yêu thích không?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveFavorite}
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
