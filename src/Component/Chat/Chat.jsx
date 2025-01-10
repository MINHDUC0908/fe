import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Pusher from "pusher-js";
import axios from "axios";
import { format } from "date-fns";
import { isAfter, isSameDay, addMinutes } from "date-fns";
import { trim } from "lodash";
import { LuSend } from "react-icons/lu";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FaRegHandPointDown } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";
import { vi } from 'date-fns/locale';


function Chat() {
    const [show, setShow] = useState(false);
    const [messages, setMessages] = useState([]); // Lưu trữ tất cả tin nhắn
    const [message, setMessage] = useState("");  // Tin nhắn hiện tại từ input
    const [newMessageCount, setNewMessageCount] = useState(0); // Đếm số tin nhắn mới
    const token = localStorage.getItem("token");
    const [selectedTimes, setSelectedTimes] = useState({});
    const chatEndRef = useRef(null);
    const [emojis, setEmojis] = useState(false);
    const [messagess, setMessagess] = useState([]); // Lưu trữ tất cả tin nhắn
    const [showGoDown, setShowGoDown] = useState(false);
    const popularEmojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
        '❤️', '👍', '👏', '🎉', '🌟', '🚀', '💡', '🤔',
        '😎', '🤗', '😜', '😝', '🤭', '😬', '😳', '😌',
        '😏', '🤤', '😋', '🤩', '🥳', '💀', '👀', '😋',
        '🥺', '🧐', '🤓', '🤪', '😈', '👻', '💖', '✨',
        '💅', '🧠', '🫶', '🍀', '🌈', '🦋', '🌸', '🥑',
        '🍉', '🍓', '🍌', '🍍', '🍒', '🥥', '🍓', '🥝',
        '🍒', '🥕', '🍔', '🍟', '🍕', '🍣', '🍦', '🍪',
        '🍩', '🍮', '🍰', '🧁', '🍫', '🍪', '🎂', '🍬',
        '🥧', '🍻', '🥂', '🍷', '🍸', '🍹', '🥃', '🍺',
        '🍾', '🍻', '🫖', '🍲', '🍛', '🍜', '🍣', '🥗',
        '🥟', '🍗', '🍖', '🍤', '🦐', '🦑', '🍚', '🍙'
    ];
    

    // Cấu hình Pusher
    useEffect(() => {
        const pusher = new Pusher("c44c17ba15a1c83ce51d", {
            cluster: "ap1",
            forceTLS: true,
        });
    
        const channel = pusher.subscribe("chat");
    
        channel.bind("ChatMessageSent", (event) => {
            // Kiểm tra và thêm tất cả tin nhắn vào messages
            setMessages((prevMessages) => {
                const isDuplicate = prevMessages.some(
                    (msg) => msg.message === event.message && msg.timestamp === event.timestamp
                );

                // Nếu tin nhắn mới không phải là bản sao, thêm vào danh sách
                if (!isDuplicate) {
                    if (event.sender === "Admin") {
                        setNewMessageCount((prevCount) => prevCount + 1);
                    }
                    return [
                        ...prevMessages,
                        {
                            sender: event.sender,
                            message: event.message,
                            timestamp: event.timestamp,
                        },
                    ];
                }
                return prevMessages;
            });
        });
        
        // Cleanup khi unmount
        return () => {
            pusher.unsubscribe("chat");
            pusher.disconnect();
        };
    }, []);

    // Hàm gửi tin nhắn
    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/send-message-fe",
                { message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!trim())
            {
                if (response.status === 200) {
                    setMessage(""); // Reset tin nhắn sau khi gửi
                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
    };
    const indexMessage = async () => {
        try {
            if (!messagess || messagess.length === 0) {
                const result = await axios.get("http://127.0.0.1:8000/api/message-fe", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (result && result.data) {
                    setMessagess(result.data.data); // Lưu trữ dữ liệu nếu có
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    
    useEffect(() => {
        if (token) {
            indexMessage();
        }
    }, [messagess]);
    
    console.log(messagess);
    
    // Hàm định dạng thời gian
    const formatTime = (timestamp) => {
        return format(new Date(timestamp), "HH:mm:ss ");
    };

    const handleTimeTamp = (timestamp, msgId) => {
        setSelectedTimes((prevTimes) => ({
            ...prevTimes,
            [msgId]: prevTimes[msgId] === timestamp ? null : timestamp,
        }));
    };
    const handleTimeTampS = (timestamp, msgId) => {
        setSelectedTimes((prevTimes) => ({
            ...prevTimes,
            [msgId]: prevTimes[msgId] === timestamp ? null : timestamp,
        }));
    };
    // Hàm để reset số lượng tin nhắn mới khi xem tin nhắn
    const handleChatClick = () => {
        setShow(!show);
        sessionStorage.removeItem('newMessageCount');
        setNewMessageCount(0); // Reset thông báo tin nhắn mới khi nhấn vào chat
    };
    // Cuộn đến cuối khi mở chat
    useEffect(() => {
        if (show && chatEndRef.current) {
            chatEndRef.current.scrollIntoView();
        }
    }, [show]); // Chạy khi show thay đổi

    // Hàm cuộn đến cuối tin nhắn
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    const handleScroll = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [image, setImage] = useState(null);
    const handleImage = (image) => {
        setMessage(message + image);
    }
    const Emojis = () => {
        const handleEmojiClick = (emoji) => {
            setMessage(message + emoji); // Thêm emoji vào tin nhắn
            setEmojis(false);
        };
        return (
            <div className="absolute bottom-[68px] left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border p-2 grid grid-cols-8 gap-2 max-h-40 overflow-y-auto w-full custom-scroll">
                {popularEmojis.map((emoji, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-2xl hover:text-blue-500"
                        onClick={() => handleEmojiClick(emoji)}
                    >
                        {emoji}
                    </div>
                ))}
            </div>
        );        
    };
    const filteredMessages = messagess.reduce((acc, item, index, array) => {
        // Kiểm tra nếu tin nhắn hiện tại khác với tin nhắn trước đó
        if (index === 0 || item.message !== array[index - 1].message) {
            acc.push(item);
        }
        return acc;
    }, []);
    if (newMessageCount > 0)
    {
        sessionStorage.setItem('newMessageCount', newMessageCount);
    }
    const session = sessionStorage.getItem('newMessageCount');
    return (
        <>
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            box-shadow: 0 0 10px 3px rgba(128, 128, 255, 0.5),
                                        0 0 20px 6px rgba(128, 128, 255, 0.3),
                                        0 0 30px 9px rgba(128, 128, 255, 0.1);
                            opacity: 0.8;
                        }
                        50% {
                            box-shadow: 0 0 20px 6px rgba(128, 128, 255, 0.6),
                                        0 0 30px 9px rgba(128, 128, 255, 0.4),
                                        0 0 40px 12px rgba(128, 128, 255, 0.2);
                            opacity: 1;
                        }
                        100% {
                            box-shadow: 0 0 10px 3px rgba(128, 128, 255, 0.5),
                                        0 0 20px 6px rgba(128, 128, 255, 0.3),
                                        0 0 30px 9px rgba(128, 128, 255, 0.1);
                            opacity: 0.8;
                        }
                    }

                    .chat-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: fixed;
                        border-radius: 50%;
                        background: linear-gradient(to right, #3b82f6, #9333ea);
                        cursor: pointer;
                        animation: pulse 3s infinite;
                        transition: all 0.3s ease;
                    }

                    .notification-badge {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background-color: red;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                    }
                `}
            </style>
            <style>
                    {`
                        .custom-scroll::-webkit-scrollbar {
                            width: 3px;
                        }
        
                        .custom-scroll::-webkit-scrollbar-thumb {
                            background-color: #4caf50; /* Màu của phần cuộn */
                            border-radius: 10px;
                        }
        
                        .custom-scroll::-webkit-scrollbar-track {
                            background-color: #f1f1f1; /* Màu nền của thanh cuộn */
                        }
                    `}
            </style>
            <div
                className="chat-icon lg:bottom-24 lg:right-10 right-1 bottom-36 w-12 h-12 lg:h-14 lg:w-14 z-50 relative"
                onClick={handleChatClick}
            >
                {
                    !show && session > 0 && (
                        <div className="notification-badge">{session}</div>
                    )
                }
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "2rem", height: "2rem", color: "white" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7.5 2.5a2.5 2.5 0 01-2.5-2.5v-6a2.5 2.5 0 012.5-2.5h9a2.5 2.5 0 012.5 2.5v6a2.5 2.5 0 01-2.5 2.5H8.5z"
                    />
                </svg>
            </div>

            {show && (
                <div className="fixed z-50 right-10 bottom-44 w-80 bg-white rounded-lg shadow-lg border border-gray-200 ">
                    <div className="flex items-center justify-between bg-gray-500 text-white py-3 px-4 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src="./icon.png" alt="" className="rounded-full border-4 border-teal-400" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            </div>
                            <span className="font-semibold text-lg">DUCCOMPUTER</span>
                        </div>
                        <button className="text-white" onClick={() => {setShow(false); setNewMessageCount(0); sessionStorage.removeItem('newMessageCount');}}>
                            <IoIosClose size={33} />
                        </button>
                    </div>
                    <div className="relative">
                        <div className="h-[350px] overflow-y-auto px-4 py-3 bg-gray-50 custom-scroll relative">
                            {
                                filteredMessages.map((item, index) => {
                                    const currentTime = new Date(item.created_at);
                                    const prevTime = index > 0 ? new Date(filteredMessages[index - 1].created_at) : null;
                                    const showTime = !prevTime || isAfter(currentTime, addMinutes(prevTime, 10));
                                    const showTimeDay = !prevTime || !isSameDay(currentTime, prevTime);
                                    return (
                                        <div key={item.id}>
                                            {(showTimeDay || selectedTimes[item.id] === item.created_at)  && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-gray-500 text-xs">
                                                        {format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss")}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Nếu tin nhắn thuộc cùng ngày, chỉ hiển thị giờ phút giây */}
                                            {!showTimeDay && (showTime) && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-gray-500 text-xs">
                                                        {format(new Date(item.created_at), "HH:mm:ss")}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    {item.sender === "Admin" && (
                                                        <img src="/icon.png" alt="" className="rounded-full" />
                                                    )}
                                                </div>
                                                <div
                                                    className={`flex ${item.sender === "Customer" ? "justify-end" : "justify-start"} my-2 w-full`}
                                                >
                                                    <div className="max-w-[70%] p-3 rounded-lg bg-indigo-500 text-white cursor-pointer">
                                                        <p
                                                            className="text-sm"
                                                            onClick={() => handleTimeTampS(item.created_at, item.id)}
                                                        >
                                                            {item.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div ref={chatEndRef}></div>
                                        </div>
                                    )
                                })
                            }
                            {messages.map((msg, index) => {
                                const currentTime = new Date(msg.timestamp);
                                const prevTime = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                                const showTime = !prevTime || isAfter(currentTime, addMinutes(prevTime, 10));
                                return (
                                    <div key={index}>
                                        {(showTime || selectedTimes[msg.id] === msg.timestamp) && (
                                            <div className="flex justify-center my-2">
                                                <span className="text-gray-500 text-xs">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                {msg.sender === "Admin" && (
                                                    <img src="/icon.png" alt="" className="rounded-full" />
                                                )}
                                            </div>
                                            <div
                                                className={`flex ${msg.sender === "Customer" ? "justify-end" : "justify-start"} my-2 w-full`}
                                            >
                                                <div className="max-w-[70%] p-3 rounded-lg bg-indigo-500 text-white cursor-pointer">
                                                    <p
                                                        className="text-sm"
                                                        onClick={() => handleTimeTamp(msg.timestamp, msg.id)}
                                                    >
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div ref={chatEndRef}></div>
                                    </div>
                                );
                            })}
                        </div>
                        {
                            showGoDown && (
                                <div className="z-50 absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-red-400" onClick={handleScroll}>
                                    <FaRegHandPointDown className="cursor-pointer" size={20} />
                                </div>
                            )
                        }
                    </div>
                    <div className="flex items-center px-2 py-3 border-t border-gray-200">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 py-3 px-1 text-sm outline-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <button className="ml-3 text-gray-600">
                            <label htmlFor="text">
                                <FaFileImage className='cursor-pointer' size={20}  onClick={handleImage}/>
                            </label>
                            <input type="file" id='text' className='hidden' />
                        </button>
                        <button className="ml-3 text-gray-600">
                            <TfiCommentsSmiley size={20} onClick={() => setEmojis(!emojis)}/>
                        </button>
                        <button className="ml-3 text-gray-600" onClick={sendMessage}>
                            <LuSend size={20} />
                        </button>
                        {emojis && <Emojis/>}
                    </div>
                </div>
            )}
        </>
    );
}

export default Chat;
