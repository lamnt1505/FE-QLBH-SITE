import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CatalogPage = () => {
  const { categoryID } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center mt-4">Đang tải...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">Sản phẩm theo danh mục #{categoryID}</h2>

      {products.length === 0 ? (
        <p className="text-center text-muted">Không có sản phẩm nào.</p>
      ) : (
        <div className="row">
          {products.map((p, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card h-100 shadow-sm">
                <img   src={`data:image/png;base64,${p.imageBase64}`}className="card-img-top"alt={p.productName} />
                <div className="card-body text-center">
                  <h6 className="card-title">{p.productName}</h6>
                  <p className="fw-bold text-danger">{p.price.toLocaleString()} đ</p>
                  <button className="btn btn-primary btn-sm">Mua ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
