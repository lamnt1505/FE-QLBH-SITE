import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CatalogPage/CatalogPage.css";
import { insertCart } from "../redux/reducers/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

const CatalogPage = () => {
  const { categoryID } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cartData);
  const alert = useAlert();
  const handleBuy = (productID) => {
    dispatch(insertCart({ productID, amount: 1 }));
  };

  useEffect(() => {
    if (cartState.status === "succeeded") {
      alert.success(
        <div className="flex items-center space-x-2">
          <span>SẢN PHẨM ĐÃ ĐƯỢC THÊM VÀO GIỎ HÀNG!</span>
        </div>,
        {
          style: {
            background: "#111",
            color: "#fff",
            fontWeight: "bold",
          },
        }
      );
    } else if (cartState.status === "failed") {
      alert.error("❌ Có lỗi khi thêm sản phẩm vào giỏ hàng!", {
        style: {
          background: "#111",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }
  }, [cartState.status]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/category/catalog/${categoryID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi:", err))
      .finally(() => setLoading(false));
  }, [categoryID]);

  if (loading) return <p className="text-center mt-4">ĐANG TẢI...</p>;

  return (
    <div
      className="container mt-4"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="product-category-title text-center mb-4"
        style={{
          width: "100%",
        }}
      >
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
          SẢN PHẨM THEO DANH MỤC #{categoryID}
        </h2>
      </div>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <div style={{ width: "100%", clear: "both" }}>
        {products.length === 0 ? (
          <div className="alert alert-info text-center">
            Không có sản phẩm nào trong danh mục này.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center shadow-sm">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "120px" }}>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: "150px" }}>Giá</th>
                  <th style={{ width: "180px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.productID}>
                    <td>
                      <img
                        src={`data:image/png;base64,${item.imageBase64}`}
                        alt={item.productName}
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
                      {item.productName}
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
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleBuy(item.productID)}
                        disabled={cartState.status === "loading"}
                      >
                        {cartState.status === "loading"
                          ? "Đang thêm..."
                          : "Mua ngay"}
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        So sánh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
