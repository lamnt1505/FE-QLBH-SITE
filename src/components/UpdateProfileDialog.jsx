import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UpdateProfilePage/UpdateProfilePage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    image: "", 
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/account/${accountID}/get`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          accountName: data.accountName || "",
          username: data.username || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          local: data.local || "",
          dateOfBirth: data.dateOfBirth || "",
          image: data.image || "", // nếu có ảnh cũ thì hiển thị
        });
      })
      .catch((err) => toast.error("Không thể tải thông tin tài khoản!"));
  }, [accountID, toast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/account/update/${accountID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Cập nhật thất bại");

      toast.success(result.message);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="form-title">CẬP NHẬT HỒ SƠ</h2>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>TÊN ĐĂNG NHẬP</label>
            <input type="text" value={formData.accountName} disabled />
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="preview-image"
                style={{ width: "120px", marginTop: "10px", borderRadius: "10px" }}
              />
            )}
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