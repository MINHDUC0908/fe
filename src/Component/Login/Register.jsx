import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            if (response.data.success) {
                setSuccessMessage("Đăng ký thành công!");
                navigate('/login');
            }
            } catch (error) {
            if (error.response) {
                const errorData = error.response.data.errors;
                const errorMessages = Object.values(error.response.data.errors).flat();
                errorMessages.forEach(msg => toast.error(msg, {
                    autoClose: 3000,
                })); 
                setErrors(errorData);
            } else {
                setErrors({ general: "Đã có lỗi xảy ra khi gửi yêu cầu!" });
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Đăng ký tài khoản</h2>
                {successMessage && (
                    <div className="text-green-600 text-center mb-4">{successMessage}</div>
                )}

                {errors.general && (
                    <div className="text-red-600 text-center mb-4">{errors.general}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-600 mb-2">Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập họ và tên"
                            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name[0]}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email"
                            className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email[0]}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password[0]}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password_confirmation" className="block text-gray-600 mb-2">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className={`w-full p-3 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.password_confirmation && (
                            <p className="text-sm text-red-500">{errors.password_confirmation[0]}</p>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
