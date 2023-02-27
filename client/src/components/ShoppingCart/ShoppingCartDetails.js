import {
  Group,
  Grid,
  LoadingOverlay,
  Paper,
  Table,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../CartItem";
import { clearCart } from "../../redux/slices/cartSlice";
import { useEffect } from "react";

const useStyles = createStyles((theme) => ({
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

const ShoppingCartDetails = ({ cart }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { updateCart } = useSelector((state) => state.cart);
  const { removeFromCart } = useSelector((state) => state.cart);

  useEffect(() => {
    return () => {
      dispatch(clearCart());
    };
  }, [dispatch]);

  return (
    <Grid.Col sm={8}>
      <Paper
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
        })}
        shadow="xs"
        radius="md"
        p="md"
        withBorder
      >
        <Title className={classes.paperTitle} order={3}>
          Shopping Cart
        </Title>
        <div
          style={{
            overflowX: "auto",
          }}
          className="responsive-table"
        >
          <Table>
            <thead>
              <tr className={classes.tableRow}>
                <th className={classes.tableHead}>Product Details</th>
                <th className={classes.tableHead}>Price</th>
                <th className={classes.tableHead}>Quantity</th>
                <th className={classes.tableHead}>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{ position: "relative" }}>
              <LoadingOverlay
                visible={updateCart.loading || removeFromCart.loading}
                overlayBlur={2}
              />
              {cart.cartItems.map((item) => (
                <CartItem key={item._id} cart={cart._id} item={item} />
              ))}
            </tbody>
          </Table>
        </div>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <Group spacing="xs" sx={{ marginTop: 32 }}>
            <FaLongArrowAltLeft size={18} />
            <Text>Continue Shopping</Text>
          </Group>
        </Link>
      </Paper>
    </Grid.Col>
  );
};

export default ShoppingCartDetails;
