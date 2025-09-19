// src/App.js
import React from "react";
import "./App.css"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import SocialSidebar from "./components/SocialSidebar";
import MainContent from "./components/MainContent";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartPage from "./components/CartPage"; 
import CatalogPage from "./components/CatalogPage"; 
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MyOrdersPage from "./components/MyOrdersPage";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import UpdateProfileDialogPage from "./components/UpdateProfileDialog";
const options = {
  position: positions.TOP_RIGHT,
  timeout: 3000,
  offset: "10px",
  transition: transitions.SCALE,
};

function App() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
    <Router>
      <div className="app">
        <Header />
        <div className="container">
          <SocialSidebar />
          <main>
            <Routes>
              {/* Trang chính */}
              <Route
                path="/index"
                element={
                  <>
                    <MainContent />
                    <ProductGrid />
                  </>
                }
              />
              <Route path="/updateProfile/:accountID" element={<UpdateProfileDialogPage />} />
              <Route path="/catalog/:categoryID" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} /> 
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/myorder" element={<MyOrdersPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
    </AlertProvider>
  );
}

export default App;