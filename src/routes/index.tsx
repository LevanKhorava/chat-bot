import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/chat", element: <ChatPage /> },
    ],
  },
];
