import { Paper, Table, Title } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { getUserOrders, clearUserOrders } from "../../redux/slices/authSlice";
import OrderItem from "../OrderItem";
import SkeletonUserOrders from "../Skeletons/SkeletonUserOrders";

const UserOrders = () => {
  const user = useOutletContext();
  const { userOrders: orders, getUserOrders: getUserOrdersState } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOrders(user?._id));
    return () => {
      dispatch(clearUserOrders());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Paper
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          marginTop: 60,
        },
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
      })}
      my="md"
      shadow="xs"
      radius="md"
      p="lg"
      withBorder
    >
      {getUserOrdersState?.loading && <SkeletonUserOrders />}
      {!getUserOrdersState.loading && orders?.length === 0 && (
        <Title
          order={3}
          sx={(theme) => ({
            fontFamily: theme.fontFamily,
          })}
        >
          You have no orders yet.
        </Title>
      )}
      {!getUserOrdersState.loading && orders?.length > 0 && (
        <>
          <Title
            order={3}
            sx={(theme) => ({
              fontFamily: theme.fontFamily,
            })}
          >
            Your Orders
          </Title>
          <div
            style={{
              overflowX: "auto",
            }}
            className="responsive-table"
          >
            <Table verticalSpacing="md" striped highlightOnHover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Menu</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Show Details</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <OrderItem key={order._id} order={order} />
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </Paper>
  );
};

export default UserOrders;
