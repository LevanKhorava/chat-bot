import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import CheckoutPage from "../pages/CheckoutPage";

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/checkout", element: <CheckoutPage /> },
    ],
  },
];
