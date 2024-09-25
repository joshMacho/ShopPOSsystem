import { useEffect, useRef, useState } from "react";
import "../styles/newitem.css";
import "../App.css";
import { useFormik } from "formik";
import { productValidation } from "./validations";
import { apiUrl, formatMoney } from "./Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/itemlist.css";
import axios from "axios";
import arrowIcn from "../assets/icons/arrow.png";
import { ka } from "date-fns/locale";

function NewItem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pop, setPop] = useState({
    showPop: false,
    selectedProd: null,
  });
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    description: "",
    barcode: "",
    cost_price: "",
    selling_price: "",
  });
  const [edit, setEdit] = useState(false);
  const popRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popRef.current && !popRef.current.contains(event.target)) {
        setPop({ showPop: false, selectedProd: null });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popRef]);

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    resetForm,
  } = useFormik({
    initialValues: productDetails,
    validationSchema: productValidation,
    onSubmit: (values) => {
      edit
        ? updateProduct(values, resetForm)
        : submitProduct(values, resetForm);
    },
  });

  const submitProduct = async (values, resetForm) => {
    await axios
      .post(`${apiUrl}/additem`, values)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
        fetchItems();
      })
      .catch((error) => {
        toast.error(`Unable to add product - ${error.message}`);
        console.log(error);
      });
  };

  const updateProduct = async (values, resetForm) => {
    await axios
      .post(`${apiUrl}/updateproduct`, values)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
        fetchItems();
        setEdit(false);
      })
      .catch((error) => {
        toast.error(error.response.data.errorMessage);
        console.log(error);
      });
  };

  const fetchItems = async () => {
    setLoading(true);
    await axios
      .get(`${apiUrl}/getallitems`)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`Unable to load Products - ${error.message}`);
        console.log(error);
      });
  };

  // delete product
  const deleteProduct = async (id, name) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${name} from products?`
    );
    if (!confirm) {
      return;
    }

    await axios
      .delete(`${apiUrl}/deleteproduct/${id}`)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
        setEdit(false);
        fetchItems();
      })
      .catch((error) => {
        toast.error(error.response.data.errorMessage);
        console.log(error);
      });
  };

  const showPopup = (id) => {
    pop.selectedProd === id
      ? setPop((prevState) => ({
          ...prevState,
          selectedProd: null,
          showPop: false,
        }))
      : setPop((prevState) => ({
          ...prevState,
          selectedProd: id,
          showPop: true,
        }));
  };

  const setUpdate = (product) => {
    setEdit(true);
    setValues(product);
  };

  // cancel edit
  const cancelEdit = () => {
    resetForm();
    setEdit(false);
  };

  return (
    <div className="main-item">
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="entrys">
          <div className={`${edit ? "close" : "hidden"}`} onClick={cancelEdit}>
            <p>Cancel</p>
          </div>
          <div className="input-div">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.name && (
              <small className="error-section">{errors.name}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={values.description}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.description && (
              <small className="error-section">{errors.description}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="barcode">Barcode</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={values.barcode}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.barcode && (
              <small className="error-section">{errors.barcode}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="cost_price">Cost Price</label>
            <input
              type="text"
              id="cost_price"
              name="cost_price"
              value={values.cost_price}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.cost_price && (
              <small className="error-section">{errors.cost_price}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="selling_price">Selling Price</label>
            <input
              type="text"
              id="selling_price"
              name="selling_price"
              value={values.selling_price}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.selling_price && (
              <small className="error-section">{errors.selling_price}</small>
            )}
          </div>
        </div>
        <div className="sub-div">
          <button type="submit">
            <p>{edit ? "Update Product" : "Add Product"}</p>
          </button>
        </div>
      </form>
      <div className="items-div">
        <div className="main-itemlist">
          <div className="label-item">
            <p>All Products</p>
          </div>
          <div className="prod-div ">
            {items.map((product) => (
              <div
                className={`product-div ${loading && "animate-pulse"} ${
                  values.id === product.id ? "selected" : ""
                }`}
                key={product.id}
              >
                <div className="div-name">
                  <p>{product.name}</p>
                </div>
                <div className="div-describe">
                  <p>{product.description}</p>
                </div>
                <div className="div-prices">
                  <div className="price-div">
                    <p>{`GHC ${formatMoney(product.cost_price)}`}</p>
                  </div>
                  <div className="price-div">
                    <p>{`GHC ${formatMoney(product.selling_price)}`}</p>
                  </div>
                  <div
                    className="pop-click"
                    onClick={() => showPopup(product.id)}
                  >
                    <img src={arrowIcn} alt="popup icon" />
                  </div>
                </div>
                <div
                  className={`${
                    pop.showPop && pop.selectedProd === product.id
                      ? "popup-dropdown"
                      : "hidden"
                  }`}
                  onMouseDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                  ref={popRef}
                >
                  <button onClick={() => setUpdate(product)}>
                    <p>Update Details</p>
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id, product.name)}
                  >
                    <p>Delete Product</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default NewItem;
