import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import ProductSearch from "./ProductSearch";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { useAlert } from "react-alert";
import { Toast } from "bootstrap";

const ProductGrid = ({ searchKey }) => {
  const alert = useAlert();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [detailProduct, setProductDetail] = useState(null);
  const [branchID, setBranchID] = useState(1);
  const [stockByBranch, setStockByBranch] = useState(null);

  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [openVote, setOpenVote] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [openDetail, setOpenDetail] = useState(false);

  const [stockList, setStockList] = useState([]);

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [categories, setCategories] = useState([]);

  const accountID = 1;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    if (selectedCity) {
      const cityDistricts = [
        ...new Set(
          stockList
            .filter((s) => s.city === selectedCity)
            .map((s) => s.district)
        ),
      ];
      setDistricts(cityDistricts);
      setSelectedDistrict("");
    } else {
      setDistricts([]);
    }
  }, [selectedCity, stockList]);

  useEffect(() => {
    let filtered = stockList;
    if (selectedCity)
      filtered = filtered.filter((s) => s.city === selectedCity);
    if (selectedDistrict)
      filtered = filtered.filter((s) => s.district === selectedDistrict);
    setFilteredStocks(filtered);
  }, [selectedCity, selectedDistrict, stockList]);

  const mapProduct = (p) => ({
    id: p.id,
    title: p.name,
    description: p.description,
    category: p.categoryname,
    tradeName: p.tradeName,
    price: p.price,
    imageUrl: p.imageBase64
      ? `data:image/jpeg;base64,${p.imageBase64}`
      : "https://via.placeholder.com/150",
  });

  const fetchProductsDefault = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/dossier-statistic/products?page=${pageNum}&size=${pageSize}&sort=productID,asc`
      );
      if (!res.ok) throw new Error("Lỗi khi gọi API phân trang!");
      const data = await res.json();

      setProducts(data.content.map(mapProduct));
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsDefault(0);
  }, [alert]);

  useEffect(() => {
    if (!searchKey.trim()) return;

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setMessage("");
      try {
        console.log("🔍 Gọi API tìm kiếm với key:", searchKey);
        const response = await fetch(
          "http://localhost:8080/api/v1/product/search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: searchKey }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setMessage(errorData.message || "Không tìm thấy sản phẩm nào.");
          setProducts([]);
          return;
        }

        const data = await response.json();
        setProducts(data.map(mapProduct));
      } catch (error) {
        console.error("🚫 Lỗi fetch sản phẩm:", error);
        setMessage("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchKey]);

  const fetchPriceDesc = async () => {
    const res = await fetch(
      "http://localhost:8080/dossier-statistic/list--Product--PriceDesc"
    );
    const data = await res.json();
    setProducts(data.map(mapProduct));
  };

  const fetchPriceAsc = async () => {
    const res = await fetch(
      "http://localhost:8080/dossier-statistic/list--Product--PriceAsc"
    );
    const data = await res.json();
    setProducts(data.map(mapProduct));
  };

  const fetchNewBest = async () => {
    const res = await fetch(
      "http://localhost:8080/dossier-statistic/list--Product--NewBest"
    );
    const data = await res.json();
    setProducts(data.map(mapProduct));
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/category/Listgetall"
      );
      if (!res.ok) throw new Error("Không thể tải danh mục");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  const handleOpenCategoryDialog = () => {
    fetchCategories();
    setOpenCategoryDialog(true);
  };

  const handleSelectCategory = async (categoryID) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/dossier-statistic/list--ProductById--Category--Filter/${categoryID}`,
        { method: "POST" }
      );
      const data = await res.json();
      setProducts(data.map(mapProduct));
    } catch (err) {
      console.error("Lỗi khi lọc theo danh mục:", err);
    } finally {
      setOpenCategoryDialog(false);
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/dossier-statistic/add--favorite?accountID=${accountID}&productID=${productId}`,
        { method: "POST" }
      );

      const result = await res.text();
      if (res.ok) {
        alert.success("Đã thêm vào danh mục yêu thích!");
        setFavorites((prev) => [...prev, productId]);
      } else {
        alert.error(result || "Thêm yêu thích thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi thêm yêu thích:", err);
      alert.error("Không thể kết nối server!");
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
        alert.success("Cảm ơn bạn đã đánh giá!");
        setOpenVote(false);
        setRating(0);
        setComment("");
      } else {
        alert.error(result || "Đánh giá thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      alert.error("Không thể kết nối server!");
    }
  };

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
        alert.error(result || "Thêm vào giỏ thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert.error("Không thể kết nối server!");
    }
  };

  const fetchStockByBranch = async (branchID, productId) => {
    try {
      const stockRes = await fetch(
        `http://localhost:8080/api/v1/inventory/check/${branchID}/${productId}`
      );

      if (stockRes.ok) {
        const stockData = await stockRes.json();
        setStockByBranch(stockData);
      } else {
        setStockByBranch({ message: "Không lấy được tồn kho", status: "out" });
      }
    } catch (err) {
      console.error("Lỗi khi lấy tồn kho:", err);
      setStockByBranch({ message: "Không lấy được tồn kho", status: "out" });
    }
  };

  const handleOpenDetailInventory = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/product/${productId}/get`
      );
      if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
      const data = await res.json();
      setProductDetail(data);

      const stockRes = await fetch(
        `http://localhost:8080/api/v1/inventory/by-product/${productId}`
      );
      if (!stockRes.ok) throw new Error("Không lấy được danh sách tồn kho");
      const stockData = await stockRes.json();
      setStockList(stockData);
      setFilteredStocks(stockData);

      const uniqueCities = [...new Set(stockData.map((s) => s.city))];
      setCities(uniqueCities);
      setSelectedCity("");
      setSelectedDistrict("");

      if (stockData.length > 0 && data?.id) {
        const defaultBranch = stockData[0].branchID;
        setBranchID(defaultBranch);
        await fetchStockByBranch(defaultBranch, data.id);
      }

      setOpenDetail(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết:", err);
      Toast.error("Không tìm thấy sản phẩm!");
    }
  };

  return (
    <div>
      <div className="filter-bar">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
            justifyContent: "center",
          }}
        >
          {[
            { label: "LỌC THEO DANH MỤC: " },
            { label: "GIÁ ↑ THẤP ĐẾN CAO", onClick: fetchPriceAsc },
            { label: "GIÁ ↓ CAO ĐẾN THẤP", onClick: fetchPriceDesc },
            { label: "SẢN PHẨM MỚI / TỐT NHẤT", onClick: fetchNewBest },
          ].map((btn, index) => (
            <Button
              key={index}
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                padding: "4px 10px",
                minWidth: "unset",
              }}
              onClick={btn.onClick}
            >
              {btn.label}
            </Button>
          ))}
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              padding: "4px 10px",
              minWidth: "unset",
            }}
            onClick={() => setOpenSearchDialog(true)}
          >
            🔍 TÌM KIẾM NÂNG CAO
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              padding: "4px 10px",
              minWidth: "unset",
            }}
            onClick={handleOpenCategoryDialog}
          >
            📂 LỌC THEO DANH MỤC
          </Button>
        </Box>
      </div>
      <div className="product-grid">
        {loading ? (
          <p>ĐANG TẢI DỮ LIỆU...</p>
        ) : message ? (
          <p style={{ textAlign: "center", color: "gray" }}>{message}</p>
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
                    THÊM VÀO GIỎ HÀNG
                  </button>
                  <button
                    className="btn-vote"
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setOpenVote(true);
                    }}
                  >
                    ĐÁNH GIÁ
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <ProductSearch
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
        />
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
              GỬI ĐÁNH GIÁ
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>CHI TIẾT SẢN PHẨM</DialogTitle>
          <DialogContent>
          {detailProduct ? (
            <>
			    <img
                  src={`data:image/jpeg;base64,${detailProduct.imageBase64}`}
                  alt={detailProduct.name}
                  style={{ width: "100%", marginBottom: "16px" }}
                />
              <Typography variant="h6">
                <b>TÊN SẢN PHẨM:</b> {detailProduct.name}
              </Typography>
              <Typography fontWeight="body">
                <b color="green" >GIÁ TIỀN:</b> {detailProduct.price?.toLocaleString("vi-VN")} ₫
              </Typography>
              <Typography variant="h6">
                <b>DANH MỤC:</b> {detailProduct.categoryname}
              </Typography>
              <Typography variant="h6">
                <b>THƯƠNG HIỆU:</b> {detailProduct.tradeName}
              </Typography>
              <Typography sx={{ mb: 2 }} variant="h6">
                <b>Mô tả:</b> {detailProduct.description}
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <Typography fontWeight="bold">
                  🔎 CHI NHÁNH CỬA HÀNG
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray", mb: 1 }}>
                  CÓ{" "}
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {filteredStocks.filter((s) => s.quantity > 0).length}
                  </span>{" "}
                  CỬA HÀNG SẢN PHẨM
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    displayEmpty
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="">-- Chọn Tỉnh/Thành phố --</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    displayEmpty
                    sx={{ flex: 1 }}
                    disabled={!selectedCity}
                  >
                    <MenuItem value="">-- Chọn Quận/Huyện --</MenuItem>
                    {districts.map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Chi nhánh</TableCell>
                    <TableCell align="center">Tỉnh/TP</TableCell>
                    <TableCell align="center">Quận/Huyện</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStocks.map((s) => (
                    <TableRow key={s.branchID}>
                      <TableCell>{s.branchName}</TableCell>
                      <TableCell align="center">{s.city}</TableCell>
                      <TableCell align="center">{s.district}</TableCell>
                      <TableCell align="center">{s.quantity}</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: s.quantity > 0 ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {s.quantity > 0 ? "✅ Còn hàng" : "❌ Hết hàng"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Typography align="center">Đang tải chi tiết...</Typography>
          )}
        </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetail(false)}>ĐÓNG</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openCategoryDialog}
          onClose={() => setOpenCategoryDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>📁 CHỌN DANH MỤC SẢN PHẨM</DialogTitle>
          <DialogContent dividers>
            {categories.length === 0 ? (
              <p>Đang tải danh mục...</p>
            ) : (
              categories.map((cat) => (
                <Button
                  key={cat.id}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mb: 1,
                    justifyContent: "flex-start",
                    textTransform: "none",
                  }}
                  onClick={() => handleSelectCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCategoryDialog(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="pagination center">
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              disabled={currentPage === 0}
              onClick={() => fetchProductsDefault(currentPage - 1)}
              sx={{ textTransform: "none", borderRadius: "20px", px: 2 }}
            >
              ◀ Trang trước
            </Button>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={i === currentPage ? "contained" : "outlined"}
                  color={i === currentPage ? "primary" : "inherit"}
                  size="small"
                  sx={{
                    minWidth: "35px",
                    borderRadius: "50%",
                    fontWeight: i === currentPage ? "bold" : "normal",
                  }}
                  onClick={() => fetchProductsDefault(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outlined"
              size="small"
              disabled={currentPage === totalPages - 1}
              onClick={() => fetchProductsDefault(currentPage + 1)}
              sx={{ textTransform: "none", borderRadius: "20px", px: 2 }}
            >
              Trang sau ▶
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
