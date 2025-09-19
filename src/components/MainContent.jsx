// src/components/MainContent.js

import React, { useState, useEffect, useRef } from 'react';

// DỮ LIỆU CHO CÁC SLIDES
const slidesData = [
  {
    id: 1,
    imageUrl: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_2831/samsung-super-b_227_1200.png.webp',
    altText: 'Khuyến mãi laptop Dell',
    linkUrl: '/khuyen-mai/laptop-dell',
  },
  {
    id: 2,
    imageUrl: 'https://theme.hstatic.net/200000320233/1000816982/14/slider_1.jpg?v=551',
    altText: 'Khuyến mãi iPhone',
    linkUrl: '/khuyen-mai/iphone',
  },
  {
    id: 3,
    imageUrl: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_2863/sang-bung-khoan_709_1200.png.webp',
    altText: 'Sắm tai nghe giá rẻ',
    linkUrl: '/khuyen-mai/tai-nghe',
  },
  {
    id: 4,
    imageUrl: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_2940/tivi-hisense-10_827_1200.png.webp',
    altText: 'Macbook Air M2 giá tốt',
    linkUrl: '/san-pham/macbook-air-m2',
  },
];


// Dữ liệu tin tức mẫu
const newsData = [
    { id: 1, title: 'Apple ra mắt dòng sản phẩm iPhone mới với nhiều cải tiến vượt trội về camera và hiệu năng.' },
    { id: 2, title: 'Samsung công bố chiến lược phát triển bền vững, cam kết sử dụng vật liệu tái chế cho tất cả sản phẩm vào năm 2030.' },
    { id: 3, title: 'Bản cập nhật Windows mới nhất gặp một số lỗi không tương thích, Microsoft đang khẩn trương khắc phục.' },
    { id: 4, title: 'Xu hướng làm việc tại nhà thúc đẩy doanh số máy tính xách tay và thiết bị hội nghị truyền hình tăng mạnh.' },
    { id: 5, title: 'Phân tích chi tiết chip M3 của Apple: Sức mạnh đồ họa đáng kinh ngạc trong một thiết kế nhỏ gọn.' },
];

const MainContent = () => {
  // --- LOGIC CHO SLIDER ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
        ),
      4000 // Tự động chuyển slide sau 4 giây
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slidesData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slidesData.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  }

  // --- LOGIC CHO WIDGET TIN TỨC ---
  const newsScrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    const scrollContainer = newsScrollRef.current;
    if (!scrollContainer) return;

    if (scrollContainer.children.length === newsData.length) {
      const clonedChildren = Array.from(scrollContainer.children).map(child => child.cloneNode(true));
      clonedChildren.forEach(clone => scrollContainer.appendChild(clone));
    }

    const startScrolling = () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight / 2) {
          scrollContainer.scrollTop = 0;
        } else {
          scrollContainer.scrollTop += 1;
        }
      }, 50);
    };

    const stopScrolling = () => {
      clearInterval(scrollIntervalRef.current);
    };

    startScrolling();
    scrollContainer.addEventListener('mouseenter', stopScrolling);
    scrollContainer.addEventListener('mouseleave', startScrolling);

    return () => {
      clearInterval(scrollIntervalRef.current);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', stopScrolling);
        scrollContainer.removeEventListener('mouseleave', startScrolling);
      }
    };
  }, []);


  return (
    <div className="main-content">
      {/* ===== SLIDER BANNER CHÍNH ===== */}
      <div className="main-banner">
        {/* Lớp wrapper để tạo hiệu ứng chuyển động */}
        <div 
            className="slider-wrapper" 
            style={{ transform: `translateX(${-currentIndex * 100}%)` }}
        >
          {slidesData.map((slide) => (
            <div className="slide" key={slide.id}>
              <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer">
                <img src={slide.imageUrl} alt={slide.altText} />
              </a>
            </div>
          ))}
        </div>

        {/* Nút nhấn qua trái */}
        <button onClick={goToPrevious} className="slider-arrow prev">&#10094;</button>
        {/* Nút nhấn qua phải */}
        <button onClick={goToNext} className="slider-arrow next">&#10095;</button>

        {/* Các chấm điều hướng */}
        <div className="slider-dots">
            {slidesData.map((slide, slideIndex) => (
                <div 
                    key={slide.id} 
                    className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(slideIndex)}
                ></div>
            ))}
        </div>
      </div>

      {/* ===== WIDGET TIN TỨC ===== */}
      <div className="side-banners">
        <div className="side-banner-item news-widget">
          <h3 className="news-widget-title">Tin tức công nghệ</h3>
          <div className="news-scroll-container" ref={newsScrollRef}>
            {newsData.map((item, index) => (
              <div key={index} className="news-item">
                <a href={`/news/${item.id}`} className="news-title">{item.title}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;