import {
  MediaQuery,
  Header,
  Burger,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

const ProfileHeader = ({ opened, onClosing }) => {
  const theme = useMantineTheme();
  // eslint-disable-next-line no-unused-vars
  const [scroll, setScroll] = useWindowScroll();
  return (
    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
      <Header
        sx={(theme) => ({
          [theme.fn.smallerThan("md")]: {
            top: scroll.y > 60 ? 0 : 60 - scroll.y,
          },
        })}
        height={{ base: 50, md: 70 }}
        p="md"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => onClosing()}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <Text
            sx={(theme) => ({
              fontFamily: theme.fontFamily,
            })}
          >
            User Profile
          </Text>
        </div>
      </Header>
    </MediaQuery>
  );
};

export default ProfileHeader;
