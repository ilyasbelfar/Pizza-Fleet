import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Grid, Paper, Title, Card, Text, Group, Badge } from "@mantine/core";
import {
  getUserAddresses,
  clearUserAddresses,
} from "../../redux/slices/authSlice";
import SkeletonUserAddresses from "../Skeletons/SkeletonUserAddresses";

const UserAddresses = () => {
  const dispatch = useDispatch();
  const user = useOutletContext();
  const { userAddresses, getUserAddresses: getUserAddressesState } =
    useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserAddresses(user?._id));
    return () => {
      dispatch(clearUserAddresses());
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
      {getUserAddressesState?.loading && <SkeletonUserAddresses />}
      {!getUserAddressesState.loading && userAddresses?.length === 0 && (
        <Title
          order={3}
          sx={(theme) => ({
            fontFamily: theme.fontFamily,
          })}
        >
          You have no shipping addresses yet.
        </Title>
      )}
      {!getUserAddressesState?.loading && userAddresses?.length > 0 && (
        <>
          <Title
            order={3}
            sx={(theme) => ({
              fontFamily: theme.fontFamily,
            })}
          >
            Your Addresses
          </Title>
          <Grid py="lg">
            {userAddresses.map((address) => {
              return (
                <Grid.Col key={address?._id} xs={4}>
                  <Card
                    p="lg"
                    shadow="lg"
                    radius="md"
                    sx={(theme) => ({
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[7]
                          : "#f8f9fa",
                      borderWidth: 2,
                      borderStyle: "solid",
                      borderColor:
                        theme.colorScheme === "dark"
                          ? "transparent"
                          : "#f1f5f8",
                    })}
                  >
                    <Group mb="md" position="apart">
                      <Title
                        order={4}
                        sx={(theme) => ({
                          fontFamily: theme.fontFamily,
                        })}
                      >
                        {address?.firstName} {address?.lastName}
                      </Title>
                      {address?.isPrimary && (
                        <Badge
                          sx={(theme) => ({
                            color:
                              theme.colorScheme === "dark" ? "#fff" : "#000",
                          })}
                        >
                          Default
                        </Badge>
                      )}
                    </Group>
                    <Text>
                      {address?.streetAddress}, {address?.city},{address?.state}
                      , {address?.country}, {address?.zipCode}
                    </Text>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default UserAddresses;
