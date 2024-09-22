import exclamationIcon from "../assets/icons/exclamation.svg";
import blockIcn from "../assets/icons/block.svg";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
function Unauthorized() {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    console.log(from);
    navigate(from);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <NavigationBar />
      <div className="flex justify-center items-center">
        <div className="flex flex-col w-full justify-center items-center">
          <img className="w-[100px] h-[100px]" src={blockIcn} alt="block" />
          <div className="flex justify-center items-center">
            <p className="text-[32px] font-bold text-[#555555]">
              Unauthorized Access
            </p>
            <img src={exclamationIcon} alt="exclamation" />
          </div>
          <p className="mt-5 text-[#555555] text-[18px] font-medium">
            Contact Administrator
          </p>
          <button
            onClick={(e) => handleClick(e)}
            className="border border-white"
          >
            <p>Go back</p>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Unauthorized;
