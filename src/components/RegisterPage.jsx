import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    accountName: "",
    accountPass: "",
    username: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    local: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/account/add", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      setMessage(result.message);

      if (res.ok) {
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 2000);
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
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
            placeholder="Tên tài khoản"
            className="form-control mb-2"
            value={formData.accountName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="accountPass"
            placeholder="Mật khẩu"
            className="form-control mb-2"
            value={formData.accountPass}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Họ tên"
            className="form-control mb-2"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-2"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Số điện thoại"
            className="form-control mb-2"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {/* thêm ngày sinh */}
          <input
            type="date"
            name="dateOfBirth"
            className="form-control mb-2"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {/* thêm địa chỉ/local */}
          <input
            type="text"
            name="local"
            placeholder="Địa chỉ"
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

          <button type="submit" className="btn btn-success w-100">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
