import axios from "axios"; 
import { createContext, useContext, useState, useEffect } from "react"; 
import { UseDataUser } from "./UserContext"; 
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom"; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [count, setCount] = useState(0);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { user } = UseDataUser();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Hàm lấy số lượng sản phẩm trong giỏ hàng
    const CountCart = async () => { 
        if (!token) { 
            console.warn("Token không tồn tại.");
            setCount(0);
            return;
        }
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/countCart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCount(response.data?.countCart || 0); 
        } catch (error) {
            console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
            setCount(0); 
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (product_id, color_id, quantity) => { 
        if (!token) {
            toast.error("Vui lòng đăng nhập tài khoản."); 
            return "User is not logged in."; 
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/storeCart",
                { 
                    product_id, 
                    color_id, 
                    quantity 
                }, 
                
                { 
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );
            if (response.data?.message) { 
                CountCart(); 
                fetchCart()
                return response.data.message; 
            }
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
            return "Lỗi khi thêm sản phẩm vào giỏ hàng."; 
        }
    };

    // Hàm lấy chi tiết giỏ hàng
    const fetchCart = async () => {
        if (!token) { 
            setError("Bạn cần phải đăng nhập để xem giỏ hàng."); 
            return;
        }

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/cart", {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            });
            setCart(response.data?.data?.cart_items || []);
            setMessage(response.data?.message || "");
        } catch (error) {
            console.error("Error fetching cart:", error);
            setError("Lỗi khi tải giỏ hàng."); 
        }
    };
    const deleteCart = async (id) => {
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(res.data);
            CountCart();
            fetchCart();
        } catch (error) {
            console.error('Error deleting cart item:', error.response.data);
        }
    }
    useEffect(() => {
        if (user) {
            try {
                CountCart();
                fetchCart();
            } catch (error) {
                console.error("Lỗi trong useEffect:", error);
            }
        } else {
            setCount(0);
            setCart([]);
        }
    }, [user]);

    return (
        <CartContext.Provider value={{ count, cart, setCart, handleAddToCart, deleteCart, CountCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const CartData = () => useContext(CartContext); 
