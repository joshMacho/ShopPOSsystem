import { useState } from "react";
import "../styles/login.css";
import Loading from "./Loading";
import { useAuth } from "../AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { userValidation } from "./validations";
import axios from "axios";
import { apiUrl } from "./Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [user, login, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { auth, checkAuth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  // using formik
  const userFormik = useFormik({
    initialValues: user,
    validationSchema: userValidation,
    onSubmit: (values) => {
      submitLogin(values);
    },
  });

  const submitLogin = async (values) => {
    // try {
    //   await login(values.username, values.password);
    //   if (auth) {
    //     navigate(from, { replace: true });
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    setLoading(true);
    await axios
      .post(`${apiUrl}/login`, values, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          // setTimeout(() => {
          //   checkAuth(); // Ensure the auth state is updated after login
          // }, 1000);
          checkAuth();
          navigate(from, { replace: true });
          setLoading(false);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="main-login-div">
      <div className="login-div">
        <div className="h-text">
          <p>Best March Ventures</p>
        </div>
        <form className="form-div" onSubmit={userFormik.handleSubmit}>
          <div className="input-div">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              value={userFormik.values.username}
              onChange={userFormik.handleChange}
            />
            {userFormik.errors.username && (
              <small className="error-section">
                {userFormik.errors.username}
              </small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={userFormik.values.password}
              onChange={userFormik.handleChange}
            />
            {userFormik.errors.password && (
              <small className="error-section">
                {userFormik.errors.password}
              </small>
            )}
          </div>
          <div className="sub-div">
            <button disabled={loading} type="submit">
              <p>Login</p>
              {loading ? <Loading /> : ""}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
