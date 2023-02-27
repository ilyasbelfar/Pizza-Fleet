import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import ProfileNavbar from "./ProfileNavbar";
import ProfileHeader from "./ProfileHeader";
import { useState } from "react";

const ProfileAppShell = ({ user }) => {
  // eslint-disable-next-line no-unused-vars
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      sx={(theme) => ({
        main: {
          background: theme.colorScheme === "dark" ? "#0e1012" : "#e9e9ec",
        },
        [theme.fn.smallerThan("md")]: {
          main: {
            width: "100%",
            padding: "16px 5px",
          },
        },
      })}
      navbarOffsetBreakpoint="sm"
      navbar={
        <ProfileNavbar onClosing={() => setOpened(!opened)} opened={opened} />
      }
      header={
        <ProfileHeader onClosing={() => setOpened(!opened)} opened={opened} />
      }
    >
      <Outlet context={user} />
    </AppShell>
  );
};

export default ProfileAppShell;
