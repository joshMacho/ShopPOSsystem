import "../styles/nav.css";
import hmeicn from "../assets/icons/home.svg";
import dashboardicn from "../assets/icons/dashboard.svg";
import statsicn from "../assets/icons/stats.svg";
import usericn from "../assets/icons/user.svg";
import invoiceicn from "../assets/icons/invoice.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import userIcn from "../assets/icons/newUser.svg";
import { useAuth } from "../AuthProvider";
import { useEffect, useRef, useState } from "react";

function NavigationBar() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const popRef = useRef(null);
  const navigateTo = (path) => {
    navigate(path);
  };
  const { auth, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popRef.current && !popRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popRef]);

  // show the popup
  const showPop = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="main-top">
      <div className="main-navigation ">
        <div className="navbuts-div">
          <button onClick={() => navigateTo("/dashboard")}>
            <p>Dashboard</p>
            <img src={dashboardicn} />
          </button>
          <button onClick={() => navigateTo("/home")}>
            <p>Home</p>
            <img src={hmeicn} />
          </button>
          <button onClick={() => navigateTo("/statistics")}>
            <p>Statistics</p>
            <img src={statsicn} />
          </button>
          <button onClick={() => navigateTo("/invoice")}>
            <p>Invoice</p>
            <img src={invoiceicn} />
          </button>
          <button onClick={() => navigateTo("/new")}>
            <p>New</p>
            <img src={usericn} />
          </button>
        </div>
        <div className="settings">
          <div className="set" onClick={() => showPop()}>
            <p>{`${auth.lastName}, ${auth.firstName}` || "null"}</p>
            <img src={userIcn} alt="user" />
          </div>
          <div
            className={`sett-popup ${showPopup ? "" : "hidden"}`}
            tabIndex={0}
            ref={popRef}
          >
            <button onClick={() => logout()}>
              <p>Logout</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NavigationBar;
