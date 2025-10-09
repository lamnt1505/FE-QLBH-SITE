import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { useAlert } from "react-alert";

const Header = ({ onSearch = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [username, setUsername] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [accountID, setAccountID] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const alert = useAlert();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const [userDropdown, setUserDropdown] = useState(false);

  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    const accId = localStorage.getItem("accountId");
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
    const accountData = JSON.parse(localStorage.getItem("account"));
    if (accountData) {
      setAccountID(accountData.accountID);
      setUsername(accountData.username);
    }
    fetchCartQuantity();
  }, []);

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
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const res = await fetch(
        `http://localhost:8080/api/v1/account/changer-password/${accountID}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        alert.success("ĐỔI MẬT KHẨU THÀNH CÔNG");
        setShowChangePass(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const msg = await res.text();
        alert.error("Lỗi: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert.error("Có lỗi khi gọi API");
    }
  };

  return (
    <>
      <header className="app-header d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn"
            style={{
              background: "linear-gradient(45deg, #4facfe, #00f2fe)",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "30px",
              padding: "8px 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onClick={() => navigate("/index")}
          >
            TRANG CHỦ
          </button>
          <div
            className="menu-container"
            ref={menuRef}
            style={{ position: "relative" }}
          >
            <div
              className="btn"
              style={{
                background: "linear-gradient(45deg, #4facfe, #00f2fe)",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "30px",
                padding: "10px 20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              onClick={toggleMenu}
            >
              MENU
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
          <input
            type="text"
            placeholder="Tìm sản phẩm"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="form-control"
          />
          <button onClick={() => onSearch(searchKey)}>🔍</button>
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
              ĐƠN HÀNG CỦA TÔI
            </button>
          )}

          {username ? (
            <div className="user-info position-relative">
              <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setUserDropdown(!userDropdown)}
              >
                👤 {username}
              </span>

              {/* dropdown */}
              {userDropdown && (
                <div
                  className="position-absolute bg-white border rounded shadow"
                  style={{
                    right: 0,
                    top: "120%",
                    zIndex: 2000,
                    minWidth: "180px",
                  }}
                >
                  <div
                    className="px-3 py-2 hover:bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/updateProfile/${accountID}`)}
                  >
                    CHỈNH SỬA HỒ SƠ
                  </div>
                  <div
                    className="px-3 py-2 hover:bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowChangePass(true)}
                  >
                    ĐỔI MẬT KHẨU
                  </div>
                  <div
                    className="px-3 py-2 text-danger hover:bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}
                  >
                    ĐĂNG XUẤT
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={handleLoginClick}
            >
              ĐĂNG NHẬP
            </button>
          )}
        </div>
      </header>
      {showChangePass && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow w-100"
            style={{ maxWidth: "400px" }}
          >
            <h5 className="mb-3 text-center">🔑 ĐỔI MẬT KHẨU</h5>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                className="form-control mb-2"
                placeholder="MẬT KHẨU CŨ"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="MẬT KHẨU MỚI"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="XÁC NHẬN MẬT KHẨU"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowChangePass(false)}
                >
                  HỦY
                </button>
                <button type="submit" className="btn btn-primary">
                  LƯU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
