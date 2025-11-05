import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import API_BASE_URL from "../config/config.js";

const ProductSearch = ({ open, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [versions, setVersions] = useState([]);
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTrademarks, setSelectedTrademarks] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/api/v1/category/Listgetall`)
        .then((res) => res.json())
        .then(setCategories);

      fetch(`${API_BASE_URL}/api/trademark/gettrademark`)
        .then((res) => res.json())
        .then(setTrademarks);

      fetch(`${API_BASE_URL}/api/productversion/Listgetall`)
        .then((res) => res.json())
        .then(setVersions);

      fetch(`${API_BASE_URL}/api/v1/productdetail/Listgetall`)
        .then((res) => res.json())
        .then(setDetails);
    }
  }, [open]);

  const toggleSelection = (value, selected, setSelected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleSearch = async () => {
    const criteria = {
      categoryID: selectedCategories,
      tradeID: selectedTrademarks,
      versionID: selectedVersions,
      productDetailID: selectedDetails,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/dossier-statistic/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      });
      const data = await res.json();
      setProducts(data.content || []);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedTrademarks([]);
    setSelectedVersions([]);
    setSelectedDetails([]);
    setProducts([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
        🔍 BỘ LỌC SẢN PHẨM
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Danh mục */}
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                DANH MỤC
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat.id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(cat.id.toString())}
                      onChange={() =>
                        toggleSelection(
                          cat.id.toString(),
                          selectedCategories,
                          setSelectedCategories
                        )
                      }
                    />
                  }
                  label={cat.name}
                />
              ))}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                THƯƠNG HIỆU
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {trademarks.map((t) => (
                <FormControlLabel
                  key={t.tradeID}
                  control={
                    <Checkbox
                      checked={selectedTrademarks.includes(t.tradeID.toString())}
                      onChange={() =>
                        toggleSelection(
                          t.tradeID.toString(),
                          selectedTrademarks,
                          setSelectedTrademarks
                        )
                      }
                    />
                  }
                  label={t.tradeName}
                />
              ))}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                PHIÊN BẢN
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {versions.map((v) => (
                <FormControlLabel
                  key={v.versionID}
                  control={
                    <Checkbox
                      checked={selectedVersions.includes(v.versionID.toString())}
                      onChange={() =>
                        toggleSelection(
                          v.versionID.toString(),
                          selectedVersions,
                          setSelectedVersions
                        )
                      }
                    />
                  }
                  label={`${v.memory} - ${v.color}`}
                />
              ))}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                CHI TIẾT
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {details.map((d) => (
                <FormControlLabel
                  key={d.productDetailID}
                  control={
                    <Checkbox
                      checked={selectedDetails.includes(d.productDetailID.toString())}
                      onChange={() =>
                        toggleSelection(
                          d.productDetailID.toString(),
                          selectedDetails,
                          setSelectedDetails
                        )
                      }
                    />
                  }
                  label={`Camera: ${d.productCamera}, Wifi: ${d.productWifi}`}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          KẾT QUẢ TÌM KIẾM
        </Typography>
        {products.length === 0 ? (
          <Typography color="text.secondary">CHƯA CÓ SẢN PHẨM</Typography>
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead sx={{ bgcolor: "grey.200" }}>
                <TableRow>
                  <TableCell><b>TÊN</b></TableCell>
                  <TableCell><b>ẢNH</b></TableCell>
                  <TableCell><b>THƯƠNG HIỆU</b></TableCell>
                  <TableCell><b>DANH MỤC</b></TableCell>
                  <TableCell><b>GIÁ</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow hover key={p.id}>
                    <TableCell>
                      <a href={`/index/showProductSingle/${p.id}`}>{p.name}</a>
                    </TableCell>
                    <TableCell>
                      <img
                        src={`data:image/png;base64,${p.imageBase64}`}
                        alt="Product"
                        style={{ width: 50, height: 50, borderRadius: 6 }}
                      />
                    </TableCell>
                    <TableCell>{p.tradeName}</TableCell>
                    <TableCell>{p.categoryname}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(p.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleSearch} variant="contained" color="primary">
          TÌM KIẾM
        </Button>
        <Button onClick={handleReset} variant="outlined" color="secondary">
          LÀM MỚI
        </Button>
        <Button onClick={onClose} variant="outlined" color="error">
          ĐÓNG
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSearch;