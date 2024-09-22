import { useState } from "react";
import "../styles/newitem.css";
import "../App.css";
import ItemList from "./ItemList";
import { useFormik } from "formik";
import { productValidation } from "./validations";
import { apiUrl } from "./Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewItem() {
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    description: "",
    barcode: "",
    cost_price: "",
    selling_price: "",
  });
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
      submitProduct(values, resetForm);
    },
  });

  const submitProduct = async (values, resetForm) => {
    await axios
      .post(`${apiUrl}/additem`, values)
      .then((response) => {
        toast.success(response.message);
        resetForm();
      })
      .catch((error) => {
        toast.error(`Unable to add product - ${error.message}`);
        console.log(error);
      });
  };

  return (
    <div className="main-item">
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="entrys">
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
          <button>
            <p>Add Product</p>
          </button>
        </div>
      </form>
      <div className="items-div">
        <ItemList />
      </div>
    </div>
  );
}
export default NewItem;
