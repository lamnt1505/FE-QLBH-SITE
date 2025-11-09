import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/config.js";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/product/${id}/detail-full`
        );
        if (!res.ok) throw new Error("Không lấy được dữ liệu");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/product/${id}/related`
        );
        if (res.ok) {
          const data = await res.json();
          setRelatedProducts(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm liên quan:", err);
      }
    };

    fetchProduct();
    fetchRelated();
  }, [id]);
  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/dossier-statistic/insert-product?productID=${productId}&amount=1`,
        { method: "POST", credentials: "include" }
      );

      if (res.ok) {
        toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!");
        if (window.updateCartQuantity) {
          window.updateCartQuantity();
        }
      } else {
        const result = await res.text();
        toast.error(result || "Thêm vào giỏ thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      toast.error("Không thể kết nối server!");
    }
  };

  if (loading) return <Typography>Đang tải...</Typography>;
  if (!product) return <Typography>Không tìm thấy sản phẩm</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Button
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          textTransform: "none",
          backgroundColor: "#f0f0f0",
          "&:hover": { backgroundColor: "#e0e0e0" },
        }}
      >
        ← QUAY LẠI TRANG TRƯỚC
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              overflow: "hidden",
              textAlign: "center",
              p: 2,
            }}
          >
            <CardMedia
              component="img"
              image={
                product.image
              }
              alt={product.name}
              title={product.description}
              sx={{
                width: "70%",
                height: "auto",
                maxHeight: 200,
                objectFit: "contain",
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                p: 2,
                mx: "auto",
                my: 2,
                display: "block",
              }}
            />
          </Card>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {product.detail && (
                  <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      textAlign="center"
                    >
                      ⚙️ THÔNG SỐ KỸ THUẬT
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography>
                          <b>Camera:</b> {product.detail.productCamera}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          <b>Màn hình:</b> {product.detail.productScreen}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          <b>Wifi:</b> {product.detail.productWifi}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          <b>Bluetooth:</b> {product.detail.productBluetooth}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {product.versions && product.versions.length > 0 && (
                  <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      textAlign="center"
                    >
                      📦 CÁC PHIÊN BẢN
                    </Typography>
                    <Grid container spacing={1}>
                      {product.versions.map((v) => (
                        <Grid item xs={6} key={v.versionID}>
                          <Card
                            sx={{
                              borderRadius: 2,
                              boxShadow: 1,
                              textAlign: "center",
                              transition: "0.3s",
                              "&:hover": { boxShadow: 3 },
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={
                                v.image
                              }
                              alt={v.memory}
                              sx={{
                                height: 70,
                                width: "100%",
                                objectFit: "contain",
                                backgroundColor: "#fff",
                                borderBottom: "1px solid #eee",
                                p: 1,
                              }}
                            />
                            <CardContent sx={{ p: 1 }}>
                              <Typography fontWeight="bold">
                                {v.memory}
                              </Typography>
                              <Typography color="text.secondary" fontSize={13}>
                                Màu: {v.color}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* --- CỘT PHẢI: Giới thiệu + mô tả + nút hành động --- */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: { md: 2 }, pt: { xs: 2, md: 0 } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>
            <Typography
              variant="h5"
              color="green"
              fontWeight={600}
              gutterBottom
            >
              {product.price?.toLocaleString("vi-VN")} ₫
            </Typography>

            <Typography variant="body1" gutterBottom>
              <b>Danh mục:</b> {product.category}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Thương hiệu:</b> {product.trademark}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ lineHeight: 1.7, color: "#444" }}>
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </Typography>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => handleAddToCart(product.id)}
              >
                🛒 THÊM VÀO GIỎ
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCartClick}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                💳 MUA NGAY
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* --- SẢN PHẨM LIÊN QUAN --- */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🔍 SẢN PHẨM LIÊN QUAN
          </Typography>
          <Grid container spacing={2}>
            {relatedProducts.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { boxShadow: 5, transform: "scale(1.02)" },
                  }}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <CardMedia
                    component="img"
                    image={
                      item.image
                    }
                    alt={item.name}
                    sx={{
                      height: 150,
                      objectFit: "contain",
                      backgroundColor: "#fff",
                      borderBottom: "1px solid #eee",
                      p: 1,
                    }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography fontWeight="bold" fontSize={15}>
                      {item.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailPage;
