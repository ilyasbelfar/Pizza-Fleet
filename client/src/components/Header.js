import {
  createStyles,
  Box,
  Button,
  Group,
  Header,
  Image,
  Burger,
  ActionIcon,
  Avatar,
  Text,
  Menu,
} from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { BsMoonStars } from "react-icons/bs";
import { TbSun } from "react-icons/tb";
import { IoChevronDown } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { refreshToken, logout } from "../redux/slices/authSlice";
import { getCartItemsNumber } from "../redux/slices/cartSlice";
import { HiOutlineUser } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import SkeletonHeader from "./Skeletons/SkeletonHeader";
import BagButtonWrapper from "./BagButton/BagButtonWrapper";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 999,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 10,
    width: 300,
    padding: theme.spacing.md,
    backgroundColor: theme.colorScheme === "dark" ? "#292c2f" : "#fff",
  },
  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const MainHeader = ({ onToggleColorScheme }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { user, isRefreshingToken } = useSelector((state) => state.auth);
  const loggedUser = Boolean(localStorage.getItem("isAuthenticated"));

  useMemo(() => {
    dispatch(refreshToken());
    dispatch(getCartItemsNumber());
    setInterval(() => {
      dispatch(refreshToken());
    }, 5 * 60 * 1000);
  }, [dispatch]);

  const [opened, { toggle, close }] = useDisclosure(false);

  useHotkeys([
    [
      "mod+J",
      (e) => {
        e.preventDefault(); // Prevents Chrome from opening the downloads panel when the Control and J keys are pressed together.
        onToggleColorScheme();
      },
    ],
  ]);

  return (
    <Box sx={{ position: "relative", zIndex: 999 }}>
      <Header
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? "#292c2f" : "#fff",
        })}
        height={60}
        px="md"
      >
        <Group position="apart" sx={{ height: "100%" }}>
          <Link to="/">
            <Image
              width={60}
              height={60}
              src="https://res.cloudinary.com/djuxwysbl/image/upload/v1677364239/PizzaDelivery/Pizza-WebApp-Logo_ohoqlg.png"
            />
          </Link>
          <Group>
            <Group>
              <ActionIcon
                sx={(theme) => ({
                  color: theme.colorScheme === "dark" ? "yellow" : "#3b5bdb",
                })}
                onClick={() => onToggleColorScheme()}
                size="lg"
              >
                {localStorage.getItem("colorScheme") === "dark" ? (
                  <TbSun size={18} />
                ) : (
                  <BsMoonStars size={18} />
                )}
              </ActionIcon>
              <BagButtonWrapper />
            </Group>
            <Group className={classes.hiddenMobile}>
              {!loggedUser && Object?.entries(user)?.length === 0 && (
                <>
                  <Link to="/auth/login">
                    <Button variant="default">Log in</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </Group>
            <Menu
              opened={opened}
              transition="pop-top-right"
              position="bottom-start"
              offset={10}
              transitionDuration={200}
            >
              {isRefreshingToken &&
                loggedUser &&
                Object?.entries(user)?.length === 0 && (
                  <Menu.Target>
                    <SkeletonHeader />
                  </Menu.Target>
                )}
              {!loggedUser && Object?.entries(user)?.length === 0 && (
                <Menu.Target>
                  <Burger
                    opened={opened}
                    onClick={toggle}
                    className={classes.hiddenDesktop}
                  />
                </Menu.Target>
              )}
              {!isRefreshingToken && Object?.entries(user)?.length > 0 && (
                <Menu.Target>
                  <Group
                    sx={{
                      cursor: "pointer",
                    }}
                    spacing={7}
                    onClick={toggle}
                  >
                    <Avatar
                      src={
                        user?.loginType === "google"
                          ? user?.google?.picture
                          : user?.loginType === "facebook"
                          ? user?.facebook?.picture
                          : user?.avatar?.url
                      }
                      radius="xl"
                      size={30}
                    />
                    <Text
                      className={classes.hiddenMobile}
                      weight={500}
                      size="sm"
                      sx={{ lineHeight: 1 }}
                      mr={3}
                    >
                      {user?.loginType === "google"
                        ? user?.google?.name
                        : user?.loginType === "facebook"
                        ? user?.facebook?.name
                        : `${user?.firstName} ${user?.lastName}`}
                    </Text>
                    <IoChevronDown size={12} />
                  </Group>
                </Menu.Target>
              )}

              {!loggedUser && Object?.entries(user)?.length === 0 && (
                <Menu.Dropdown py="md">
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    to="/auth/login"
                    onClick={() => close()}
                  >
                    <Menu.Item>
                      <Button variant="default">Log In</Button>
                    </Menu.Item>
                  </Link>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    to="/auth/register"
                    onClick={() => close()}
                  >
                    <Menu.Item>
                      <Button>Register</Button>
                    </Menu.Item>
                  </Link>
                </Menu.Dropdown>
              )}
              {!isRefreshingToken && Object?.entries(user)?.length > 0 && (
                <Menu.Dropdown py="md">
                  <Menu.Label>User Profile</Menu.Label>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    to={`/profile/${user?._id}`}
                    onClick={() => close()}
                  >
                    <Menu.Item icon={<HiOutlineUser />}>Profile</Menu.Item>
                  </Link>
                  <Menu.Label>Danger Zone</Menu.Label>
                  <Menu.Item
                    onClick={() => {
                      close();
                      dispatch(logout());
                    }}
                    icon={<IoIosLogOut />}
                    color="red"
                  >
                    Log Out
                  </Menu.Item>
                </Menu.Dropdown>
              )}
            </Menu>
          </Group>
        </Group>
      </Header>
    </Box>
  );
};

export default MainHeader;
