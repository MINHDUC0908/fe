import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseDataUser } from '../Context/UserContext';
import { Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

function LoginForm({setCurrentTitle}) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = UseDataUser();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
        setCurrentTitle('Login');
    }, [setCurrentTitle]);
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            await login(formData);
            toast.success('Đăng nhập thành công')
            navigate('/');
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Vui lòng nhập thông tin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-sky-100 flex justify-center items-center h-screen">
            <div className="hidden lg:block w-1/2 h-screen">
                <img
                    src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
                    alt="Login Illustration"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-6 text-center">Đăng Nhập</h1>
                {errorMessage && (
                    <div className="p-4 bg-red-100 text-red-500 rounded-md text-center mb-4">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-md py-2 px-3 focus:outline-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-600 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded-md py-2 px-3 focus:outline-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </button>
                </form>
                <div className='text-center mt-3'>
                    <span>
                        Chưa có tài khoản? <Link to={'/register'} className='text-blue-500'>Đăng kí ngay</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
export default LoginForm;
