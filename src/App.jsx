import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
// import ProductsPage from "./pages/ProductsPage";
//import ShopBlogPage from "./pages/ShopBlogPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
//import CustomerDashboardPage from "./pages/CustomerDashboardPage";
//import AdminDashboardPage from "./pages/AdminDashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      // { path: "/products", element: <ProductsPage /> },
      //{ path: "/shopblog", element: <ShopBlogPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      //{ path: "/customerdashboard", element: <CustomerDashboardPage /> },
      //{ path: "/admindashboard", element: <AdminDashboardPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
