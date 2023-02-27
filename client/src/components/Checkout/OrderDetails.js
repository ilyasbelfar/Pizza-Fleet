import {
  Grid,
  Paper,
  Group,
  Title,
  Text,
  Image,
  Divider,
  Button,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OrderDetails = ({ cart, subTotal, isGettingCart, onCheckout }) => {
  const { loading } = useSelector((state) => state.order.addOrder);
  return (
    <Grid.Col sm={4}>
      <Paper
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
        })}
        my="md"
        shadow="xs"
        radius="md"
        p="md"
        withBorder
      >
        <Group mb={10}>
          <Title
            sx={(theme) => ({
              fontFamily: theme.fontFamily,
              paddingBottom: 16,
              marginBottom: 16,
              borderBottom: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.gray[3]
                  : theme.colors.dark[7]
              }`,
            })}
            order={3}
          >
            Your Order
          </Title>
          <Link to="/cart" style={{ color: "inherit", textDecoration: "none" }}>
            <Text tt="uppercase" fz="xs">
              Edit Shopping Cart
            </Text>
          </Link>
        </Group>

        {!isGettingCart &&
          cart &&
          Object?.entries(cart)?.length > 0 &&
          cart?.cartItems?.length > 0 &&
          cart?.cartItems?.map((item) => (
            <Group key={item._id} mb="md" mt="md">
              <Image
                radius="md"
                src={item.pizza.image}
                width={100}
                height={100}
                withPlaceholder
              />
              <div style={{ width: "min-content", flexGrow: 1 }}>
                <Text lineClamp={4} component="h3">
                  {item.pizza.name}
                </Text>
                <Group position="apart">
                  <Group position="apart">
                    <Text fz="sm">{item.pizza.price}DA</Text>
                    <Text fz="sm">x{item.quantity}</Text>
                  </Group>
                  <Text fz="sm" fw={700}>
                    {item.subTotal}DA
                  </Text>
                </Group>
              </div>
            </Group>
          ))}
        <Divider my="sm" variant="dashed" />
        {!isGettingCart && cart && Object?.entries(cart)?.length > 0 && (
          <Group my={10} position="apart">
            <Text>Subtotal</Text>
            <Text fz="sm" fw={700}>
              DA{subTotal}
            </Text>
          </Group>
        )}
        {!isGettingCart && cart && Object?.entries(cart)?.length > 0 && (
          <Group my={10} position="apart">
            <Text>Shipping</Text>
            <Text fz="sm" fw={700}>
              {cart.shipping === 0 ? "Free" : `${cart.shipping}DA`}
            </Text>
          </Group>
        )}
        <Group my={10} position="apart">
          <Text>Discount</Text>
          <Text fz="sm" fw={700}>
            {cart?.discountedPrice === 0
              ? "- DA0"
              : `- DA${cart?.discountedPrice}`}
          </Text>
        </Group>
        {!isGettingCart && cart && Object?.entries(cart)?.length > 0 && (
          <Group my={10} position="apart">
            <Text>Total Cost</Text>
            <Text fz="sm" fw={700}>
              {cart.totalToPay}DA
            </Text>
          </Group>
        )}
        <Divider my="sm" variant="dashed" />
        <Button
          loading={loading}
          uppercase
          fullWidth
          radius="md"
          mt="xs"
          style={{ flex: 1 }}
          onClick={() => onCheckout()}
        >
          Place Your Order
        </Button>
      </Paper>
    </Grid.Col>
  );
};

export default OrderDetails;
