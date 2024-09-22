import { useEffect, useState } from "react";
import "../styles/permission.css";
import "../styles/newuser.css";
import axios from "axios";
import { apiUrl } from "./Constants";
import Toggle from "./Toggle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const permit = [
  {
    name: "Dashboard",
    value: "dashboard",
  },
  {
    name: "Statistics",
    value: "stats",
  },
  {
    name: "Home",
    value: "home",
  },
  {
    name: "Invoice",
    value: "invoice",
  },
  {
    name: "Manage Users",
    value: "new_",
  },
];

function Permissions() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({
    dashboard: false,
    home: false,
    stats: false,
    invoice: false,
    new_: false,
  });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchPermission(selectedUser);
    } else {
      setPermissions({
        dashboard: false,
        home: false,
        stats: false,
        invoice: false,
        new_: false,
      });
    }
  }, [selectedUser]);

  // fetch permissions
  const fetchPermission = async (id) => {
    await axios
      .get(`${apiUrl}/getuserpermission/${id}`)
      .then((response) => {
        setPermissions({
          dashboard: response.data.dashboard,
          home: response.data.home,
          stats: response.data.stats,
          invoice: response.data.invoice,
          new_: response.data.new,
        });
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const fetchUsers = async () => {
    await axios
      .get(`${apiUrl}/getallusers`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        toast.error(`Unable to load users\n ${error.message}`);
        console.log(error);
      });
  };

  const clicked = (name) => {
    setPermissions((prevPermission) => ({
      ...prevPermission,
      [name]: !prevPermission[name],
    }));
  };

  // click to select user
  const selectUser = (id) => {
    selectedUser === id ? setSelectedUser(null) : setSelectedUser(id);
  };

  const updatePermission = async (id) => {
    await axios
      .post(`${apiUrl}/updatepermission/${id}`, permissions)
      .then((response) => {
        toast.success(response.data.message);
        setSelectedUser(null);
      })
      .catch((error) => {
        toast.error(`Unable to update, ${error.message}`);
        console.log(error);
      });
  };

  return (
    <div className="main-permit">
      <div className="body-p">
        <div className="users-d">
          <div className="user-lab">
            <p>All Users</p>
          </div>
          <div className="usr-list">
            {users.map((user) => (
              <div
                className={`member ${
                  selectedUser === user.id ? "seluser" : ""
                }`}
                key={user.id}
                onClick={() => selectUser(user.id)}
              >
                <div className="m-info">
                  <p className="m-name">{`${user.lastName}, ${user.firstName}`}</p>
                  <p className="m-id">{user.id_number}</p>
                  <div className="phonedate">
                    <p>{`Tel: ${user.mobile_number}`}</p>
                    <p>{`Added On: ${user.date_of.split("T")[0]}`}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="permissions-div">
          <div className="user-lab">
            <p>User Permissions</p>
          </div>
          <div className="tick-permission-div">
            {permit.map((priv, index) => (
              <div className="give-access" key={index}>
                <p className={`${permissions[priv.value] ? "sel" : "nosel"}`}>
                  {priv.name}
                </p>
                <Toggle
                  value={permissions[priv.value]}
                  clicked={() => clicked(priv.value)}
                />
              </div>
            ))}
            <div className="sub-div col-span-2">
              <button
                type="submit"
                disabled={selectedUser ? false : true}
                onClick={() => updatePermission(selectedUser)}
              >
                <p>Update Permissions</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Permissions;
