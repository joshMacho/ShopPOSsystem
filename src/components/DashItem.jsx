import "../styles/dashitem.css";

function DashItem({ img, title, value }) {
  return (
    <div className="dash-tile">
      <div className="dash-items">
        <div className="item-title">
          <p>{title}</p>
        </div>
        <div className="item-value">
          <img src={img} />
          <p>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default DashItem;
