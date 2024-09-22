import "../styles/dashitem.css";
function LoadingTiles() {
  return (
    <div className="dash-tile animate-pulse">
      <div className="dash-items">
        <div className="item-title">
          <p className="bg-gray-500 h-[20px] w-[100px] rounded-lg mt-1"></p>
        </div>
        <div className="item-value">
          <div className="w-[30px] h-[30px] bg-gray-500 mb-2 rounded-lg"></div>
          <p className="bg-gray-500 w-[200px] h-[35px] rounded-lg"></p>
        </div>
      </div>
    </div>
  );
}

export default LoadingTiles;
