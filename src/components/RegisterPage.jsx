import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/config.js";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountName: "",
    accountPass: "",
    username: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    local: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUppercase || hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validatePassword(formData.accountPass)) {
      setMessage(
        "❌ Mật khẩu phải có ít nhất 1 chữ hoa hoặc 1 ký tự đặc biệt!"
      );
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) data.append("image", image);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/account/add`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${result.message}`);
        return;
      }

      setMessage(`✅ ${result.message}`);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setMessage("❌ Có lỗi kết nối server, vui lòng thử lại!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "450px" }}>
        <h3 className="text-center mb-3">ĐĂNG KÝ TÀI KHOẢN</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="accountName"
            placeholder="TÊN ĐĂNG NHẬP"
            className="form-control mb-2"
            value={formData.accountName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="accountPass"
            placeholder="MẬT KHẨU"
            className="form-control mb-2"
            value={formData.accountPass}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="HỌ TÊN"
            className="form-control mb-2"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            className="form-control mb-2"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="SỐ ĐIỆN THOẠI"
            className="form-control mb-2"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            className="form-control mb-2"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <input
            type="text"
            name="local"
            placeholder="ĐỊA CHỈ"
            className="form-control mb-2"
            value={formData.local}
            onChange={handleChange}
          />
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={handleImageChange}
          />

          <button type="submit" className="btn btn-success w-100 mb-2">
            ĐĂNG KÝ
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/login")}
          >
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
