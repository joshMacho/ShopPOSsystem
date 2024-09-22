import { useState } from "react";
import "./App.css";
import "./styles/toastify-custom.css";
import Login from "./components/Login";
import NavigationBar from "./components/NavigationBar";
import Invoice from "./components/Invoice";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Statistics from "./components/Statistics";
import { ToastContainer } from "react-toastify";
import New from "./components/New";
import InvoicePDFViewer from "./components/InvoicePDFViewer";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthProvider";

function App() {
  return (
    <div className="root">
      <Login />
    </div>

    // <div className="root">
    //   <ToastContainer
    //     position="top-right"
    //     theme="dark"
    //     closeOnClick
    //     autoClose={2000}
    //     className="toast-container"
    //     toastClassName="toast-item"
    //   />
    //   <Router>
    //     <div className="main-top">
    //       <NavigationBar />
    //     </div>
    //     <div className="main-body">
    //       <Routes>
    //         <AuthProvider>
    //           <Route path="/login" Component={Login} />
    //         </AuthProvider>
    //         {/* <ProtectedRoute path="/home" component={Home} permission={"home"} /> */}
    //         <Route
    //           path="/protected"
    //           element={
    //             <ProtectedRoute>
    //               <Home permission="home" />
    //             </ProtectedRoute>
    //           }
    //         />
    //       </Routes>
    //     </div>
    //   </Router>
    // </div>
  );
}

export default App;

{
  /* <Route path="/" element={<Login />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/invoice" element={<Invoice />}></Route>
            <Route path="/statistics" element={<Statistics />}></Route>
            <Route path="/new/*" element={<New />}></Route>
            <Route path="/view-invoice" element={<InvoicePDFViewer />}></Route> */
}
