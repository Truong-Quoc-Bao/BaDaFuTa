import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const ChatDriverPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  

  const getSmartReply = (message) => {
    const msg = message.toLowerCase();
  
    if (msg.includes("đâu") || msg.includes("ở đâu"))
      return "Dạ, em đang gần tới rồi anh, chắc tầm 1-2 phút nữa ạ!";
  
    if (msg.includes("bao lâu") || msg.includes("khi nào"))
      return "Em đang chạy qua đoạn kẹt xe nhẹ, tầm 5 phút nữa tới nha anh!";
  
    if (msg.includes("ok") || msg.includes("cảm ơn"))
      return "Dạ, em cảm ơn anh Bảo Bến Cảng đẹp trai nhất thế giới luôn nha ❤️";
  
    if (msg.includes("giao") || msg.includes("đơn"))
      return "Em đang giao đơn hàng cho anh nè, anh nhớ kiểm tra kỹ giúp em nha!";
  
    if (msg.includes("trễ") || msg.includes("lâu"))
      return "Em xin lỗi anh, do kẹt xe chút xíu á, em đang cố chạy nhanh tới ạ 😭";
  
    if (msg.includes("đang làm gì") || msg.includes("sao lâu vậy"))
      return "Dạ em đang ghé lấy hàng anh ơi, xong là phi qua liền luôn nè!";
  
    if (msg.includes("gấp") || msg.includes("nhanh lên"))
      return "Dạ hiểu liền anh, em đang đạp ga hết cỡ luôn 😅 anh chờ em xíu nha!";
  
    if (msg.includes("tới chưa") || msg.includes("đến chưa"))
      return "Sắp tới rồi anh ơi, em đang ngay ngã ba phía trước luôn đó 🚗💨";
  
    if (msg.includes("hello") || msg.includes("chào"))
      return "Dạ, em chào anh Bảo Bến Cảng đẹp trai nhất thế giới ạ 😍";
  
    if (msg.includes("mấy giờ") || msg.includes("giờ nào"))
      return "Dạ, khoảng tầm 5 phút nữa là em có mặt chỗ anh liền nha!";
  
    if (msg.includes("ngủ chưa") || msg.includes("ăn cơm chưa"))
      return "Haha, em chưa ngủ đâu, đang chạy đơn của anh đó 😆";
  
    return "Dạ, em đang trên đường tới chỗ anh nha, anh chờ em xíu ạ!";
  };
  
  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();

    // Add user message
    setMessages((prev) => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');

    // Typing effect
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'Tài xế đang nhập...', sender: 'driver', typing: true },
      ]);
    }, 500);

    // Smart driver reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => !m.typing),
        { text: getSmartReply(userMsg), sender: 'driver' },
      ]);
    }, 1500);
  };

  // Scroll mượt, tránh nhảy khung
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Container */}
      <div className="flex flex-col h-[85vh] w-full max-w-lg bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 bg-white px-4 py-3 border-b border-gray-300 shadow-sm sticky top-0 z-10">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="w-5 h-5 cursor-pointer text-gray-700 hover:text-orange-500"
          />
          <h2 className="text-base font-semibold truncate">Nhắn tin với tài xế #{id}</h2>
        </div>

        {/* Chat content */}
        {/* <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50"> */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'driver' && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                  alt="Driver"
                  className="w-7 h-7 rounded-full mr-2"
                />
              )}
              <div
                className={`px-3 py-2 rounded-2xl text-sm max-w-[75%] break-words ${
                  msg.sender === 'user'
                    ? 'bg-orange-500 text-white rounded-br-none'
                    : msg.typing
                    ? 'bg-gray-200 text-gray-500 italic'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
                  alt="User"
                  className="w-7 h-7 rounded-full ml-2"
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-2 bg-white border-t  border-gray-300 shadow-inner flex items-center gap-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={sendMessage}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
