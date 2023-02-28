import { Container, Grid } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "../redux/slices/cartSlice";
import BillingDetails from "../components/Checkout/BillingDetails";
import OrderDetails from "../components/Checkout/OrderDetails";
import SkeletonUserCheckoutDetails from "../components/Skeletons/SkeletonUserCheckoutDetails";
import SkeletonOrderDetails from "../components/Skeletons/SkeletonOrderDetails";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isGettingCart } = useSelector((state) => state.cart);
  const { user, isRefreshingToken } = useSelector((state) => state.auth);
  const { addOrder } = useSelector((state) => state.order);
  const [mustSubmit, setMustSubmit] = useState(false);

  useMemo(() => {
    document.title = "Checkout | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  let subTotal = 0;
  if (cart && Object?.entries(cart)?.length > 0) {
    cart?.cartItems?.map((item) => {
      subTotal += item.pizza.price * item.quantity;
      return subTotal;
    });
  }

  useEffect(() => {
    if (addOrder.success) {
      navigate("/order-placed");
    }
  }, [addOrder.success, navigate]);

  return (
    <Container size="lg">
      <Grid my={15}>
        {isRefreshingToken && <SkeletonUserCheckoutDetails />}
        {!isRefreshingToken && (
          <BillingDetails
            user={user}
            onCheckoutFinish={() => setMustSubmit(false)}
            mustSubmit={mustSubmit}
          />
        )}
        {isGettingCart && <SkeletonOrderDetails />}
        {!isGettingCart && cart && Object?.entries(cart)?.length > 0 && (
          <OrderDetails
            cart={cart}
            subTotal={subTotal}
            isGettingCart={isGettingCart}
            onCheckout={() => setMustSubmit(true)}
          />
        )}
      </Grid>
    </Container>
  );
};

export default Checkout;
