import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";

export const routes = [
  {
    element: <Layout />,
    children: [{ path: "/", element: <HomePage /> }],
  },
];
