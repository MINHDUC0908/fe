import React, { useState, useEffect } from "react";
import NavBar from "./Component/Navbar/Navbar";
import Header from "./Component/Header/Header";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { publicRoute, privateRoute, smember } from "./Route/Route";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { DataProvider } from "./Component/Context/DataContext";
import { ProductProvider } from "./Component/Context/ProductContext";
import { GetProductCategoryProvider } from "./Component/Context/getProductCategory";
import { GetProductBrandProvider } from "./Component/Context/getProductBrand";
import { UserProvider } from "./Component/Context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Bounce } from "react-toastify";
import { CartProvider } from "./Component/Context/Cart";
import Top from "./Component/Navbar/Top";
import DefaultLayout from "./Component/Profile/Profile/LayOut/DefaultLayout";
import Chat from "./Component/Chat/Chat";
import Footer from "./Component/Footer/Footer";
import SnowEffect from "./Component/SnowEffect/SnowEffect";

function App() {
  const [currentTitle, setCurrentTitle] = useState("");

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <ProductProvider>
            <DataProvider>
              <GetProductCategoryProvider>
                <GetProductBrandProvider>
                  <AppContent currentTitle={currentTitle} setCurrentTitle={setCurrentTitle} />
                </GetProductBrandProvider>
              </GetProductCategoryProvider>
            </DataProvider>
          </ProductProvider>
        </CartProvider>
      </UserProvider>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
}

function AppContent({ currentTitle, setCurrentTitle }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isLoginPage && <NavBar />}
      {!isLoginPage && <Top />}
      {!isLoginPage && <Chat />}
      {/* {!isLoginPage && <SnowEffect />} */}
      {!isLoginPage && <Header currentTitle={currentTitle} />}
      <Routes>
        {publicRoute.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.Component setCurrentTitle={setCurrentTitle} />}
          />
        ))}
        {privateRoute.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.Component setCurrentTitle={setCurrentTitle} />}
          />
        ))}
        <Route path="/profiles" element={<DefaultLayout/>}>
          {smember.map((route, index) => (
            <Route key={index} path={route.path} element={<route.Component setCurrentTitle={setCurrentTitle}/> } />
          ))}
        </Route>
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
