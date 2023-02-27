import { Container, createStyles, Grid } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  clearApplyCoupon,
  getCartItems,
} from "../redux/slices/cartSlice";
import { showNotification } from "@mantine/notifications";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import {
  clearUpdateCart,
  clearRemoveFromCart,
} from "../redux/slices/cartSlice";
import SkeletonCart from "../components/Skeletons/SkeletonCart";
import ShoppingCartDetails from "../components/ShoppingCart/ShoppingCartDetails";
import OrderSummary from "../components/ShoppingCart/OrderSummary";
import EmptyCart from "../components/ShoppingCart/EmptyCart";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
    textAlign: "center",
  },
  paperTitle: {
    fontFamily: theme.fontFamily,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[7]
    }`,
  },
  tableRow: {
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  },
  tableHead: {
    whiteSpace: "nowrap",
    textAlign: "center !important",
  },
}));

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const { cart, isGettingCart } = useSelector((state) => state.cart);
  const { updateCart } = useSelector((state) => state.cart);
  const { removeFromCart } = useSelector((state) => state.cart);
  const { applyCoupon: applyCouponState } = useSelector((state) => state.cart);
  const { classes } = useStyles();

  useMemo(() => {
    document.title = "Cart | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  useEffect(() => {
    dispatch(getCartItems());
    return () => {
      dispatch(clearCart());
      dispatch(clearUpdateCart());
      dispatch(clearRemoveFromCart());
      dispatch(clearApplyCoupon());
    };
  }, [dispatch]);

  let subTotal = 0;
  if (cart && Object?.entries(cart)?.length > 0) {
    cart?.cartItems?.map((item) => {
      subTotal += item.pizza.price * item.quantity;
      return subTotal;
    });
  }

  if (updateCart.success) {
    showNotification({
      autoClose: 3000,
      title: "Success",
      message: updateCart.message,
      icon: <IoCheckmarkOutline size={20} />,
      color: "green",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  if (updateCart.error) {
    showNotification({
      autoClose: 3000,
      title: "Error",
      message: updateCart.message,
      icon: <IoCloseOutline size={20} />,
      color: "red",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  if (removeFromCart.success) {
    showNotification({
      autoClose: 3000,
      title: "Success",
      message: removeFromCart.message,
      icon: <IoCheckmarkOutline size={20} />,
      color: "green",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  if (removeFromCart.error) {
    showNotification({
      autoClose: 3000,
      title: "Error",
      message: removeFromCart.message,
      icon: <IoCloseOutline size={20} />,
      color: "red",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  if (applyCouponState.success) {
    showNotification({
      autoClose: 3000,
      title: "Success",
      message: applyCouponState.message,
      icon: <IoCheckmarkOutline size={20} />,
      color: "green",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  if (applyCouponState.error) {
    showNotification({
      autoClose: 3000,
      title: "Error",
      message: applyCouponState.message,
      icon: <IoCloseOutline size={20} />,
      color: "red",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  return (
    <Container size="lg" className={classes.wrapper}>
      {isGettingCart && <SkeletonCart />}
      {!isGettingCart && cart && Object?.entries(cart)?.length === 0 && (
        <EmptyCart />
      )}
      {!isGettingCart &&
        cart &&
        Object?.entries(cart)?.length > 0 &&
        cart?.cartItems?.length > 0 && (
          <Grid>
            <ShoppingCartDetails cart={cart} />
            <OrderSummary subTotal={subTotal} cart={cart} />
          </Grid>
        )}
    </Container>
  );
};

export default ShoppingCart;
