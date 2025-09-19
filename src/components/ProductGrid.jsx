import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import Rating from "@mui/material/Rating";

import { useAlert } from "react-alert";

const ProductGrid = () => {
  const alert = useAlert();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);

  const [detailProduct, setProductDetail] = useState(null);
  const [branchID, setBranchID] = useState(1);
  const [stockByBranch, setStockByBranch] = useState(null);

  const [openVote, setOpenVote] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [openDetail, setOpenDetail] = useState(false);

  const accountID = 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/dossier-statistic/list--Product"
        );
        const data = await res.json();

        const mapped = data.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          category: p.categoryname,
          tradeName: p.tradeName,
          price: p.price,
          imageUrl: p.imageBase64
            ? `data:image/jpeg;base64,${p.imageBase64}`
            : "https://via.placeholder.com/150",
        }));

        setProducts(mapped);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
        alert.error("❌ Không thể tải danh sách sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [alert]);

  const toggleFavorite = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/dossier-statistic/add--favorite?accountID=${accountID}&productID=${productId}`,
        { method: "POST" }
      );

      const result = await res.text();
      if (res.ok) {
        alert.success("❤️ Đã thêm vào danh mục yêu thích!");
        setFavorites((prev) => [...prev, productId]);
      } else {
        alert.error(result || "❌ Thêm yêu thích thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi thêm yêu thích:", err);
      alert.error("❌ Không thể kết nối server!");
    }
  };

  const handleSubmitVote = async () => {
    const voteDTO = {
      accountID,
      productID: selectedProduct,
      rating: rating,
      comment: comment,
    };

    try {
      const res = await fetch(
        "http://localhost:8080/dossier-statistic/add--vote",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(voteDTO),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert.success("⭐ Cảm ơn bạn đã đánh giá!");
        setOpenVote(false);
        setRating(0);
        setComment("");
      } else {
        alert.error(result || "❌ Đánh giá thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      alert.error("❌ Không thể kết nối server!");
    }
  };

  // 👉 Chi tiết sản phẩm
  const handleOpenDetail = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/product/${productId}/get`
      );
      if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
      const data = await res.json();
      setProductDetail(data);
      setOpenDetail(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết:", err);
      alert.error("❌ Không tìm thấy sản phẩm!");
    }
  };

  // 👉 Giỏ hàng
  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/dossier-statistic/insert-product?productID=${productId}&amount=1`,
        { method: "POST", credentials: "include" }
      );

      if (res.ok) {
        alert.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!");
        if (window.updateCartQuantity) {
          window.updateCartQuantity();
        }
      } else {
        const result = await res.text();
        alert.error(result || "❌ Thêm vào giỏ thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert.error("❌ Không thể kết nối server!");
    }
  };

  const fetchStockByBranch = async (branchID, productId) => {
    try {
      const stockRes = await fetch(
        `http://localhost:8080/api/v1/inventory/check/${branchID}/${productId}`
      );

      if (stockRes.ok) {
        const stockData = await stockRes.text();
        setStockByBranch(stockData);
      } else {
        setStockByBranch("Không lấy được tồn kho");
      }
    } catch (err) {
      console.error("Lỗi khi lấy tồn kho:", err);
      setStockByBranch("Không lấy được tồn kho");
    }
  };

  const handleOpenDetailInventory = async (productId, branchID) => {
    try {
      // Lấy chi tiết sản phẩm
      const res = await fetch(
        `http://localhost:8080/api/v1/product/${productId}/get`
      );
      if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
      const data = await res.json();
      setProductDetail(data);

      fetchStockByBranch(branchID, productId);

      setOpenDetail(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết:", err);
      alert.error("❌ Không tìm thấy sản phẩm!");
    }
  };

  return (
    <div className="product-grid">
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                cursor: "pointer",
                zIndex: 10,
                color: favorites.includes(product.id) ? "red" : "gray",
              }}
              onClick={() => toggleFavorite(product.id)}
            >
              {favorites.includes(product.id) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={() => handleOpenDetailInventory(product.id)}
            >
              <SearchIcon />
            </div>

            <div className="product-image-container">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
            </div>

            <div className="product-info">
              <h3>{product.title}</h3>
              <p>
                {product.category} - {product.tradeName}
              </p>
              <div>
                <span>{product.price.toLocaleString("vi-VN")} ₫</span>
              </div>

              <div className="product-actions" style={{ marginTop: "8px" }}>
                <button
                  className="btn-add-to-cart"
                  onClick={() => handleAddToCart(product.id)}
                  style={{ marginRight: "6px" }}
                >
                  Thêm vào Giỏ hàng
                </button>
                <button
                  className="btn-vote"
                  onClick={() => {
                    setSelectedProduct(product.id);
                    setOpenVote(true);
                  }}
                >
                  Đánh giá
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Dialog đánh giá */}
      <Dialog open={openVote} onClose={() => setOpenVote(false)}>
        <DialogTitle>Đánh Giá Sản Phẩm</DialogTitle>
        <DialogContent>
          <Rating
            name="product-rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Nhập nhận xét (tối đa 200 ký tự)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            inputProps={{ maxLength: 200 }}
            margin="normal"
          />
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            {comment.length}/200
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVote(false)}>Hủy</Button>
          <Button
            onClick={handleSubmitVote}
            variant="contained"
            color="primary"
          >
            Gửi Đánh Giá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chi tiết sản phẩm */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>CHI TIẾT SẢN PHẨM</DialogTitle>
        <DialogContent>
          {detailProduct && (
            <div>
              <img
                src={`data:image/jpeg;base64,${detailProduct.imageBase64}`}
                alt={detailProduct.name}
                style={{ width: "100%", marginBottom: "16px" }}
              />
              <p>
                <b>Tên:</b> {detailProduct.name}
              </p>
              <p>
                <b>Mô tả:</b> {detailProduct.description}
              </p>
              <p>
                <b>Giá:</b> {detailProduct.price.toLocaleString("vi-VN")} ₫
              </p>
              <p>
                <b>Ngày sản xuất:</b> {detailProduct.date_product}
              </p>
              <p>
                <b>Danh mục:</b> {detailProduct.categoryname}
              </p>
              <p>
                <b>Thương hiệu:</b> {detailProduct.tradeName}
              </p>
              {/* Dropdown chọn chi nhánh */}
              <div style={{ marginTop: "16px" }}>
                <b>Chọn chi nhánh:</b>
                <Select
                  value={branchID}
                  onChange={(e) => {
                    const newBranch = e.target.value;
                    setBranchID(newBranch);
                    fetchStockByBranch(newBranch, detailProduct.id);
                  }}
                  style={{ marginLeft: "10px", minWidth: "150px" }}
                >
                  <MenuItem value={1}>Hà Nội</MenuItem>
                  <MenuItem value={2}>TP.HCM</MenuItem>
                  <MenuItem value={3}>Đà Nẵng</MenuItem>
                </Select>
              </div>

              <div style={{ marginTop: "12px" }}>
                {stockByBranch ? (
                  <p
                    style={{
                      color: stockByBranch.includes("Còn hàng")
                        ? "green"
                        : "red",
                    }}
                  >
                    <b>Tồn kho:</b> {stockByBranch}
                  </p>
                ) : (
                  <p style={{ color: "gray" }}>Đang tải tồn kho...</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductGrid;
