import "../styles/dashboard.css";
import axios from "axios";
import DashItem from "./DashItem";
import moneyicn from "../assets/icons/money.svg";
import profiticn from "../assets/icons/profit.svg";
import fetchicn from "../assets/icons/fetch.svg";
import monthicn from "../assets/icons/month.svg";
import { useEffect, useState } from "react";
import { apiUrl, getFetchdate } from "./Constants";
import { formatMoney } from "./Constants";
import LoadingTiles from "./LoadingTiles";
import NavigationBar from "./NavigationBar";

function Dashboard() {
  const [dash, setDash] = useState({
    total: 0,
    profit: 0,
    profit_month: 0,
    total_month: 0,
  });
  const [loading, setLoading] = useState(false);
  const [fetchdate, setFetchdate] = useState("No fetch");

  const fetchMonies = async () => {
    setLoading(true);
    await axios
      .get(`${apiUrl}/day-month`)
      .then((response) => {
        setDash(response.data);
        setLoading(false);
        setFetchdate(getFetchdate());
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchwallet = (e) => {
    e.preventDefault();
    fetchMonies();
  };

  return (
    <div className="all-dash">
      <NavigationBar />
      <div className="footer">
        <p className="time">
          Last modified: <span>{fetchdate}</span>
        </p>
        <div className="load-fetch">
          <button className="fetchbtn" onClick={(e) => fetchwallet(e)}>
            <p>Fetch Wallet</p>
            <img src={fetchicn} />
          </button>
        </div>
      </div>

      <div className="main-dash">
        {loading ? (
          <div className="dash-body">
            <LoadingTiles />
            <LoadingTiles />
            <LoadingTiles />
            <LoadingTiles />
            <LoadingTiles />
            <LoadingTiles />
          </div>
        ) : (
          <div className="dash-body">
            <DashItem
              img={moneyicn}
              title={"Total/Today"}
              value={formatMoney(dash.total)}
            />
            <DashItem
              img={profiticn}
              title={"Profit/Today"}
              value={formatMoney(dash.profit)}
            />
            <DashItem
              img={moneyicn}
              title={"--**--"}
              value={formatMoney(20000)}
            />

            <DashItem
              img={monthicn}
              title={"Total/Month"}
              value={formatMoney(dash.total_month)}
            />
            <DashItem
              img={profiticn}
              title={"Profit/Month"}
              value={formatMoney(dash.profit_month)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
