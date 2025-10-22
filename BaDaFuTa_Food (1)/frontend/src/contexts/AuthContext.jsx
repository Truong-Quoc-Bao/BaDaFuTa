import { createContext, useContext, useReducer, useEffect } from "react";

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 🔹 Kiểm tra session khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  // 🔹 Đăng nhập từ CSDL (API thật)
  const login = async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(
        "http://192.168.100.124:3000/api/loginCustomer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: "SET_LOADING", payload: false });
        return { success: false, error: data.message || "Đăng nhập thất bại" };
      }

      // Lưu user vào localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });

      return { success: true };
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Lỗi kết nối server" };
    }
  };

  // 🔹 Đăng ký (API thật)
  const register = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(
        "192.168.100.124:3000/api/registerCustomer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        dispatch({ type: "SET_LOADING", payload: false });
        return { success: false, error: resData.message || "Đăng ký thất bại" };
      }

      // Lưu user sau khi đăng ký
      localStorage.setItem("user", JSON.stringify(resData.user));
      dispatch({ type: "LOGIN_SUCCESS", payload: resData.user });

      return { success: true };
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Không thể kết nối server" };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };


  // const logout = () => {
  //   try {
  //     // Lưu ID user cũ (nếu có)
  //     const previousUserId = state.user?._id;

  //     // Xóa thông tin user trong localStorage
  //     localStorage.removeItem("user");
  //     localStorage.removeItem("token");

  //     // 🔥 Xóa luôn giỏ hàng của user này khỏi localStorage
  //     try {
  //       if (previousUserId) {
  //         localStorage.removeItem(`cart_user_${previousUserId}`);
  //       }
  //     } catch (e) {
  //       console.error("Error removing user cart:", e);
  //     }

  //     // Cập nhật lại context
  //     dispatch({ type: "LOGOUT" });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //   }
  // };


  const updateUser = (data) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_USER", payload: data });
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, updateUser, dispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
};
