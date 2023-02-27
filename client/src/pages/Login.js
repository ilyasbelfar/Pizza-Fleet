import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Divider,
  Group,
  Notification,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { Link } from "react-router-dom";
import { FacebookIcon, GoogleIcon } from "../components/SocialIcons";
import { useDispatch, useSelector } from "react-redux";
import { login, clearLogin } from "../redux/slices/authSlice";
import { IoCloseOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useEffect, useMemo } from "react";
import Cookies from "js-cookie";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: `100vh`,
    backgroundSize: "cover",
    backgroundImage:
      "url(https://res.cloudinary.com/djuxwysbl/image/upload/v1674759607/PizzaDelivery/pizza-bg_e3xe7p.jpg)",
    "&:before": {
      position: "absolute",
      content: "''",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(to left top, rgb(203 80 21 / 45%) 0%, rgb(203 105 21 / 45%) 100%)`,
    },
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: `100vh`,
    maxWidth: `50%`,
    paddingTop: 80,
    position: "relative",
    zIndex: 99,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  redirecter: {
    textDecoration: "none",
    fontWeight: 700,
    color: theme.colors.orange,
  },
}));

const Login = () => {
  const { loading, error, success, message } = useSelector(
    (state) => state.auth.login
  );
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const oAuthMessage = Cookies.get("info");

  useMemo(() => {
    document.title = "Login | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  useEffect(() => {
    if (success) {
      dispatch(clearLogin());
    }
    return () => {
      dispatch(clearLogin());
    };
  }, [dispatch, success]);

  const handleSubmit = (values) => {
    if (!form.isValid()) return;
    dispatch(login(values));
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      email: isEmail("Invalid E-mail!"),
      password: hasLength(
        { min: 6, max: 16 },
        "Password must be 6-16 characters long!"
      ),
    },
    validateInputOnBlur: true,
  });

  return (
    <div className={classes.wrapper}>
      <Paper
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? "#0e1012" : "#e9e9ec",
        })}
        className={classes.form}
        radius={0}
        p={30}
      >
        <Title
          order={3}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome back to Pizza Delivery!
        </Title>
        {error && (
          <Notification
            disallowClose
            color="red"
            title="Error"
            sx={{
              borderColor: "red",
            }}
            styles={{ title: { fontSize: 16 }, description: { fontSize: 14 } }}
            icon={<IoCloseOutline size={20} />}
            mb="sm"
          >
            {message}
          </Notification>
        )}
        {success && (
          <Notification
            disallowClose
            color="green"
            title="Success"
            sx={{
              borderColor: "green",
            }}
            styles={{ title: { fontSize: 16 }, description: { fontSize: 14 } }}
            icon={<IoCheckmarkOutline size={20} />}
            mb="sm"
          >
            {message}
          </Notification>
        )}
        {loading && (
          <Notification
            disallowClose
            loading
            styles={{ title: { fontSize: 16 }, description: { fontSize: 14 } }}
            mb="sm"
          >
            {message}
          </Notification>
        )}
        {oAuthMessage && oAuthMessage?.length > 0 && (
          <Notification
            color="red"
            title="Error"
            sx={{
              borderColor: "red",
            }}
            styles={{ title: { fontSize: 16 }, description: { fontSize: 14 } }}
            icon={<IoCloseOutline size={20} />}
            mb="sm"
          >
            {oAuthMessage}
          </Notification>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Email address"
            name="email"
            placeholder="someone@example.com"
            disabled={loading}
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            name="password"
            placeholder="**********"
            disabled={loading}
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Checkbox
            label="Keep me logged in"
            name="rememberMe"
            disabled={loading}
            mt="xl"
            size="md"
          />
          <Button type="submit" fullWidth mt="xl" size="md" loading={loading}>
            Login
          </Button>
        </form>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Link className={classes.redirecter} to="/auth/register">
            Register
          </Link>
        </Text>
        <Divider
          label="Or continue with social media"
          labelPosition="center"
          my="lg"
        />
        <Group grow mb="md" mt="md">
          <Button
            onClick={() =>
              window.open("http://localhost:5000/auth/facebook", "_self")
            }
            leftIcon={<FacebookIcon />}
            variant="default"
            color="gray"
          >
            Facebook
          </Button>
          <Button
            onClick={() =>
              window.open("http://localhost:5000/auth/google", "_self")
            }
            leftIcon={<GoogleIcon />}
            variant="default"
            color="gray"
          >
            Google
          </Button>
        </Group>
      </Paper>
    </div>
  );
};

export default Login;
