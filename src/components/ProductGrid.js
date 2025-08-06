// src/components/ProductGrid.js

import React from 'react';

const productsData = [
  {
    id: 1,
    title: 'LAPTOP ASUS EXPERTBOOK P1503CVA-I516-50W (INTEL CORE I5)',
    imageUrl: 'https://npcshop.vn/media/product/4675-45403_vivobook_a515_silver_bh_s1_ha1.jpg',
    discount: -3,
    brandLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/1280px-ASUS_Logo.svg.png',
    originalPrice: '15.990.000 đ',
    discountedPrice: '15.590.000 đ',
    promotionText: '6 Khuyến mãi:',
  },
  {
    id: 2,
    title: 'LAPTOP LENOVO IDEAPAD 3 15IAU7 (INTEL CORE I3-1215U)',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH8Thk7u3pIG9q-20eWyGAZBY4yBynwpMbzg&s',
    discount: -15,
    brandLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Lenovo_Global_Corporate_Logo.png',
    originalPrice: '11.890.000 đ',
    discountedPrice: '9.990.000 đ',
    promotionText: '3 Khuyến mãi:',
  },
  {
    id: 3,
    title: 'LAPTOP DELL VOSTRO 3520 (CORE I5-1235U/8GB/512GB)',
    imageUrl: 'https://maytinhcdc.vn/media/product/7190_dell_3430__04_.jpg',
    discount: -5,
    brandLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Dell_Logo.png',
    originalPrice: '16.990.000 đ',
    discountedPrice: '16.090.000 đ',
    promotionText: 'Quà tặng 200k',
  },
  {
    id: 4,
    title: 'MACBOOK AIR 13 INCH M2 2022 (8-CORE/8GB/256GB)',
    imageUrl: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__9_14.png',
    discount: -10,
    brandLogoUrl: 'https://wallpapers.com/images/hd/mac-book-air-logo-uh8mmbtdv3oqt0eu.jpg',
    originalPrice: '28.990.000 đ',
    discountedPrice: '25.990.000 đ',
    promotionText: 'Trả góp 0%',
  },
  {
    id: 5,
    title: 'LAPTOP ACER ASPIRE 3 A315-58-52SP (CORE I5-1135G7)',
    imageUrl: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-acer-aspire-3-a314-42p-r3b3_1_.png',
    discount: -8,
    brandLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Acer_Logo.svg/2560px-Acer_Logo.svg.png',
    originalPrice: '14.290.000 đ',
    discountedPrice: '13.190.000 đ',
    promotionText: '5 Khuyến mãi:',
  },
  {
    id: 6,
    title: 'LAPTOP HP 15S-FQ5162TU (CORE I5-1235U/8GB/512GB)',
    imageUrl: 'https://au-files.apjonlinecdn.com/landingpages/content-pages/visid-rich-content/hp-omnibook-x-14-ai-laptop/images/w100_product_highlight_v1.png',
    discount: -12,
    brandLogoUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Hewlett-Packard-Logo-2008-2014.png',
    originalPrice: '17.490.000 đ',
    discountedPrice: '15.390.000 đ',
    promotionText: 'Tặng balo + Chuột',
  },
   {
    id: 7,
    title: 'LAPTOP GAMING GIGABYTE G5 MF (CORE I5-12450H/RTX 4050)',
    imageUrl: 'https://nguyencongpc.vn/media/lib/13-04-2023/laptopgigabyteg5kf-e3vn313sh1.jpeg',
    discount: -7,
    brandLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gigabyte_Technology_logo_20080107.svg/2560px-Gigabyte_Technology_logo_20080107.svg.png',
    originalPrice: '23.490.000 đ',
    discountedPrice: '21.990.000 đ',
    promotionText: 'Bảo hành 2 năm',
  },
];


const ProductGrid = () => {
  return (
    <div className="product-section">
      <div className="category-bar"></div>
      <div className="product-grid">
        {productsData.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="product-image"
              />
              <div className="discount-badge">{product.discount}%</div>
            </div>

            <div className="product-info">
              <img 
                src={product.brandLogoUrl} 
                alt={`${product.title} brand logo`}
                className="brand-logo"
              />
              
              <h3 className="product-title">
                {product.title}
              </h3>

              <div className="price-container">
                <del className="original-price">{product.originalPrice}</del>
                <span className="discounted-price">{product.discountedPrice}</span>
              </div>

              <p className="promotion-info">{product.promotionText}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;