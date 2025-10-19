// Homepage.jsx
import { useEffect, useState } from "react";

export default function test() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Đang tải...</p>;

  return (
    <div className="p-4">
      <h1>Chào mừng, {user.full_name}!</h1>
      <p>Email: {user.email}</p>
      <p>Số điện thoại: {user.phone}</p>
      <p>Vai trò: {user.role}</p>
    </div>
  );
}
