import { Grid, Paper, Group, Skeleton, Center } from "@mantine/core";

const SkeletonCart = () => {
  return (
    <Grid>
      <Grid.Col sm={8}>
        <Paper
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
          })}
          shadow="xs"
          radius="md"
          p="md"
          withBorder
        >
          <Center>
            <Skeleton height={20} width="30%" />
          </Center>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton mr="xs" my="lg" height={90} width="20%" />
            <Skeleton mr="xs" my="lg" height={25} width="20%" />
            <Skeleton ml="lg" my="lg" height={20} width="10%" />
            <Skeleton ml="lg" height={42} width="20%" />
            <Skeleton ml="lg" my="lg" height={20} width="10%" />
            <Skeleton ml="lg" my="lg" height={25} width="4%" />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton mr="xs" my="lg" height={90} width="20%" />
            <Skeleton mr="xs" my="lg" height={25} width="20%" />
            <Skeleton ml="lg" my="lg" height={20} width="10%" />
            <Skeleton ml="lg" height={42} width="20%" />
            <Skeleton ml="lg" my="lg" height={20} width="10%" />
            <Skeleton ml="lg" my="lg" height={25} width="4%" />
          </div>
        </Paper>
      </Grid.Col>
      <Grid.Col sm={4}>
        <Paper
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
          })}
          shadow="xs"
          radius="md"
          p="md"
          withBorder
        >
          <Center>
            <Skeleton mb="lg" height={20} width="45%" />
          </Center>
          <Group my="md" position="apart">
            <Skeleton height={10} width="30%" />
            <Skeleton height={10} width="20%" />
          </Group>
          <Group my="md" position="apart">
            <Skeleton height={10} width="30%" />
            <Skeleton height={10} width="20%" />
          </Group>
          <Group mb="lg" mt="md" position="apart">
            <Skeleton height={10} width="30%" />
            <Skeleton height={10} width="20%" />
          </Group>
          <Skeleton my="sm" height={15} width="45%" />
          <Skeleton my="sm" height={35} />
          <Skeleton my="sm" height={25} width="25%" />
          <Group mb="lg" mt="md" position="apart">
            <Skeleton height={10} width="30%" />
            <Skeleton height={10} width="20%" />
          </Group>
          <Skeleton height={35} />
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default SkeletonCart;
