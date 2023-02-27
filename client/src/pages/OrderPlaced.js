import {
  Container,
  Group,
  Paper,
  Stack,
  Title,
  Text,
  Button,
} from "@mantine/core";
import { Link, Navigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../assets/lotties/thank-you-buddy.json";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { clearAddOrder } from "../redux/slices/orderSlice";

const OrderPlaced = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const { addOrder } = useSelector((state) => state.order);

  useMemo(() => {
    document.title = "Order Placed Successfully | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearAddOrder());
    };
  }, [dispatch]);

  return (
    <>
      {!addOrder.success && <Navigate to="/cart" />}
      <Container size="lg" p="lg">
        <Paper
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
            marginTop: 20,
          })}
          shadow="xs"
          radius="md"
          p="lg"
          withBorder
        >
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
            }}
            width={250}
            height={250}
            style={{
              marginTop: 16,
            }}
          />
          <Stack align="center">
            <Title my="md">Thank you for the purchase!</Title>
            <Text mb="md">
              Your order has been placed and will be processed as soon as
              possible.
            </Text>
            <Group mb="md" position="apart">
              <Link to="/">
                <Button variant="outline">Continue shopping</Button>
              </Link>
              <Link to={`/profile/${user?._id}/orders`}>
                <Button variant="outline">View your orders</Button>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default OrderPlaced;
