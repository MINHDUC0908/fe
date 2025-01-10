import { useEffect, useState } from "react";
import { useDataBanrd } from "../../Component/Context/getProductBrand";
import { useData } from "../../Component/Context/DataContext";
import { Link, useLocation } from "react-router-dom";
import { BsBoxArrowLeft } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

function GetProductBrand({ setCurrentTitle }) {
    const { products, setId_brand } = useDataBanrd();
    const [brand_name_local, setBrand_name_local] = useState('');
    const [category_name, setCategory_name] = useState('');
    const category = localStorage.getItem("category");
    const updateBrandFromLocalStorage = () => {
        const brand = localStorage.getItem("brandData");
        const brand_id = localStorage.getItem("id_brand");
        setCategory_name(category || "");

        if (brand && brand_id) {
            setBrand_name_local(brand);
            setId_brand(brand_id);
        } else {
            setBrand_name_local("Chọn danh mục");
        }
    };
    useEffect(() => {
        updateBrandFromLocalStorage();
    }, [location.pathname, setId_brand]);
    useEffect(() => {
        setCategory_name(category);
    }, []);
    useEffect(() => {
        setCurrentTitle(`Brand: ${brand_name_local}`);
    }, [setCurrentTitle, brand_name_local]);
    console.log(products)
    return (
        <>
            <div className="bg-[#EEEEEE]">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="py-2 text-sm">
                        <span className="">
                            Sản phẩm/
                            <Link to={`/product-category/${category_name}`}>
                                {category_name}
                            </Link>/
                            <Link to={`/product-category/brand/${brand_name_local}`}>
                                {brand_name_local}
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <div className="grid grid-cols-4 lg:grid-cols-5 mt-5 mb-20">
                    <div className="col-span-1 hidden lg:block">
                        <div className="bg-[#eeeeee] pl-5">
                            <h1 className="pt-5">Danh mục</h1>
                            <Link to={`/product`} className="flex items-center gap-2 mx-5 my-4 font-bold">
                                <BsBoxArrowLeft className="text-lg"/> All Category
                            </Link><Link to={`/product-category/${category_name}`} className="flex items-center gap-2 mx-5 my-4 font-bold">
                                <BsBoxArrowLeft className="text-lg"/> {category_name}
                            </Link>
                            <p className="text-yellow-500 text-lg font-bold pb-5">
                                {brand_name_local}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-4 m-0 lg:ml-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[700px] md:h-[850px] lg:h-[330px] xl:h-[400px] w-full">
                            <AnimatePresence>
                                {
                                    products.map(product => (
                                        <motion.div
                                            className="border border-gray-300 shadow-sm "
                                            key={product.id}
                                            // initial={{ opacity: 0, height: 0 }}
                                            // animate={{ opacity: 1, height: "auto" }}
                                            // exit={{ opacity: 0, height: 0 }}
                                            // transition={{duration: 1}}
                                        >
                                            <a
                                                href={`/product/${product.product_name}`}
                                                className="block"
                                            >
                                                <div className="w-full">
                                                    <div className="aspect-w-1 aspect-h-1 overflow-hidden mt-10">
                                                        <img
                                                            src={`http://127.0.0.1:8000/imgProduct/${product.images}`}
                                                            alt={product.product_name}
                                                            className=" object-cover transition-transform duration-300 hover:scale-105"
                                                        />
                                                    </div>
                                                    <h3 className="text-center mt-4 text-blue-500 lg:text-lg truncate">
                                                        {product.product_name}
                                                    </h3>
                                                    <p className="text-lg font-bold text-center">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price)}
                                                    </p>
                                                    <div className="bg-gray-100 rounded-xl gap-2 my-1 mx-2 md:my-2 md:mx-3 xl:my-3 xl:mx-4">
                                                        <p className="p-2 text-sm">
                                                            Giao hàng miễn phí. Bảo hành chính hãng
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GetProductBrand;
