import { useState } from "react";

function Toggle({ value, clicked }) {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div
      className={`${
        value ? "bg-mygreen" : "bg-gray-300"
      } relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300`}
      onClick={clicked}
    >
      <span
        className={`${
          value ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
      />
    </div>
  );
}

export default Toggle;
