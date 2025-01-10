import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import NavBar from "../Navbar/Navbar";
import Home from "../../Pages/Home/Home";

const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Số lượng bông tuyết
            const numberOfSnowflakes = 50;

            // Tạo danh sách các bông tuyết
            const flakes = Array.from({ length: numberOfSnowflakes }, (_, i) => ({
                id: i,
                left: Math.random() * 100 + "vw", // Vị trí ngang ngẫu nhiên
                animationDuration: Math.random() * 3 + 2 + "s", // Thời gian rơi ngẫu nhiên
                fontSize: Math.random() * 10 + 10 + "px", // Kích thước ngẫu nhiên
        }));

        setSnowflakes(flakes);
    }, []);

  // CSS trực tiếp trong component
    const styles = {
            container: {
                position: "relative",
                width: "100%",
                height: "100vh",
                overflow: "hidden",
            },
            snowflake: {
                position: "absolute",
                top: "-10px",
                color: "#ffffff", // Màu trắng
                opacity: 0.8,
                animationName: "fall",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
            },
            // Keyframe animation
            "@keyframes fall": {
                "0%": {
                    transform: "translateY(-10px) translateX(0)",
                },
                "100%": {
                    transform: "translateY(100vh) translateX(calc(-10px + 20vw))",
                },
            },
    };

  return (
        <div style={styles.container}>
            {/* Hiển thị các bông tuyết */}
                {snowflakes.map((flake) => (
                    <div
                    key={flake.id}
                    style={{
                        ...styles.snowflake,
                        left: flake.left,
                        fontSize: flake.fontSize,
                        animationDuration: flake.animationDuration,
                    }}
                    >
                    ❄️
                    </div>
            ))}

            {/* Nội dung trang */}
            <div>
                <Header/>
            </div>

            {/* Thêm keyframes trực tiếp */}
            <style>
                {`
                @keyframes fall {
                    0% {
                    transform: translateY(-10px) translateX(0);
                    }
                    100% {
                    transform: translateY(100vh) translateX(calc(-10px + 20vw));
                    }
                }
                `}
            </style>
        </div>
    );
};

export default SnowEffect;
