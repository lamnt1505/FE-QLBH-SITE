// src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';

const Header = () => {
  // State để quản lý việc mở/đóng menu, không thay đổi
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. Tạo một ref để tham chiếu đến div container của menu
  const menuRef = useRef(null);

  // Hàm để bật/tắt menu, không thay đổi
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Nếu có, đóng menu
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="app-header">
      {/* 4. Gán ref vào div container */}
      <div className="menu-container" ref={menuRef}>
        <div className="menu-button" onClick={toggleMenu}>
          Menu
        </div>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <a href="#link1" className="menu-item">Trang chủ</a>
            <a href="#link2" className="menu-item">Sản phẩm</a>
            <a href="#link3" className="menu-item">Khuyến mãi</a>
            <a href="#link4" className="menu-item">Giới thiệu</a>
            <a href="#link5" className="menu-item">Liên hệ</a>
          </div>
        )}
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Tìm sản phẩm" />
        <button>Q</button>
      </div>
      <a href="#contact" className="contact">Liên hệ</a>
      <div className="header-icons">
        <div className="icon notification">
          <span className="badge">1</span>
        </div>
        <div className="icon user-profile"></div>
      </div>
    </header>
  );
};

export default Header;