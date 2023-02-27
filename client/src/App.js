import { MantineProvider } from "@mantine/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import UserInfo from "./components/Profile/UserInfo";
import UserOrders from "./components/Profile/UserOrders";
import UserAddresses from "./components/Profile/UserAddresses";
import OrderPlaced from "./pages/OrderPlaced";
import { useState } from "react";
import { useSelector } from "react-redux";

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));
  const isColorSchemeExists = Boolean(localStorage.getItem("colorScheme"));
  if (!isColorSchemeExists) {
    localStorage.setItem("colorScheme", "light");
  }
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("colorScheme") === "light" ? false : true
  );

  const colorScheme = isDarkMode ? "dark" : "light";

  const theme = {
    globalStyles: (theme) => ({
      body: {
        background: theme.colorScheme === "dark" ? "#0e1012" : "#e9e9ec",
      },
    }),
    colorScheme: colorScheme,
    fontFamily: "Golos Text, sans-serif",
    colors: {
      orange: [
        "#FF6347",
        "#DC143C",
        "#B22222",
        "#8B0000",
        "#FF0000",
        "#FFA500",
        "#FF8C00",
        "#FF7F50",
        "#FF4500",
        "#FF4500",
      ],
      dark: [
        "#d5d7e0",
        "#acaebf",
        "#8c8fa3",
        "#666980",
        "#1f2124",
        "#1f2124",
        "#292c2f",
        "#16181a",
        "#0e1012",
        "#16181a",
      ],
    },
    primaryColor: "orange",
  };
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <Router>
          <Header
            onToggleColorScheme={() => {
              if (localStorage.getItem("colorScheme") === "light") {
                localStorage.setItem("colorScheme", "dark");
                setIsDarkMode(true);
              } else {
                localStorage.setItem("colorScheme", "light");
                setIsDarkMode(false);
              }
            }}
          />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route
              path="/profile/:id"
              element={
                isAuthenticated ? (
                  <Profile />
                ) : (
                  <Navigate replace to="/auth/login" />
                )
              }
            >
              <Route path="info" element={<UserInfo />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="addresses" element={<UserAddresses />} />
            </Route>
            <Route
              path="/checkout"
              element={
                isAuthenticated ? (
                  <Checkout />
                ) : (
                  <Navigate replace to="/auth/login" />
                )
              }
            />
            <Route
              path="/auth/login"
              element={
                isAuthenticated ? <Navigate replace to="/" /> : <Login />
              }
            />
            <Route
              path="/auth/register"
              element={
                isAuthenticated ? <Navigate replace to="/" /> : <Register />
              }
            />
            <Route path="/order-placed" element={<OrderPlaced />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
          <Footer />
        </Router>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;
