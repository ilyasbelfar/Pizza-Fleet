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
import { FacebookIcon, GoogleIcon } from "../components/SocialIcons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearRegister, register } from "../redux/slices/authSlice";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { useEffect, useMemo } from "react";

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
      background: `linear-gradient(to left top, rgb(203 25 21 / 45%) 0%, rgb(237 59 55 / 45%) 100%)`,
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

const Register = () => {
  const { classes } = useStyles();
  const { loading, error, success, message } = useSelector(
    (state) => state.auth.register
  );
  const dispatch = useDispatch();

  useMemo(() => {
    document.title = "Register | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  useEffect(() => {
    if (success) {
      dispatch(clearRegister());
    }
    return () => {
      dispatch(clearRegister());
    };
  }, [dispatch, success]);

  const handleSubmit = (values) => {
    if (!form.isValid()) return;
    dispatch(register(values));
  };

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      firstName: (value) =>
        /^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]+)*$/.test(value)
          ? null
          : "Invalid first name!",
      lastName: (value) =>
        /^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]+)*$/.test(value)
          ? null
          : "Invalid last name!",
      username: (value) =>
        /^[A-Za-z][A-Za-z0-9_]{7,29}$/.test(value)
          ? null
          : "Username must start with a letter and must be 7-29 characters long!",
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
            color="indigo"
            loading
            sx={{
              borderColor: "indigo",
            }}
            styles={{ title: { fontSize: 16 }, description: { fontSize: 14 } }}
            mb="sm"
          >
            {message}
          </Notification>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="First Name"
            name="firstName"
            placeholder="John"
            disabled={loading}
            size="md"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            withAsterisk
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            disabled={loading}
            size="md"
            mt="md"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            withAsterisk
            label="Username"
            name="username"
            placeholder="doe28"
            disabled={loading}
            mt="md"
            size="md"
            {...form.getInputProps("username")}
          />
          <TextInput
            withAsterisk
            label="Email address"
            name="email"
            placeholder="someone@example.com"
            disabled={loading}
            mt="md"
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
            disabled={loading}
            name="rememberMe"
            mt="xl"
            size="md"
            checked={form.values.rememberMe}
            onChange={(event) =>
              form.setFieldValue("rememberMe", event.currentTarget.checked)
            }
          />
          <Button loading={loading} type="submit" fullWidth mt="xl" size="md">
            Register
          </Button>
        </form>

        <Text align="center" mt="md">
          Already have an account?{" "}
          <Link className={classes.redirecter} to="/auth/login">
            Login
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

export default Register;
