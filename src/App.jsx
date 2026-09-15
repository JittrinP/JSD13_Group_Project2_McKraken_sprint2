import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage/HomePage";
import ProductsPage from "./pages/Products/ProductsPage";
//import ShopBlogPage from "./pages/ShopBlogPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CustomerDashboardPage from "./pages/customer_dashboard/CustomerDashboardPage";
//import AdminDashboardPage from "./pages/AdminDashboardPage";

// --- children ของ CustomerDashboardPage (render ผ่าน <Outlet />) ---
import CustomerAccount from "./pages/customer_dashboard/_components/CustomerAccount";
import PurchasesItems from "./pages/customer_dashboard/_components/PurchasesItems";
import CustomList from "./pages/customer_dashboard/_components/CustomList";
import CustomerAddress from "./pages/customer_dashboard/_components/CustomerAddress";
import CustomerFav from "./pages/customer_dashboard/_components/CustomerFav";
// ------------------------------------------------------------------

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      // { path: "/shopblog", element: <ShopBlogPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/customerdashboard", element: <CustomerDashboardPage />,
        children: [
          { index: true, element: <Navigate to="account" replace /> },
          { path: "account", element: <CustomerAccount /> },
          { path: "purchases", element: <PurchasesItems /> },
          { path: "bouquet", element: <CustomList /> },
          { path: "address", element: <CustomerAddress /> },
          { path: "favorite", element: <CustomerFav /> },
        ],
       },
      //{ path: "/admindashboard", element: <AdminDashboardPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
