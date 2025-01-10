import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from 'axios';
import { debounce } from 'lodash';
// npm i lodash
const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategory = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/categories');
            return res.data;
        } catch (error) {
            console.log('Error fetching category:', error);
            return { error: 'Unable to load categories' };
        }
    };

    const fetchBrand = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/brands');
            return res.data;
        } catch (error) {
            console.log('Error fetching brands:', error);
            return { error: 'Unable to load brands' };
        }
    };
    const fetchData = debounce(async () => {
        setIsLoading(true);
        try {
            const [categoryResult, brandResult] = await Promise.all([fetchCategory(), fetchBrand()]);

            if (categoryResult.data) {
                setCategory(categoryResult.data);
            } else {
                setError(categoryResult.error);
            }

            if (brandResult.data) {
                setBrand(brandResult.data);
            } else {
                setError(brandResult.error);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('An error occurred while fetching data');
        }
    }, 0);
    useEffect(() => {
        fetchData();
    }, []);
    const groupedBrands = useMemo(() => {
        return brand.reduce((acc, item) => {
            const { category_id, brand_name, id: brand_id } = item;
            if (!acc[category_id]) {
                acc[category_id] = [];
            }
            acc[category_id].push({ brand_id, brand_name, });
            return acc;
        }, {});
    }, [brand]);
    return (
        <DataContext.Provider value={{ category, brand, groupedBrands, error, isLoading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
{/* Hover effects for displaying brands */}
{/* groupedBrands[cat.id]: Trong đoạn mã bạn đã đưa ra,
cat.id là ID của danh mục mà bạn đang lặp qua.
Khi bạn kiểm tra groupedBrands[cat.id],
bạn đang truy cập vào mảng các thương hiệu thuộc về danh mục có ID là cat.id. */}