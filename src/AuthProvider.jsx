import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { apiUrl } from "./components/Constants";
import { toast } from "react-toastify";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

// provide the auth context to the app
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = Cookies.get("session_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } else {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  // login
  const login = async (username, password) => {
    setLoading(true);
    await axios
      .post(
        `${apiUrl}/login`,
        { username, password },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Login successful, checking cookies...");
        setTimeout(() => {
          checkAuth(); // Ensure the auth state is updated after login
        }, 1000);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
        console.log(error);
      });
  };

  // check and decode token
  const checkAuth = () => {
    const token = Cookies.get("session_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuth(decodedToken);
    } else {
      setAuth(null);
    }
  };

  // logout
  const logout = () => {
    // navigate("/login");
    <Navigate to="/login" />;
    if (Cookies.remove("session_token")) {
      checkAuth();
    }

    // update authentication
    setAuth(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
