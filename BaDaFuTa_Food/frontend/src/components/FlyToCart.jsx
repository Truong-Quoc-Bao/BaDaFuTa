
// import { useEffect } from "react";
// const flyToCart = () => {
//   if (!imgRef.current || !cartIconRef.current) return;

//   const imgRect = imgRef.current.getBoundingClientRect();
//   const cartRect = cartIconRef.current.getBoundingClientRect();

//   const flyImg = imgRef.current.cloneNode(true);
//   flyImg.style.position = "fixed";
//   flyImg.style.left = imgRect.left + "px";
//   flyImg.style.top = imgRect.top + "px";
//   flyImg.style.width = imgRect.width + "px";
//   flyImg.style.height = imgRect.height + "px";
//   flyImg.style.transition =
//     "all 0.7s cubic-bezier(0.65, 0, 0.35, 1), transform 0.7s";
//   flyImg.style.zIndex = 1000;
//   flyImg.style.pointerEvents = "none";

//   document.body.appendChild(flyImg);

//   requestAnimationFrame(() => {
//     flyImg.style.left = cartRect.left + "px";
//     flyImg.style.top = cartRect.top + "px";
//     flyImg.style.width = "20px";
//     flyImg.style.height = "20px";
//     flyImg.style.opacity = "0.5";
//     flyImg.style.transform = "rotate(20deg)";
//   });

//   flyImg.addEventListener(
//     "transitionend",
//     () => {
//       flyImg.remove();
//     },
//     { once: true }
//   );
// };



import { useRef } from "react";
import { useCart } from "../contexts/CartContext";

export default function MenuItemDetail({ item, restaurant }) {
  const { addItem } = useCart();
  const imgRef = useRef(null);
  const cartIconRef = useRef(null);

  const flyToCart = () => {
    if (!imgRef.current || !cartIconRef.current) return;

    const imgRect = imgRef.current.getBoundingClientRect();
    const cartRect = cartIconRef.current.getBoundingClientRect();

    const flyImg = imgRef.current.cloneNode(true);
    flyImg.style.position = "fixed";
    flyImg.style.left = imgRect.left + "px";
    flyImg.style.top = imgRect.top + "px";
    flyImg.style.width = imgRect.width + "px";
    flyImg.style.height = imgRect.height + "px";
    flyImg.style.transition =
      "all 0.7s cubic-bezier(0.65, 0, 0.35, 1), transform 0.7s";
    flyImg.style.zIndex = 1000;
    flyImg.style.pointerEvents = "none";

    document.body.appendChild(flyImg);

    requestAnimationFrame(() => {
      flyImg.style.left = cartRect.left + "px";
      flyImg.style.top = cartRect.top + "px";
      flyImg.style.width = "20px";
      flyImg.style.height = "20px";
      flyImg.style.opacity = "0.5";
      flyImg.style.transform = "rotate(20deg)";
    });

    flyImg.addEventListener(
      "transitionend",
      () => {
        flyImg.remove();
      },
      { once: true }
    );
  };

  const handleAddToCart = () => {
    addItem(item, restaurant); // thêm vào cart
    flyToCart(); // chạy animation
  };

  return (
    <div>
      <img
        ref={imgRef}
        src={item.image}
        alt={item.name}
        className="w-full h-auto"
      />
      <button onClick={handleAddToCart} className="mt-2 btn btn-orange">
        Thêm vào giỏ hàng
      </button>

      {/* Cart Icon - nếu không có ref từ Header, có thể dùng querySelector */}
      <div
        ref={cartIconRef}
        id="cart-icon"
        className="fixed top-4 right-4 w-10 h-10"
      />
    </div>
  );
}
