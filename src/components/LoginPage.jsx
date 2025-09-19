import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

const LoginPage = () => {
  const [accountName, setAccountName] = useState("");
  const [accountPass, setAccountPass] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const alert = useAlert();

  const refreshCaptcha = () => {
    setCaptchaUrl(
      `http://localhost:8080/api/v1/account/captcha?${new Date().getTime()}`
    );
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/v1/account/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountName,
          accountPass,
          captcha,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (data.captchaValid === false) {
        setError("Captcha không hợp lệ. Vui lòng thử lại.");
        refreshCaptcha();
        setCaptcha("");
        return;
      }

      if (!data.success) {
        setError(data.message || "Đăng nhập thất bại!");
        refreshCaptcha();
        setCaptcha("");
        return;
      }

      if (data.success) {
        localStorage.setItem("accountName", accountName);
        localStorage.setItem("accountId", String(data.accountID));
        alert.success("Đăng nhập thành công!");

        setTimeout(() => {
          if (data.admin || data.employee) {
            navigate("/admin");
            window.location.reload();
          } else if (data.user) {
            navigate("/index");
            window.location.reload();
          } else {
            navigate("/index");
            window.location.reload();
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Lỗi login:", err);
      setError("Không thể kết nối server!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Đăng nhập</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              placeholder="Nhập tên tài khoản"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={accountPass}
              onChange={(e) => setAccountPass(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div className="mb-3 d-flex align-items-center justify-content-between">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Nhập Captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              required
            />
            <img
              src={captchaUrl}
              alt="captcha"
              style={{ cursor: "pointer", height: "50px" }}
              onClick={refreshCaptcha}
              title="Click để làm mới"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">
            Đăng nhập
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
