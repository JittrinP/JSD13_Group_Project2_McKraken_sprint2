import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage/HomePage";
import ProductsPage from "./pages/Products/ProductsPage";
import ShopBlogPage from "./pages/ShopBlogPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CustomerDashboardPage from "./pages/customer_dashboard/CustomerDashboardPage";

// children ของ AdminDashboardPage
import AdminDashboardPage from "./pages/admin_dashboard/AdminDashboardPage";
import Overview from "./pages/admin_dashboard/_components/Overview";
import ProductEdit from "./pages/admin_dashboard/_components/ProductEdit";
import OrderList from "./pages/admin_dashboard/_components/OrderList";
import ContentEdit from "./pages/admin_dashboard/_components/ContentEdit";

// children ของ CustomerDashboardPage (render ผ่าน <Outlet /> ทางฝั่งขวา)
import CustomerAccount from "./pages/customer_dashboard/_components/CustomerAccount";
import PurchasesItems from "./pages/customer_dashboard/_components/PurchasesItems";
import CustomList from "./pages/customer_dashboard/_components/CustomList";
import CustomerAddress from "./pages/customer_dashboard/_components/CustomerAddress";
import CustomerFav from "./pages/customer_dashboard/_components/CustomerFav";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/shopblog", element: <ShopBlogPage /> },
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
      {
        path: "/admindashboard", element: <AdminDashboardPage />,
        children: [
          { path: "overview", element: <Overview /> },
          { path: "product-edit", element: <ProductEdit /> },
          { path: "order-list", element: <OrderList /> },
          { path: "content-edit", element: <ContentEdit /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
