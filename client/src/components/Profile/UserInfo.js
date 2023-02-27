import {
  TextInput,
  PasswordInput,
  Group,
  Paper,
  Title,
  Avatar,
  createStyles,
  Button,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { HiCamera } from "react-icons/hi";
import { useOutletContext } from "react-router-dom";
import { updateUser, clearUpdateUser } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

const useStyles = createStyles((theme) => ({
  indicatorRoot: {
    position: "relative",
  },

  indicator: {
    position: "absolute",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: theme.colors.orange[9],
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.colorScheme === "dark" ? "#16181a" : "#fff",
    color: "#fff",
    whiteSpace: "nowrap",
    bottom: 14,
    right: 14,
    transform: "translate(50%, 50%)",
    width: 30,
    height: 30,
    borderRadius: "50%",
    padding: 5,
  },
}));

const UserInfo = () => {
  const { updateUser: updateUserState } = useSelector((state) => state.auth);
  const { classes } = useStyles();
  const user = useOutletContext();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const form = useForm({
    initialValues: {
      id: user?._id ? user?._id : "",
      userAvatar: user?.avatar?.url ? user?.avatar?.url : "",
      firstName: user?.firstName ? user?.firstName : "",
      lastName: user?.lastName ? user?.lastName : "",
      email: user?.email ? user?.email : "",
      username: user?.username ? user?.username : "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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
      email: (value) =>
        /^\s*$/.test(value)
          ? null
          : !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? "Invalid email!"
          : null,
      username: (value) =>
        /^\s*$/.test(value)
          ? null
          : !/^[a-zA-Z][\w\W]*$/.test(value)
          ? "Username must start with a letter!"
          : !/^[A-Za-z][A-Za-z0-9_]{7,29}$/.test(value)
          ? "Username must be between 7 and 29 characters long, and can only contain letters, numbers, and underscores!"
          : null,
      currentPassword: (value, values) =>
        /^\s*$/.test(value) &&
        (values.newPassword !== "" || values.confirmPassword !== "")
          ? "Current password is required!"
          : !/^\w{6,16}$/.test(value) &&
            (values.newPassword !== "" || values.confirmPassword !== "")
          ? "Password must be between 6 and 16 characters long!"
          : null,
      newPassword: (value, values) =>
        /^\s*$/.test(value) && values.currentPassword !== ""
          ? "New password is required!"
          : !/^\w{6,16}$/.test(value) && values.confirmPassword !== ""
          ? "Password must be between 6 and 16 characters long!"
          : value !== values.confirmPassword
          ? "Passwords do not match!"
          : null,
      confirmPassword: (value, values) =>
        /^\s*$/.test(value) && values.currentPassword !== ""
          ? "Confirm password is required!"
          : !/^\w{6,16}$/.test(value) && values.newPassword !== ""
          ? "Password must be between 6 and 16 characters long!"
          : values.newPassword !== "" && value !== values.newPassword
          ? "Passwords do not match!"
          : null,
    },
    validateInputOnBlur: true, // Validate input on blur
  });

  const handleSubmit = (values) => {
    if (Object?.entries(form.errors)?.length > 0) {
      return;
    }
    dispatch(updateUser(values));
  };

  useEffect(() => {
    return () => {
      dispatch(clearUpdateUser());
    };
  }, [dispatch]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
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
        {user?.loginType === "local" && (
          <Group p="lg">
            <div className={classes.indicatorRoot}>
              <span
                onClick={() => {
                  fileInputRef.current.click();
                }}
                className={classes.indicator}
              >
                <HiCamera size={25} />
              </span>
              <Avatar size={120} radius={`50%`} src={user?.avatar?.url} />
            </div>
            <FileInput
              ref={fileInputRef}
              placeholder="Pick picture"
              label="Your avatar"
              withAsterisk
              sx={{
                display: "none",
              }}
              {...form.getInputProps("userAvatar")}
            />
            <Title
              order={3}
              sx={(theme) => ({
                fontFamily: theme.fontFamily,
              })}
            >
              {user?.firstName} {user?.lastName}
            </Title>
          </Group>
        )}
        <Group mb="lg" position="center" grow>
          <TextInput
            placeholder="Your first name"
            label="First Name"
            {...form.getInputProps("firstName")}
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
          />
          <TextInput
            placeholder="Your last name"
            label="Last Name"
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            {...form.getInputProps("lastName")}
          />
        </Group>
        <Group mb="lg" position="center" grow>
          <TextInput
            placeholder="Your email address"
            label="Email Address"
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            {...form.getInputProps("email")}
          />
          <TextInput
            placeholder="Your username"
            label="Username"
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            {...form.getInputProps("username")}
          />
        </Group>
        {user?.providers?.includes("local") && (
          <PasswordInput
            mb="md"
            placeholder="Current password"
            label="Current Password"
            styles={(theme) => ({
              background: theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
            })}
            {...form.getInputProps("currentPassword")}
          />
        )}
        <PasswordInput
          mb="md"
          placeholder="New password"
          label="New Password"
          {...form.getInputProps("newPassword")}
        />
        <PasswordInput
          mb="md"
          placeholder="Confirm new password"
          label="Confirm New Password"
          {...form.getInputProps("confirmPassword")}
        />
        <Button
          loading={updateUserState.loading}
          type="submit"
          mt="md"
          radius="md"
          shadow="sm"
        >
          Save Changes
        </Button>
      </Paper>
    </form>
  );
};

export default UserInfo;
