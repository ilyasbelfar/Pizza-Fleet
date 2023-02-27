import { Navbar, Text, createStyles } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { BsGeoAlt } from "react-icons/bs";

const useStyles = createStyles((theme) => ({
  navbarItem: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: 14,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      [`& [class*="icon"]`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },
  navbarItemIcon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },
}));

const ProfileNavbar = ({ opened, onClosing }) => {
  const { classes } = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Navbar
      p="md"
      sx={(theme) => ({
        height: "100%",
        [theme.fn.largerThan("sm")]: {
          top: scroll.y > 60 ? 0 : 60 - scroll.y,
        },
        [theme.fn.smallerThan("sm")]: {
          top: scroll.y > 60 ? 40 : 100 - scroll.y,
        },
      })}
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section>
        <Link
          to="info"
          className={classes.navbarItem}
          onClick={() => onClosing()}
        >
          <HiOutlineUserCircle
            className={`${classes.navbarItemIcon} icon`}
            size={20}
          />
          <Text>User Info</Text>
        </Link>
        <Link
          to="orders"
          className={classes.navbarItem}
          onClick={() => onClosing()}
        >
          <TfiShoppingCartFull
            className={`${classes.navbarItemIcon} icon`}
            size={20}
          />
          <Text>My Orders</Text>
        </Link>
        <Link
          to="addresses"
          className={classes.navbarItem}
          onClick={() => onClosing()}
        >
          <BsGeoAlt className={`${classes.navbarItemIcon} icon`} size={20} />
          <Text>Shipping Addresses</Text>
        </Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default ProfileNavbar;
