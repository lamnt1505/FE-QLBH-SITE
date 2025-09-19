import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Về Chúng Tôi</h3>
          <p>
            Cửa hàng của chúng tôi chuyên cung cấp các sản phẩm công nghệ chính hãng,
            đảm bảo chất lượng và dịch vụ hậu mãi tốt nhất cho khách hàng.
          </p>
        </div>
        <div className="footer-column">
          <h3>Liên Kết Hữu Ích</h3>
          <ul>
            <li><a href="/chinh-sach-bao-hanh">Chính sách bảo hành</a></li>
            <li><a href="/chinh-sach-doi-tra">Chính sách đổi trả</a></li>
            <li><a href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</a></li>
            <li><a href="/lien-he">Liên hệ</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Hỗ Trợ Khách Hàng</h3>
          <ul>
            {/* SỬA LỖI: Thay thế href="#" bằng đường dẫn giữ chỗ hợp lệ */}
            <li><a href="/tro-giup">Trung tâm trợ giúp</a></li>
            <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
            <li><a href="/thanh-toan">Thanh toán và Vận chuyển</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Đăng Ký Nhận Tin</h3>
          <p>Nhận thông tin về các chương trình khuyến mãi và sản phẩm mới nhất.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn..." required />
            <button type="submit">Đăng ký</button>
          </form>
          <div className="social-icons-footer">
            {/* SỬA LỖI: Thay thế href="#" bằng đường dẫn thật */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IN</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">TW</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Đồ án tốt nghiệp {new Date().getFullYear()} lớp X29-DNG2-TPM: Võ Minh Hiếu - Nguyễn Trung Lam - Trần Đức Mạnh - Đoàn Ngọc Khuê - Đặng Phương Hoàng Nhi.</p>
      </div>
    </footer>
  );
};

export default Footer;