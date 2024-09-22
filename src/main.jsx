import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Statistics from "./components/Statistics.jsx";
import Invoice from "./components/Invoice.jsx";
import New from "./components/New.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import { AuthProvider } from "./AuthProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import InvoicePDFViewer from "./components/InvoicePDFViewer.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute requiredPermission="home">
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute requiredPermission="home">
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/statistics",
    element: (
      <ProtectedRoute requiredPermission="stats">
        <Statistics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/invoice",
    element: (
      <ProtectedRoute requiredPermission="invoice">
        <Invoice />
      </ProtectedRoute>
    ),
  },
  {
    path: "/new/*",
    element: (
      <ProtectedRoute requiredPermission="new">
        <New />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredPermission="dashboard">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/view-invoice",
    element: <InvoicePDFViewer />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ToastContainer
      position="top-right"
      theme="dark"
      closeOnClick
      autoClose={2000}
      className="toast-container"
      toastClassName="toast-item"
    />
  </React.StrictMode>
);
