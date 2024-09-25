import { useEffect, useState } from "react";
import "../styles/home.css";
import "../App.css";
import "../styles/newitem.css";
import Loading from "./Loading";
import NavigationBar from "./NavigationBar";
import axios from "axios";
import { apiUrl, formatMoney, generateReceiptID } from "./Constants";
import { toast } from "react-toastify";
import printIcn from "../assets/icons/print.svg";
import saveIcn from "../assets/icons/save.svg";
import closeIcn from "../assets/icons/close.svg";
import { useRef } from "react";
import { useAuth } from "../AuthProvider";

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [purchasingItems, setPurchasingItems] = useState([]);
  const [allReceipts, setAllReceipts] = useState([]);
  const [itemm, setItemm] = useState({}); // set the selected item here.
  const [purchaseTotal, setPurchaseTotal] = useState(0.0);
  const [pItem, setPItem] = useState({
    name: "",
    qnt: 0,
    price: 0,
    subtotal: 0,
  });
  const [entries, setEntries] = useState({
    qnt: "",
    amt: 0.0,
    balance: 0.0,
    search: "",
  });
  const [loading, setLoading] = useState({
    saveLoading: false,
    printLoading: false,
  });
  const [err, setErr] = useState({
    qntError: false,
  });
  const qntRef = useRef(null);
  const searchRef = useRef(null);
  const { auth } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchReceipts();
  }, []);

  useEffect(() => {
    calcTotal();
  }, [purchasingItems]);

  // fetch all products from the database
  const fetchProducts = async () => {
    await axios
      .get(`${apiUrl}/getallitems`)
      .then((response) => {
        setProducts(response.data);
        setFiltered(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  // fetch all receipts
  const fetchReceipts = async () => {
    await axios
      .get(`${apiUrl}/getallreceipts`)
      .then((response) => {
        setAllReceipts(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  // calculate purchasing list total
  const calcTotal = () => {
    const total = purchasingItems.reduce((acc, item) => {
      return acc + item.subtotal;
    }, 0);
    setPurchaseTotal(total);
    calcBalance(total);
  };

  // handle the product search
  const handleSearchInput = (e) => {
    const { name, value } = e.target;
    setEntries((prevEntries) => ({ ...prevEntries, [name]: value }));
    if (value.trim() === "") {
      setFiltered(products);
    } else {
      const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFiltered(filteredProducts);
    }
  };

  // on entries value change
  const handleValuesChange = (e) => {
    const { name, value } = e.target;
    setEntries((prevEntries) => ({ ...prevEntries, [name]: value }));
  };

  // handle quantity purchase input
  const handleQntChange = (e) => {
    const { name, value } = e.target;
    setEntries((prevEntries) => ({ ...prevEntries, [name]: value }));
    setErr((prevState) => ({ ...prevState, qntError: false }));
  };

  // select the item
  const selectItem = (item) => {
    setItemm(item);
    if (qntRef.current) {
      qntRef.current.focus();
    }
  };

  // press enter on number to be purchased
  const handleEnterKey = (e) => {
    if (e.key == "Enter") {
      if (e.target.value < 0 || 0) {
        setErr((prevState) => ({ ...prevState, qntError: true }));
      } else {
        // set the item to the purchasing list
        setPurchasingItems((prevState) => [
          ...prevState,
          {
            id: itemm.id,
            name: itemm.name,
            qnt: e.target.value,
            cost_price: itemm.cost_price,
            selling_price: itemm.selling_price,
            subtotal: e.target.value * itemm.selling_price,
          },
        ]);
        setEntries((prevState) => ({ ...prevState, [e.target.name]: "" }));

        if (searchRef.current) {
          // searchRef.current.value = "";
          searchRef.current.focus();
          setEntries((prevState) => ({ ...prevState, search: "" }));
          setFiltered(products);
        }
        setItemm({});
      }
    }
  };

  const handleAmtPaid = (e) => {
    const { name, value } = e.target;
    setEntries((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setEntries((prevState) => ({
      ...prevState,
      balance: value - purchaseTotal,
    }));
  };

  // calculate the balace left
  const calcBalance = (total) => {
    let amt = parseFloat(entries.amt) || 0;

    setEntries((prevState) => ({
      ...prevState,
      balance: !isNaN(amt) && amt > 0 ? amt - total : 0,
    }));
  };

  // clear purchasing table
  const clearAll = () => {
    //reset the search
    setFiltered(products),
      setEntries({
        qnt: "",
        amt: 0.0,
        balance: 0.0,
        search: "",
      });
    // clear the table
    setPurchasingItems([]);
  };

  // making purchase
  const savePurchase = async (e) => {
    const confirmAction = window.confirm(
      `Are you sure you want to confirm customer purcase of GHC ${formatMoney(
        purchaseTotal
      )}`
    );
    if (!confirmAction) {
      e.preventDefault();
      return;
    }
    const gen_receipt_id = generateReceiptID();
    const payload = {
      receiptInfo: { id: gen_receipt_id, user_id: auth.id },
      purchaseInfo: purchasingItems,
    };
    setLoading((prevState) => ({ ...prevState, saveLoading: true }));
    await axios
      .post(`${apiUrl}/addpurchases`, payload)
      .then((response) => {
        toast.success(response.data.message);
        clearAll();
        setLoading((prevState) => ({ ...prevState, saveLoading: false }));
        fetchReceipts();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading((prevState) => ({ ...prevState, saveLoading: false }));
      });
  };

  // print request
  const printReceipt = async (e, id) => {
    e.preventDefault();
    setLoading((prevState) => ({ ...prevState, printLoading: true }));
    const payload = {
      receipt_id: id,
      user_id: auth.id,
    };
    await axios
      .post(`${apiUrl}/print`, payload)
      .then((response) => {
        toast.success(response.data);
        setLoading((prevState) => ({ ...prevState, printLoading: false }));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading((prevState) => ({ ...prevState, printLoading: false }));
      });
  };

  return (
    <div
      className={`main-home ${
        loading.saveLoading || loading.printLoading ? "inactive" : ""
      }`}
    >
      <div
        className={`${
          loading.saveLoading || loading.printLoading ? "loading-div" : "hidden"
        }`}
      >
        <Loading />
        <p>Saving...</p>
      </div>
      <NavigationBar />
      <div
        className={`the-home ${
          loading.saveLoading || loading.printLoading ? "inactive" : ""
        }`}
      >
        <div className="known">
          <div className="input-div">
            <label htmlFor="search">Search Item</label>
            <input
              type="text"
              placeholder="search..."
              id="search"
              name="search"
              value={entries.search}
              ref={searchRef}
              onChange={handleSearchInput}
            />
          </div>
          <div className="item-list-div">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  className={`the-item ${
                    itemm.id === item.id ? "selected" : ""
                  }`}
                  key={item.id}
                  onDoubleClick={() => selectItem(item)}
                >
                  <div className="item-content">
                    <p className="i-name">{item.name}</p>
                    <div className="desc-div">
                      <p className="i-desc">{item.description}</p>
                      <p className="i-price">{`GHC ${formatMoney(
                        item.selling_price
                      )}`}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center">
                <p>No Results</p>
              </div>
            )}
          </div>
        </div>
        <div className="right">
          <div className="unknown">
            <div></div>
            <div className="receipts-div">
              {allReceipts.length > 0 ? (
                allReceipts.map((item) => (
                  <div className="receipt-item-div" key={item.id}>
                    <div className="r-details">
                      <p className="r-id-text">{item.id}</p>
                      <p className="r-total-text">{`GHC ${formatMoney(
                        item.total
                      )}`}</p>
                      <p className="r-name-text">{`${item.lastName || ""}, ${
                        item.firstName || ""
                      }`}</p>
                    </div>
                    <div className="r-dates">
                      <p>{item.timeOnly}</p>
                      <p>{item.date_of}</p>
                      <div className="pr-div">
                        <button onClick={(e) => printReceipt(e, item.id)}>
                          <img src={printIcn} alt="print" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="receipt-item-div">
                  <div className="flex w-full justify-center items-center">
                    <p>No Record Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="table-div">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Qnt</th>
                  <th>Price</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {purchasingItems.map((product, index) => (
                  <tr key={index} tabIndex={0}>
                    <td>{product.name}</td>
                    <td>{product.qnt}</td>
                    <td>{product.selling_price}</td>
                    <td>{`GHC ${formatMoney(product.subtotal)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="footer-home">
            <div className="top-footer">
              <div className="top-left">
                <div className="qnt-div">
                  <div className="input-div">
                    <label htmlFor="qnt">Quantity</label>
                    <input
                      ref={qntRef}
                      type="number"
                      id="qnt"
                      name="qnt"
                      value={entries.qnt}
                      onChange={handleQntChange}
                      onKeyDown={handleEnterKey}
                    />
                    <div
                      className={`error-on-i ${err.qntError ? "block" : ""}`}
                    >
                      <p>Error</p>
                    </div>
                  </div>
                </div>
                <div className="money-div">
                  <div className="input-div">
                    <label htmlFor="amt-paid">Amount Paid</label>
                    <input
                      type="number"
                      id="amt-paid"
                      name="amt"
                      value={entries.amt}
                      onChange={handleAmtPaid}
                    />
                  </div>
                  <div className="input-div">
                    <label htmlFor="bal">Balance</label>
                    <input
                      type="number"
                      id="bal"
                      name="balance"
                      value={entries.balance}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="tot-div">
                <p className="label">Total</p>
                <p className="tot-amt">{`GHC ${formatMoney(purchaseTotal)}`}</p>
              </div>
            </div>
            <div className="down-footer">
              <div className="home-actions">
                <div className="add-div">
                  <button onClick={() => clearAll()}>
                    <img src={closeIcn} alt="clear Table" />
                  </button>
                </div>
                <div className="add-div">
                  <button
                    disabled={purchasingItems.length === 0 ? true : false}
                    onClick={(e) => savePurchase(e)}
                  >
                    <img src={saveIcn} alt="save" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
