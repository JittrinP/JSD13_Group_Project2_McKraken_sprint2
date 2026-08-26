import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
//import Products from "./pages/Products";
//import ShopBlog from "./pages/ShopBlog";
import Cart from "./pages/Cart";
//import Checkout from "./pages/Checkout";
//import CustomerDashboard from "./pages/CustomerDashboard";
//import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      //{ path: "/products", element: <Products /> },
      //{ path: "/shopblog", element: <ShopBlog /> },
      { path: "/cart", element: <Cart /> },
      //{ path: "/checkout", element: <Checkout /> },
      //{ path: "/customerdashboard", element: <CustomerDashboard /> },
      //{ path: "/admindashboard", element: <AdminDashboard /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
