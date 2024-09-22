import "../styles/new.css";
import newUser from "../assets/icons/newUser.svg";
import newUserFade from "../assets/icons/newUserFade.svg";
import newItemFade from "../assets/icons/newItemFade.svg";
import newItem from "../assets/icons/newItem.svg";
import NewUser from "./NewUser";
import NewItem from "./NewItem";
import Permissions from "./Permissions";
import permitfade from "../assets/icons/permitfade.svg";
import permit from "../assets/icons/permit.svg";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function New() {
  const location = useLocation();
  return (
    <div className="head-new">
      <NavigationBar />
      <div className="main-new">
        <nav className="left-nav">
          <Link to="newitem" className="link-button">
            <img
              src={location.pathname == "/new/newitem" ? newItem : newItemFade}
              alt="new item"
            />
          </Link>
          <Link to="newuser" className="link-button">
            <img
              src={location.pathname == "/new/newuser" ? newUser : newUserFade}
              alt="new user"
            />
          </Link>
          <Link to="permissions" className="link-button">
            <img
              src={
                location.pathname == "/new/permissions" ? permit : permitfade
              }
              alt="permissions"
            />
          </Link>
        </nav>
        <div className="new-body">
          <Routes>
            <Route path="newuser" element={<NewUser />} />
            <Route path="newitem" element={<NewItem />} />
            <Route path="permissions" element={<Permissions />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default New;
