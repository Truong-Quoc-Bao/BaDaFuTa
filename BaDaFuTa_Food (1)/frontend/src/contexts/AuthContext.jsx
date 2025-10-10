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
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

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

// Mock users database
const mockUsers = [
  {
    id: "1",
    unfid: "user001",
    email: "user@example.com",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    gender: "male",
    dateOfBirth: "1990-01-01",
    role: "customer",
    password: "123456",
  },
  {
    id: "2",
    unfid: "merchant001",
    email: "merchant@example.com",
    name: "Chủ nhà hàng",
    phone: "0987654321",
    gender: "male",
    dateOfBirth: "1985-05-15",
    role: "merchant",
    password: "123456",
  },
];

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on app start
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

  const login = async (unfid, password) => {
    dispatch({ type: "SET_LOADING", payload: true });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if UNFID exists
    const user = mockUsers.find((u) => u.unfid === unfid);
    if (!user) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "UNFID không tồn tại" };
    }

    // Check password
    if (user.password !== password) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Mật khẩu không chính xác" };
    }

    // Login success
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    dispatch({ type: "LOGIN_SUCCESS", payload: userWithoutPassword });

    return { success: true };
  };

  const register = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validation
    if (data.password !== data.confirmPassword) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Mật khẩu xác nhận không khớp" };
    }

    if (data.password.length < 6) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
    }

    // Generate unique UNFID
    const generateUNFID = () => {
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `USER${timestamp.slice(-6)}${randomNum}`;
    };

    let unfid = generateUNFID();
    // Ensure UNFID is unique
    while (mockUsers.find((u) => u.unfid === unfid)) {
      unfid = generateUNFID();
    }

    // Check if email already exists
    const existingEmail = mockUsers.find((u) => u.email === data.email);
    if (existingEmail) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Email đã được sử dụng" };
    }

    // Phone validation - must start with 0 and have exactly 10 digits
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: false,
        error: "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số",
      };
    }

    // Date of birth validation
    if (!data.dateOfBirth) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: "Vui lòng chọn ngày sinh" };
    }

    // Check if user is at least 13 years old
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      age < 13 ||
      (age === 13 && monthDiff < 0) ||
      (age === 13 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: false,
        error: "Bạn phải từ 13 tuổi trở lên để đăng ký",
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      unfid: unfid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      role: data.role,
      password: data.password,
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    dispatch({ type: "LOGIN_SUCCESS", payload: userWithoutPassword });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (data) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_USER", payload: data });
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
