import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UpdateProfilePage/UpdateProfilePage.css";
import { useAlert } from "react-alert";
import API_BASE_URL from "../config/config.js";

const UpdateProfilePage = () => {
  const { accountID } = useParams();
  const [formData, setFormData] = useState({
    accountName: "",
    username: "",
    phoneNumber: "",
    email: "",
    local: "",
    dateOfBirth: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const alert = useAlert();
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/account/${accountID}/get`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [accountID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("accountName", formData.accountName);
    data.append("username", formData.username);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("email", formData.email);
    data.append("local", formData.local);
    data.append("dateOfBirth", formData.dateOfBirth);

    if (imageFile) {
      data.append("image", imageFile);
    }

    fetch(`${API_BASE_URL}/api/v1/account/update/${accountID}`, {
      method: "PUT",
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.text();
      })
      .then((msg) => {
        alert.success(msg);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        alert.error(err.message);
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="form-title">CẬP NHẬT HỒ SƠ</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>TÊN ĐĂNG NHẬP</label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              disabled
            />
          </div>
          <div className="form-group">
            <label>HỌ VÀ TÊN</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>SỐ ĐIỆN THOẠI</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>ĐỊA CHỈ</label>
            <input
              type="text"
              value={formData.local}
              onChange={(e) =>
                setFormData({ ...formData, local: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>NGÀY SINH</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>ẢNH ĐẠI DIỆN</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                }
              }}
            />
          </div>

          <button type="submit" className="btn-submit">
            LƯU THAY ĐỔI
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
