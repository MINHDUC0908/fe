import { useEffect, useState, useMemo } from "react";
import { useData } from "../../Component/Context/DataContext";
import { useDataGetProduct } from "../../Component/Context/getProductCategory";
import { Link, useLocation } from "react-router-dom";
import { BsBoxArrowLeft } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

function GetProductCategory({setCurrentTitle}) {
    const location = useLocation(); // Theo dõi sự thay đổi của route
    const [getCategoryName, setCategoryName] = useState("");
    const [getCategoryId, setCategoryId] = useState("");
    const { getProduct, setId } = useDataGetProduct();
    const { brand } = useData();

    const getBrandsByCategory = () => {
        const categoryId = Number(getCategoryId);
        return brand
            .filter((item) => item.category_id === categoryId)
            .map((item) => ({ brand_id: item.id, brand_name: item.brand_name }));
    };
    const groupedBrandss = useMemo(() => {
        return getBrandsByCategory();
    }, [brand, getCategoryId]);
    

    const updateCategoryFromLocalStorage = () => {
        const categoryLocal = localStorage.getItem("category");
        const idLocal = localStorage.getItem("id_category");
        if (categoryLocal && idLocal) {
            setCategoryId(idLocal);
            setCategoryName(categoryLocal);
            setId(idLocal);
        } else {
            setCategoryName("Chọn danh mục");
        }
    };

    // Đồng bộ trạng thái khi route hoặc localStorage thay đổi
    useEffect(() => {
        updateCategoryFromLocalStorage();
    }, [location.pathname]); // Theo dõi URL thay đổi

    useEffect(() => {
        setCurrentTitle(`Product-category: ${getCategoryName}`);
    }, [setCurrentTitle, getCategoryName]);
    const handleBrands = (brandname, id) => {
        localStorage.setItem('brandData', brandname)
        localStorage.setItem('id_brand', id)
    }
    return (
        <>
            <div className="bg-[#EEEEEE]">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="py-2 text-sm">
                        <span className="">
                            <Link to={'/product'}>
                                Sản phẩm
                            </Link>/ 
                            <Link to={`/product-category/${getCategoryName}`}>
                                {getCategoryName}
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <div className="grid grid-cols-4 lg:grid-cols-5 mt-5 mb-96">
                    {/* Sidebar - Display brands */}
                    <div className="col-span-1 bg-gray-100 p-4 hidden lg:block">
                        <h1 className="text-lg font-bold text-gray-700 mb-4">Danh mục</h1>
                        <Link to={'/product'} className="font-semibold text-center flex items-center gap-2">
                            <BsBoxArrowLeft className="text-xl"/> All Category
                        </Link>
                        <h2 className="my-3 text-xl text-yellow-400 border-t border-gray-300 pt-4">
                            {getCategoryName}
                        </h2>
                        <div className="pl-4 space-y-2">
                            {groupedBrandss.length > 0 ? (
                                groupedBrandss.map((brand, index) => (
                                    <Link
                                        key={index}
                                        to={`/product-category/brand/${brand.brand_name}`}
                                        className="block text-gray-600 text-[15px] p-2 rounded-md hover:bg-gray-200 hover:text-black transition-colors duration-200"
                                        onClick={() => handleBrands(brand.brand_name, brand.brand_id)}
                                    >
                                        {brand.brand_name}
                                    </Link>
                                ))
                            ) : (
                                <div className="text-gray-500 italic">Không có thương hiệu nào.</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Products Section */}
                    <div className="col-span-4 ml-0 lg:ml-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[700px] md:h-[850px] lg:h-[330px] xl:h-[400px] w-full">
                            <AnimatePresence>
                                {getProduct && getProduct.length > 0 ? (
                                    getProduct.map((product, index) => (
                                        <motion.div
                                            className="border border-gray-300 shadow-sm "
                                            key={index}
                                            // initial={{ opacity: 0, height: 0 }}
                                            // animate={{ opacity: 1, height: "auto" }}
                                            // exit={{ opacity: 0, height: 0 }}
                                            // transition={{duration: 1}}
                                        >
                                                                                        <a
                                                href={`/product/${product.product_name}`}
                                                onClick={() => handleProduct(product.id, product.product_name)}
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
                                ) : (
                                    <div>Không có sản phẩm nào.</div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-[500px]">

            </div>
        </>
    );
}

export default GetProductCategory;
