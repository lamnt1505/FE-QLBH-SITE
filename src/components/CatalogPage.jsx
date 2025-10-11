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
    <div className="container py-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h2 className="section-title text-center">
            SẢN PHẨM THEO DANH MỤC #{categoryID}
          </h2>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="row g-4">
        {products.length === 0 ? (
          <div className="col-12 text-center text-muted">
            KHÔNG CÓ SẢN PHẨM NÀO
          </div>
        ) : (
          products.map((p, index) => (
            <div className="col-6 col-md-4 col-lg-3" key={index}>
              <div className="card product-card h-100">
                <div className="product-img-wrapper">
                  <img
                    src={`data:image/png;base64,${p.imageBase64}`}
                    alt={p.productName}
                    className="product-img"
                  />
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <h6 className="product-title">{p.productName}</h6>
                  <p className="fw-bold text-danger mb-2">
                    {p.price.toLocaleString()} đ
                  </p>
                  <button
                    className="btn btn-buy mt-auto"
                    onClick={() => handleBuy(p.productID)}
                    disabled={cartState.status === "loading"}
                  >
                    {cartState.status === "loading"
                      ? "Đang thêm..."
                      : "MUA NGAY"}
                  </button>
                  {/* onClick={() => getProductDetailsFromAPI(p.productID)}*/}
                  <button className="btn btn-outline-secondary"  style={{ marginTop: "8px" }}>So sánh</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
