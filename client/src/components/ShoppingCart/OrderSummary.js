import {
  Grid,
  Paper,
  Title,
  Group,
  Text,
  Button,
  Input,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon } from "../../redux/slices/cartSlice";

const useStyles = createStyles((theme) => ({
  paperTitle: {
    fontFamily: theme.fontFamily,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[7]
    }`,
  },
}));

const OrderSummary = ({ subTotal, cart }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart.applyCoupon);

  const handleSubmit = (values) => {
    if (!form.isValid()) return;
    if (values.couponCode === "") return;
    dispatch(applyCoupon(values));
  };

  const form = useForm({
    initialValues: {
      couponCode: "",
    },
  });

  return (
    <Grid.Col sm={4}>
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
          Order Summary
        </Title>
        <Group position="apart">
          <Text>Subtotal</Text>
          <Text fz="sm" fw={700}>
            {subTotal}DA
          </Text>
        </Group>
        <Group position="apart">
          <Text>Shipping</Text>
          <Text fz="sm" fw={700}>
            {cart.shipping === 0 ? "Free" : `${cart.shipping}DA`}
          </Text>
        </Group>
        <Group position="apart">
          <Text>Discount</Text>
          <Text fz="sm" fw={700}>
            {cart?.discountedPrice === 0
              ? "- 0DA"
              : `- ${cart?.discountedPrice}DA`}
          </Text>
        </Group>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div
            style={{
              textAlign: "left",
              padding: `1.5rem 0`,
              borderBottom: `1px solid white`,
            }}
          >
            <Title
              sx={(theme) => ({
                marginBottom: 10,
                fontFamily: theme.fontFamily,
              })}
              order={4}
            >
              Apply coupon code
            </Title>
            <Input
              sx={{ marginBottom: 10 }}
              variant="filled"
              name="couponCode"
              placeholder="Enter your coupon code"
              {...form.getInputProps("couponCode")}
            />
            <Button loading={loading} type="submit" uppercase>
              Apply
            </Button>
          </div>
        </form>
        <Group sx={{ margin: "1rem 0" }} position="apart">
          <Text>Total To Pay</Text>
          <Text fz="sm" fw={700}>
            {cart.totalToPay}DA
          </Text>
        </Group>
        <Link
          to="/checkout"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Button fullWidth uppercase>
            proceed to checkout
          </Button>
        </Link>
      </Paper>
    </Grid.Col>
  );
};

export default OrderSummary;
