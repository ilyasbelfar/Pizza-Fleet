import { Container } from "@mantine/core";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import ProfileAppShell from "../components/Profile/ProfileAppShell";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useSelector((state) => state.auth);
  const segment = window.location.href.toString().split("/")[4];
  useMemo(() => {
    document.title = "Profile | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  if (updateUser.success) {
    showNotification({
      autoClose: 3000,
      title: "Success",
      message: updateUser.message,
      icon: <IoCheckmarkOutline size={20} />,
      color: "green",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }

  if (updateUser.error) {
    showNotification({
      autoClose: 3000,
      title: "Error",
      message: updateUser.message,
      icon: <IoCloseOutline size={20} />,
      color: "red",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });
  }
  return (
    <>
      {user &&
        Object?.entries(user)?.length > 0 &&
        segment !== user?._id?.toString() && (
          <Navigate to={`/profile/${user?._id}`} />
        )}
      <Container size="lg">
        {user && Object?.entries(user)?.length > 0 && (
          <ProfileAppShell user={user} />
        )}
      </Container>
    </>
  );
};

export default Profile;
