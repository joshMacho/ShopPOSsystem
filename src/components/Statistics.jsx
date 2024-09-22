import DatePicker from "react-datepicker";
import "../styles/stats.css";
import "react-datepicker/dist/react-datepicker.css";
import searchicn from "../assets/icons/search.svg";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl, formatMoney } from "./Constants";
import Table from "./Table";
import DashItem from "./DashItem";
import moneyicn from "../assets/icons/money.svg";
import profiticn from "../assets/icons/profit.svg";
import { format } from "date-fns";
import TableIG from "./TableIG";
import NavigationBar from "./NavigationBar";

function Statistics() {
  const [dates, setDates] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [purchases, setPurchases] = useState([]);
  const [groups, setGroups] = useState([]);
  const [income, setIncome] = useState({
    profit: 0.0,
    total: 0.0,
  });

  const handleFromChange = (date) => {
    setDates((prevdata) => ({ ...prevdata, from: date }));
  };
  const handleToChange = (date) => {
    setDates((prevdata) => ({ ...prevdata, to: date }));
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    getData();
    getIncomes();
    getGroups();
  };
  //get all the items in the specified date range
  const getData = async () => {
    await axios
      .post(`${apiUrl}/date/range`, dates)
      .then((response) => {
        setPurchases(response.data);
        toast.success("Successfull");
      })
      .catch((error) => {
        toast.error(`Unable to load records - ${error.message}`);
      });
  };
  // get profit and total income in the specified date range
  const getIncomes = async () => {
    await axios.post(`${apiUrl}/incometotals`, dates).then((response) => {
      setIncome({
        profit: response.data.profit,
        total: response.data.total,
      }).error((error) => {
        console.log(error);
      });
    });
  };
  // get all groups
  const getGroups = async () => {
    await axios
      .post(`${apiUrl}/groups`, dates)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="head-invoice">
      <NavigationBar />
      <div className="main-invoice">
        <div className="query-div">
          <div className="queries">
            <form className="q-values" onSubmit={(e) => handleQuery(e)}>
              <div className="selectdate-div">
                <p>From</p>
                <DatePicker
                  name="from"
                  selected={dates.from}
                  onChange={handleFromChange}
                  dateFormat="yyy-MM-dd"
                  startDate={new Date()}
                  className="custom-datepicker"
                />
              </div>
              <div className="selectdate-div">
                <p>To</p>
                <DatePicker
                  name="from"
                  selected={dates.to}
                  onChange={handleToChange}
                  dateFormat="yyyy-MM-dd"
                  startDate={new Date()}
                  className="custom-datepicker"
                />
              </div>
              <div className="but-div">
                <button>
                  <p>Ouery</p>
                </button>
              </div>
              <div></div>
            </form>
          </div>
        </div>
        <div className="stat-body">
          <div className="left-stat">
            <div className="one">
              <div className="all-items-div">
                <div className="query-label">
                  <p>{`All items From: ${format(
                    dates.from,
                    "dd MMMM yyyy"
                  )} -- ${format(dates.to, "dd MMMM yyyy")}`}</p>
                </div>
                <Table purchases={purchases} />
              </div>
              <div className="one-under ">
                <div className="query-label">
                  <p>Money</p>
                </div>
                <div className="amounts">
                  <div className="amt-l">
                    <img src={moneyicn} alt="total" />
                    <p>Total</p>
                  </div>
                  <div className="amt-p">
                    <p>{`GHC ${formatMoney(income.total)}`}</p>
                  </div>
                </div>
                <div className="amounts">
                  <div className="amt-l">
                    <img src={profiticn} alt="total" />
                    <p>Profit</p>
                  </div>
                  <div className="amt-p">
                    <p>{`GHC ${formatMoney(income.profit)}`}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="two">
              <div className="group-items-div">
                <div className="query-label">
                  <p>Grouped Items</p>
                </div>
                <TableIG groups={groups} />
              </div>
            </div>
          </div>
          {/* <div className="right-stat"></div> */}
        </div>
      </div>
    </div>
  );
}
export default Statistics;
