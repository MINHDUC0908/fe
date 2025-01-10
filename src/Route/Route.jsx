import Home from "../Pages/Home/Home";
import Product from "../Pages/Product/Product";
import New from "../Pages/New/New";
import Contact from "../Pages/Contact/Contact";
import GetProductCategory from "../Pages/getProductCategory/GetProductCategory";
import GetProductBrand from "../Pages/getProductBrand/getProductBrand";
import ShowProduct from "../Pages/Product/ShowProduct";
import LoginForm from "../Component/Login/LoginForm";
import Register from "../Component/Login/Register";
import ViewCart from "../Pages/Cart/ViewCart";
import Payment from "../Pages/Cart/Payment/Payment";
import Delivery_history from "../Component/Profile/Profile/Delivery_history";
import Your_account from "../Component/Profile/Profile/Your_account";
import Change_password from "../Component/Profile/Profile/Change_password";
import ShowNew from "../Pages/New/ShowNew";



export const publicRoute = [
    {
        path: '/', Component:Home
    },
    {
        path: '/product', Component:Product
    },
    {
        path: '/news', Component:New
    },
    {
        path: '/contact', Component:Contact,
    },
    {
        path: '/product-category/:category_name', Component:GetProductCategory,
    },
    {
        path: 'product-category/brand/:brand_name', Component:GetProductBrand,
    },
    {
        path: 'product/:product_name', Component:ShowProduct,
    },
    {
        path: 'new/:new_name', Component:ShowNew,
    }
]
export const privateRoute = [
    {
        path: 'login', Component:LoginForm,
    },
    {
        path: 'register', Component:Register,
    },
    {
        path: 'cart', Component:ViewCart,
    },
    { 
        path: "payment", Component: Payment 
    },
]
export const smember = [
    {
        path: 'Delivery-history', Component:Delivery_history,
    },
    {
        path: 'Your-account', Component:Your_account,
    },
    {
        path: 'Change-password', Component:Change_password,
    },
]