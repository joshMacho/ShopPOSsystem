import { useEffect, useState, useMemo } from "react";
import "../styles/invoice.css";
import "../App.css";
import axios from "axios";
import {
  apiUrl,
  encryptJsonValue,
  formatMoney,
  generateReceiptID,
  generateINV,
} from "./Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import removeIcn from "../assets/icons/remove.svg";
import InvoicePDF from "./InvoicePDF";
import { useLocation, useNavigate } from "react-router-dom";
import moneyIcn from "../assets/icons/money.svg";
import DashItem from "./DashItem";
import addIcn from "../assets/icons/add.svg";
import calcIcn from "../assets/icons/calculator.svg";
import { useFormik } from "formik";
import { receipientValidation } from "./validations";
import arrowIcn from "../assets/icons/arrow.png";
import Loading from "./Loading";
import NavigationBar from "./NavigationBar";

function Invoice() {
  const [allitems, setAllitems] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [item, setItem] = useState({
    id: "",
    itemName: "",
    cost_price: "",
    selling_price: 0.0,
    qnt: 0.0,
    total: 0.0,
  });
  const [receipient, setReceipient] = useState({
    id: "",
    name: "",
    additional: "+233",
  });
  const [itemGroup, setItemGroup] = useState([item]);
  const [invid, setInvid] = useState({ id: "" });
  let [totalAmount, setTotalAmount] = useState(0.0);
  const [change, setChange] = useState(false);
  const [trigger, setTrigger] = useState(1);
  const navigate = useNavigate();
  const [filteredItems, setFilteredItems] = useState(allitems);
  const [filteredInvoices, setFilteredInvoices] = useState(allInvoices);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showIndex, setShowIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [searchInv, setSerarchInv] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedInv, setSelectedInv] = useState(0);
  const [loading, setLoading] = useState({
    actionLoading: false,
  });
  const receipientFormik = useFormik({
    initialValues: receipient,
    validationSchema: receipientValidation,
    onSubmit: (values, formikHelpers) => {
      submitInvoice(values, formikHelpers);
    },
  });
  const location = useLocation();

  useEffect(() => {
    fetchItems();
    fetchInvoices();
    if (localStorage.getItem("invoiceData")) {
      const invDet = JSON.parse(localStorage.getItem("invoiceData"));
      setItemGroup(invDet);
    }
  }, []);

  useEffect(() => {
    if (trigger == 1) {
      checkForChange();
      setTrigger(0);
    }
  }, [trigger]);

  // fetch the items from database
  const fetchItems = async () => {
    await axios
      .get(`${apiUrl}/getallitems`)
      .then((response) => {
        setAllitems(response.data);
      })
      .catch((error) => {
        toast.error(`Unable to load items $${error.message}`);
      });
  };

  // fetch invoices
  const fetchInvoices = async () => {
    await axios
      .get(`${apiUrl}/getallinvoices`)
      .then((response) => {
        setAllInvoices(response.data);
        setFilteredInvoices(response.data);
      })
      .catch((error) => {
        toast.error("Unable to load Invoices");
        console.log(error);
      });
  };

  // selected item

  // change an item in the invoice arrays
  const changeItem = (index, e) => {
    const { name, value } = e.target;
    setItemGroup((prevGroup) =>
      prevGroup.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
    setTrigger(1);
  };

  // add a new invoice item
  const addNewGroup = () => {
    setItemGroup([...itemGroup, item]);
  };

  // remove an invoice item
  const removeItem = (index) => {
    const newGroup = itemGroup.filter((_, i) => i !== index);
    setItemGroup(newGroup);
    setTrigger(1);
  };

  // clear Invoice and set a new one
  const newInvoice = () => {
    localStorage.removeItem("invoiceData");
    localStorage.removeItem("invID");
    setItemGroup([item]);
    setTotalAmount(0.0);
  };

  const calculate = (e) => {
    e.preventDefault();
    // const invID = localStorage.getItem("invID");
    // if (invID) {
    //   setInvid({ id: JSON.parse(invID) });
    // } else {
    //   const newid = generateINV();
    //   const encryptVal = encryptValue(newid);
    //   setInvid({ id: newid });
    //   localStorage.setItem("invID", JSON.stringify({ id: encryptVal }));
    // }
    setTotalAmount(total());
    // Save to local storage
    localStorage.setItem("invoiceData", JSON.stringify(itemGroup));
    setChange(false);
    setTrigger(0);
  };

  // calculate total
  const total = () => {
    const totalPrice = itemGroup.reduce((acc, item) => {
      return acc + item.selling_price * item.qnt;
    }, 0);
    return totalPrice;
  };

  // check for change in the invoice list
  const checkForChange = () => {
    const currentTotal = total();
    currentTotal == totalAmount ? setChange(false) : setChange(true);
  };

  // submit invoice
  const submitInvoice = async (values, { resetForm }) => {
    const invoiceid = generateINV();
    const payload = {
      receipient: values,
      items: [...itemGroup],
    };
    await axios
      .post(`${apiUrl}/saveinvoice/${invoiceid}`, payload)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
        newInvoice();
        fetchInvoices();
      })
      .catch((error) => {
        toast.error(`${error.message}`);
        console.log(error);
      });
  };

  // view the invoice in pdf form
  const generatePDF = async (receipient) => {
    let data = [];
    let encryptedData = "";
    const encryptedR = encryptJsonValue({
      id: receipient.id,
      name: receipient.name,
      additional: receipient.additional,
      total: receipient.total,
      date_of: receipient.date_of,
    });
    await axios
      .get(`${apiUrl}/getinvoiceitems/${receipient.id}`)
      .then((response) => {
        data = response.data;
        encryptedData = encryptJsonValue(response.data);
      })
      .catch((error) => {
        toast.error(`Unable to load PDF. ${error.message}`);
      });
    localStorage.setItem("invData", encryptedData);
    localStorage.setItem("rec", encryptedR);
    window.open("/view-invoice", "_blank");
  };

  const memoizedPDF = useMemo(
    () => <InvoicePDF data={[...itemGroup]} />,
    [itemGroup]
  );

  const handleSearch = (index, e) => {
    setShowIndex(index);
    const { name, value } = e.target;
    setItemGroup((prevGroup) =>
      prevGroup.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
    if (value.trim() === "") {
      setFilteredItems(allitems);
    } else {
      const filtered = allitems.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowDropdown(true);
    }
  };

  const handleSelect = (index, prod) => {
    setItemGroup((prevGroup) =>
      prevGroup.map((item, i) =>
        i === index
          ? {
              ...item,
              itemName: prod.name,
              selling_price: prod.selling_price,
              cost_price: prod.cost_price,
              id: prod.id,
            }
          : item
      )
    );
    setShowDropdown(false);
  };

  // search invoices
  const handleSearchChange = (e) => {
    setSerarchInv(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredInvoices(allInvoices);
    } else {
      const filterInv = allInvoices.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredInvoices(filterInv);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200); // Timeout to allow click
  };

  // popup action on blur
  const invPopupOnBlur = () => {
    setTimeout(() => setShowPopup(false), 200);
  };

  // show the selected popup
  const showSelectedPopup = (index) => {
    setSelectedInv(index);
    setShowPopup(!showPopup);
  };

  // delete the invoice
  const deleteInvoice = async (e, id) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete invoice No#-${id}`
    );
    if (!confirmation) {
      e.preventDefault();
      return;
    }
    await axios
      .delete(`${apiUrl}/deleteinvoice/${id}`)
      .then((response) => {
        toast.success(response.message);
        fetchInvoices();
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  // make invoice payment
  const makeInvoicePayment = async (invoice) => {
    const receiptID = generateReceiptID();
    const payload = { invoice: invoice };
    setLoading((prev) => ({ ...prev, actionLoading: true }));
    await axios
      .post(`${apiUrl}/payinvoice/${receiptID}`, payload)
      .then((response) => {
        toast.success(response.message);
        fetchInvoices();
        setLoading((prev) => ({ ...prev, actionLoading: false }));
        setShowPopup(false);
      })
      .catch((error) => {
        setLoading((prev) => ({ ...prev, actionLoading: false }));
        toast.error(error.message);
        console.log(error);
      });
  };

  return (
    <div className="head-inv">
      <NavigationBar />
      <div className="main-inv">
        <div className="invoice-div">
          <div className="gen-invoice">
            <div className="userform">
              <form onSubmit={receipientFormik.handleSubmit}>
                <div className="enter-details-div">
                  <div className="input-div">
                    <label htmlFor="name">Receipient Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      id="name"
                      name="name"
                      value={receipientFormik.values.name}
                      onChange={receipientFormik.handleChange}
                    />
                    {receipientFormik.errors && (
                      <small className="error-section">
                        {receipientFormik.errors.name}
                      </small>
                    )}
                  </div>
                  <div className="input-div">
                    <label htmlFor="additional">Additional Information</label>
                    <input
                      type="text"
                      placeholder="Info / Phone number"
                      id="additional"
                      name="additional"
                      value={receipientFormik.values.additional}
                      onChange={receipientFormik.handleChange}
                    />
                    {receipientFormik.errors && (
                      <small className="error-section">
                        {receipientFormik.errors.additional}
                      </small>
                    )}
                  </div>
                </div>
                <div className="add-div">
                  <button type="submit" className="mx-1">
                    <p>Save Invoice</p>
                  </button>
                </div>
              </form>
            </div>
            <div className="inv-actions">
              <div className="newCalc">
                <div className="act-button">
                  <button onClick={newInvoice} disabled={editMode}>
                    <p>New</p>
                    <img src={addIcn} alt="Add new" />
                  </button>
                </div>
                <div className="act-button relative">
                  <div className={`${change ? "ping-group" : "hidden"}`}>
                    <span className="ping"></span>
                    <span className="ping-item"></span>
                  </div>
                  <button onClick={(e) => calculate(e)}>
                    <img src={calcIcn} alt="calculate" />
                  </button>
                </div>
              </div>
            </div>
            <div className="dynamic">
              {itemGroup.map((group, index) => (
                <div className="inv-item" key={index}>
                  {/* <select
                  className="custom-select"
                  value={group.itemName}
                  id={`i-select${index}`}
                  name="itemName"
                  onChange={(e) => changeItem(index, e)}
                >
                  {allitems.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
                  <div className="dropdown-container" key={index}>
                    <input
                      type="text"
                      id={`dropdown-input${index}`}
                      className="dropdown-input"
                      name="itemName"
                      value={group.itemName}
                      placeholder="Search..."
                      onChange={(e) => handleSearch(index, e)}
                      onBlur={handleBlur}
                    />
                    {showDropdown && index === showIndex && (
                      <div className="dropdown-items">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              name="itemName"
                              key={item.id}
                              className="dropdown-item"
                              onMouseDown={() => handleSelect(index, item)}
                            >
                              {item.name}
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-item">No items found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="input-div w-[100px]">
                    <label htmlFor={`price${index}`}>Price</label>
                    <input
                      id={`price${index}`}
                      type="number"
                      value={group.selling_price}
                      name="selling_price"
                      onChange={(e) => changeItem(index, e)}
                    />
                  </div>
                  <div className="input-div w-[100px]">
                    <label htmlFor={`qnt${index}`}>Quantity</label>
                    <input
                      id={`qnt${index}`}
                      type="number"
                      value={group.qnt}
                      name="qnt"
                      onChange={(e) => changeItem(index, e)}
                    />
                  </div>
                  <div
                    className={`${
                      itemGroup.length === 1 ? "hidden" : "remove-div"
                    }`}
                    onClick={() => removeItem(index)}
                  >
                    <img src={removeIcn} alt="remove" />
                  </div>
                </div>
              ))}
              <div className="add-div">
                <button onClick={addNewGroup}>
                  <img src={addIcn} alt="Add Item" />
                </button>
              </div>
            </div>
          </div>
          <div className="pdf-div">
            <div className="calc-div">
              <DashItem
                img={moneyIcn}
                title={"Total (GHC)"}
                value={formatMoney(totalAmount)}
              />
            </div>
            <div className="all-invoice-div">
              {/* this is a portion for tommorrow */}
              <div className="input-div">
                <input
                  type="text"
                  placeholder="Search..."
                  name="searchInvoice"
                  value={searchInv}
                  onChange={(e) => handleSearchChange(e)}
                />
              </div>
              <div className="inv-list-div">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((item, index) => (
                    <div className="inv-item-div" key={index}>
                      <div className="inv-group">
                        <p className="inv-inf">
                          <span className="labl">No#. </span>
                          {item.id}
                        </p>
                        <div
                          className={`paid-unpaid ${
                            item.paid ? "paid-div" : "unpaid-div"
                          }`}
                        >
                          <p>{item.paid ? "Paid" : "Unpaid"}</p>
                        </div>
                      </div>
                      <div className="inv-group">
                        <p className="inv-inf font-mono">{item.name}</p>
                      </div>
                      <div className="inv-group">
                        <p className="dnt">{`${item.date_of} __ ${item.timeOnly}`}</p>
                        {/* where the popup is clicked */}
                        <div
                          className="pop-click"
                          onClick={() => showSelectedPopup(index)}
                        >
                          <img
                            src={arrowIcn}
                            alt="invoice actions"
                            className={`${
                              showPopup && selectedInv === index
                                ? "rotate-icon"
                                : ""
                            }`}
                          />
                        </div>
                        <div
                          className={`${
                            showPopup && selectedInv === index
                              ? "inv-l-actions"
                              : "hidden"
                          }`}
                          tabIndex={0}
                          onBlur={invPopupOnBlur}
                        >
                          <button
                            disabled={item.paid || loading.actionLoading}
                            onClick={(e) => deleteInvoice(e, item.id)}
                          >
                            <p>Remove Invoice</p>
                          </button>
                          <button
                            disabled={item.paid || loading.actionLoading}
                            onClick={() => makeInvoicePayment(item)}
                          >
                            <p>Make Purchase</p>
                            {loading.actionLoading && <Loading />}
                          </button>
                          <button
                            disabled={loading.actionLoading}
                            onClick={() => generatePDF(item)}
                          >
                            <p>View Invoice</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="noItems">No Invoice Found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Invoice;
