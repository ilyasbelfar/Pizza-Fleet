import { Indicator } from "@mantine/core";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BagButton from "./BagButton";

const BagButtonWrapper = () => {
  // eslint-disable-next-line no-unused-vars
  const { loggedIn } = useSelector((state) => state.auth);
  const { numberOfCartItems } = useSelector((state) => state.cart);
  const isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));
  return (
    <Indicator
      color="red"
      label={isAuthenticated && numberOfCartItems > 0 ? numberOfCartItems : 0}
      inline
      dot
      processing
      size={20}
    >
      <Link to="/cart">
        <BagButton />
      </Link>
    </Indicator>
  );
};

export default BagButtonWrapper;
