import { useEffect, useState } from "react";
import {
    Header,
    ProductGrid,
} from "@mui/material";
export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // API search
  const handleSearch = async (key) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/v1/product/search/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) {
        const err = await res.json();
        setProducts([]);
        setMessage(err.message || "Không tìm thấy sản phẩm.");
      } else {
        const data = await res.json();
        if (data.length === 0) {
          setProducts([]);
          setMessage("Không tìm thấy sản phẩm.");
        } else {
          setProducts(data);
        }
      }
    } catch (e) {
      setProducts([]);
      setMessage("Có lỗi xảy ra khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <ProductGrid
        products={products}
        loading={loading}
        message={message}
        setProducts={setProducts} // để ProductGrid vẫn có thể fetch default
        setLoading={setLoading}
        setMessage={setMessage}
      />
    </>
  );
}
