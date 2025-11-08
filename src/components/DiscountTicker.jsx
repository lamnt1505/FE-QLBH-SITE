import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import API_BASE_URL from "../config/config.js";

const DiscountTicker = () => {
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const fetchLatestDiscount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/discounts/latest`);
        if (res.data.success) {
          setDiscount(res.data);
        }
      } catch (err) {
        alert.error("❌ Không thể lấy mã giảm giá");
      }
    };

    fetchLatestDiscount();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    let date;

    if (dateStr.includes("-")) {
      date = new Date(dateStr);
    } else if (dateStr.length === 8) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      date = new Date(`${year}-${month}-${day}`);
    } else {
      return dateStr;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!discount) return null;

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#1976d2",
        color: "white",
        py: 1,
        mb: 2,
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      <Typography
        component="div"
        sx={{
          display: "inline-block",
          fontWeight: "bold",
          fontSize: "1rem",
          px: 2,
          animation: "scrollText 15s linear infinite",
          "&:hover": {
            animationPlayState: "paused",
          },
          "@keyframes scrollText": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(-100%)" },
          },
        }}
      >
        🎉 MÃ GIẢM GIÁ MỚI NHẤT:{" "}
        <span style={{ color: "#ffeb3b" }}>{discount.discountCode}</span> —{" "}
        {discount.discountName} 🔥 Giảm{" "}
        <span style={{ color: "#ffeb3b" }}>
          {discount.discountPercent}%
        </span>{" "}
        TỪ {formatDate(discount.dateStart)} ĐẾN {formatDate(discount.dateFinish)}! 💥
      </Typography>
    </Box>
  );
};

export default DiscountTicker;
