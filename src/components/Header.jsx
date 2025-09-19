import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import ProductSearch from "./ProductSearch";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [username, setUsername] = useState(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [accountID, setAccountID] = useState(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const accId = localStorage.getItem("accountID");
    if (accId) setAccountID(accId);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/category/Listgetall")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  const fetchCartQuantity = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/dossier-statistic/cart/quantity",
        {
          credentials: "include",
        }
      );
      const qty = await res.json();
      setCartQuantity(qty);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/v1/account/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("accountName");
      setUsername(null);
      navigate("/index");
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  useEffect(() => {
    const accName = localStorage.getItem("accountName");
    if (accName) setUsername(accName);
    fetchCartQuantity();
  }, []);

  useEffect(() => {
    window.updateCartQuantity = fetchCartQuantity;
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="app-header d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate("/index")}
          >
            🏠 Trang chủ
          </button>
          <div
            className="menu-container"
            ref={menuRef}
            style={{ position: "relative" }}
          >
            <div
              className="menu-button"
              onClick={toggleMenu}
              style={{ cursor: "pointer" }}
            >
              Menu
            </div>
            {isMenuOpen && (
              <div
                className="custom-dropdown-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "10px",
                  zIndex: 1000,
                  minWidth: "200px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#category-${cat.id}`}
                    className="menu-item"
                    onClick={() => navigate(`/catalog/${cat.id}`)}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Tìm sản phẩm" readOnly />
          <button onClick={() => setOpenSearchDialog(true)}>🔍</button>
        </div>
        <div className="header-icons d-flex align-items-center gap-3">
          <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
            <BsCart3 /> <span>{cartQuantity}</span>
          </div>
          {username && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/myorder")}
            >
              📦 Đơn hàng của tôi
            </button>
          )}
          {username ? (
            <div className="user-info d-flex align-items-center gap-2">
              <span 
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => (window.location.href = `/updateProfile/${accountID}`)}
              > 👤 {username}
              </span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={handleLoginClick}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>
      <ProductSearch
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
      />
    </>
  );
};

export default Header;
