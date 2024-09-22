import "../styles/newuser.css";
import { useFormik } from "formik";
import { idValidations } from "./validations";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function IdentityType() {
  const [isEdit, setIsEdit] = useState(false);
  const [alltypes, setAlltypes] = useState([]);
  const [userid, setUserid] = useState({
    id: "",
    id_type: "",
  });

  useEffect(() => {
    fetchIdTypes();
  }, []);

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    resetForm,
  } = useFormik({
    initialValues: userid,
    validationSchema: idValidations,
    onSubmit: (values) => {
      isEdit ? updateIdentity(values) : submitIdentity(values, resetForm);
    },
  });

  const submitIdentity = async (values, resetForm) => {
    console.log("submitting");
    await axios
      .post(`${apiUrl}/addidtype`, values)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const fetchIdTypes = async () => {
    await axios
      .get(`${apiUrl}/allidtypes`)
      .then((response) => {
        setAlltypes(response.data);
      })
      .catch((error) => {
        toast.error("Unable to fetch Id types");
      });
  };

  const updateIdentity = async (values) => {
    await axios
      .put(`${apiUrl}/updateidentity`, values)
      .then((response) => {
        toast.success(response.data.message);
        fetchIdTypes();
      })
      .catch((error) => {
        toast.error("Unable to update ID type");
        console.log(error);
      });
  };

  const editMode = async (id) => {
    await axios
      .get(`${apiUrl}/getidentityID/${id}`)
      .then((response) => {
        setValues(response.data);
        setIsEdit(true);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const deleteIdenetity = async (id) => {
    await axios
      .delete(`${apiUrl}/deleteidentity/${id}`)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
        setIsEdit(false);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error.message);
      });
  };

  const cancelEdit = () => {
    resetForm();
    setIsEdit(false);
  };

  return (
    <div className="id-page">
      <form className="id-form" onSubmit={handleSubmit}>
        <div className={`${isEdit ? "close" : "hidden"}`} onClick={cancelEdit}>
          <p>Cancel</p>
        </div>
        <div className="input-div">
          <label htmlFor="idcat">ID Type</label>
          <input
            type="text"
            id="idcat"
            name="id_type"
            value={values.id_type}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.id_type && (
            <small className="error-section">{errors.id_type}</small>
          )}
        </div>
        <div className="sub-div">
          <button type="submit">
            <p>{isEdit ? "Update Identity" : "Add ID Type"}</p>
          </button>
        </div>
      </form>
      <div className="identity-lists">
        <p className="list-label">Type of Identities</p>
        <div className="id-lists">
          {alltypes.map((type) => (
            <div className="id-item" key={type.id}>
              <div className="id-name">
                <p>{type.id_type}</p>
              </div>
              <div className="id-actions">
                <p className="edit actlinks" onClick={() => editMode(type.id)}>
                  Edit
                </p>
                <p
                  className="delete actlinks"
                  onClick={() => deleteIdenetity(type.id)}
                >
                  Delete
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IdentityType;
