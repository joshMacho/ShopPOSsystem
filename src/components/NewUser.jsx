import { useEffect, useRef, useState } from "react";
import "../styles/newuser.css";
import { useFormik } from "formik";
import { userValidations } from "./validations";
import IdentityType from "./IdentityType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "./Constants";
import axios from "axios";
import arrow from "../assets/icons/arrow.png";
import Loading from "./Loading";

function NewUser() {
  const [isEdit, setIsEdit] = useState(false);
  const [alltypes, setAlltypes] = useState([]);
  const [allusers, setAllusers] = useState([]);
  const [loading, setLoading] = useState({
    submitLoad: false,
  });
  const [userOptions, setUserOptions] = useState("");
  const [user, setuser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    id_type: "",
    id_number: "",
    mobile_number: "",
    username: "",
    password: "",
    repassword: "",
  });
  const popupRef = useRef(null);

  useEffect(() => {
    fetchIds();
    fetchUsers();
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
    initialValues: user,
    validationSchema: userValidations,
    onSubmit: (values) => {
      isEdit ? updateUser(values, resetForm) : submitUser(values, resetForm);
    },
  });

  const submitUser = async (values, resetForm) => {
    setLoading((prevState) => ({ ...prevState, submitLoad: true }));
    await axios
      .post(`${apiUrl}/addnewuser`, values)
      .then((response) => {
        toast.success(response.data.message);
        resetForm();
        fetchUsers();
        setLoading((prevState) => ({ ...prevState, submitLoad: false }));
      })
      .catch((error) => {
        setLoading((prevState) => ({ ...prevState, submitLoad: false }));
        toast.error(`Unable to add user\n${error.mesage}`);
        console.log(error);
      });
  };

  const updateUser = async (values, resetForm) => {
    setLoading((prevState) => ({ ...prevState, submitLoad: true }));
    await axios
      .put(`${apiUrl}/updateuser`, values)
      .then((response) => {
        console.log("we are here");
        toast.success(response.data.message);
        setIsEdit(false);
        resetForm();
        fetchUsers();
        setLoading((prevState) => ({ ...prevState, submitLoad: false }));
      })
      .catch((error) => {
        setLoading((prevState) => ({ ...prevState, submitLoad: false }));
        toast.error(`Unable to add user\n${error.mesage}`);
        console.log(error);
      });
  };

  const fetchIds = async () => {
    await axios
      .get(`${apiUrl}/allidtypes`)
      .then((response) => {
        setAlltypes(response.data);
      })
      .catch((error) => {
        toast.error("Unable to fetch Id types");
      });
  };

  const fetchUsers = async () => {
    await axios
      .get(`${apiUrl}/getallusers`)
      .then((response) => {
        setAllusers(response.data);
      })
      .catch((error) => {
        toast.error(`Unable to load users\n ${error.message}`);
        console.log(error);
      });
  };

  const editUser = async (id) => {
    await axios
      .get(`${apiUrl}/getuser/${id}`)
      .then((response) => {
        setValues({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id_type: response.data.id_type,
          id_number: response.data.id_number,
          mobile_number: response.data.mobile_number,
          username: response.data.username,
          password: response.data.password,
          repassword: response.data.password,
        });
        setIsEdit(true);
      })
      .catch((error) => {
        toast.error(`Unable to retrieve user info.\n${error.message}`);
        console.log(error);
      });
  };

  // activate user
  const actdeact = async (id) => {
    await axios
      .put(`${apiUrl}/activateuser/${id}`)
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(`Unable to perform action\n${error.message}`);
      });
  };

  //delete user
  const deleteuser = async (id) => {
    await axios
      .delete(`${apiUrl}/removeuser/${id}`)
      .then((response) => {
        toast.success(response.message);
        fetchUsers();
      })
      .catch((error) => {
        toast.error(`Unable to remove user ${error.message}`);
      });
  };

  const selectChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // show options
  const showActions = (id) => {
    userOptions === id ? setUserOptions("") : setUserOptions(id);
  };

  // cancel edit
  const cancelEdit = () => {
    resetForm();
    setIsEdit(false);
  };

  return (
    <div className="user-page">
      <div className="new-user-form">
        <form className="entrys" onSubmit={handleSubmit}>
          <div
            className={`${isEdit ? "close" : "hidden"}`}
            onClick={cancelEdit}
          >
            <p>Cancel</p>
          </div>
          <div className="input-div">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.firstName && (
              <small className="error-section">{errors.firstName}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.lastName && (
              <small className="error-section">{errors.lastName}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="id_select">Select ID Type:</label>
            <select
              id="id_select"
              name="id_type"
              value={values.id_type}
              onChange={selectChange}
            >
              <option></option>
              {alltypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.id_type}
                </option>
              ))}
            </select>
          </div>
          <div className="input-div">
            <label htmlFor="id_number">Identity Card Number</label>
            <input
              type="text"
              id="id_number"
              name="id_number"
              value={values.id_number}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.id_number && (
              <small className="error-section">{errors.id_number}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="mobile_number">Phone Number</label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              value={values.mobile_number}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.mobile_number && (
              <small className="error-section">{errors.mobile_number}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.username && (
              <small className="error-section">{errors.username}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              readOnly={isEdit}
            />
            {errors.password && (
              <small className="error-section">{errors.password}</small>
            )}
          </div>
          <div className="input-div">
            <label htmlFor="repassword">Re-Enter Password</label>
            <input
              type="password"
              id="repassword"
              name="repassword"
              value={values.repassword}
              onBlur={handleBlur}
              onChange={handleChange}
              readOnly={isEdit}
            />
            {errors.repassword && (
              <small className="error-section">{errors.repassword}</small>
            )}
          </div>
          <div className="sub-div">
            <button type="submit" disabled={loading.submitLoad}>
              <p>{isEdit ? "Update Sales Person" : "Add Sales Person"}</p>
              {loading.submitLoad ? <Loading /> : ""}
            </button>
          </div>
          <div></div>
        </form>
      </div>
      <div className="userList">
        <p>All Users</p>
        <div className="user-members">
          {allusers.map((user) => (
            <div className="member border" key={user.id}>
              <div className="m-info">
                <p className="m-name">{`${user.lastName}, ${user.firstName}`}</p>
                <p className="m-id">{user.id_number}</p>
                <div className="phonedate">
                  <p>{`Tel: ${user.mobile_number}`}</p>
                  <p>{`Added On: ${user.date_of.split("T")[0]}`}</p>
                </div>
              </div>
              <div className="action" onClick={() => showActions(user.id)}>
                <img src={arrow} alt="more" />
              </div>
              <div
                ref={popupRef}
                className={`${
                  userOptions === user.id ? "opt-actions" : "hidden"
                }`}
              >
                <button onClick={() => actdeact(user.id)}>
                  <p>{user.isActive ? "Deactivate" : "Activate"}</p>
                </button>
                <button onClick={() => editUser(user.id)}>
                  <p>Edit</p>
                </button>
                <button onClick={() => deleteuser(user.id)}>
                  <p>Remove</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="identity">
        <IdentityType />
      </div>
    </div>
  );
}
export default NewUser;
