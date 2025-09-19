import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateProfilePage = () => {
  const { accountID } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    local: "",
    dateOfBirth: "",
    imageBase64: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/account/${accountID}/get`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [accountID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/v1/account/update/${accountID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => alert("Cập nhật thành công!"));
  };

  return (
    <div className="update-profile-page">
      <h2>Cập nhật hồ sơ</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="Tên hiển thị"
        />
        <input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          placeholder="Số điện thoại"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="text"
          value={formData.local}
          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
          placeholder="Địa chỉ"
        />
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () =>
              setFormData({ ...formData, imageBase64: reader.result });
            reader.readAsDataURL(file);
          }}
        />

        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;