import { Grid, Paper, Group, Skeleton } from "@mantine/core";

const SkeletonUserCheckoutDetails = () => {
  return (
    <Grid.Col sm={8}>
      <Paper
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
        })}
        my="md"
        shadow="xs"
        radius="md"
        p="md"
        withBorder
      >
        <Skeleton mb="lg" height={25} width="30%" />
        <Group mb="lg" position="center" grow>
          <Skeleton height={50} width="50%" />
          <Skeleton height={50} width="50%" />
        </Group>
        <Skeleton mb="lg" height={50} width="100%" />
        <Grid mb="lg" grow>
          <Grid.Col xs={6}>
            <Skeleton height={50} />
          </Grid.Col>
          <Grid.Col xs={3}>
            <Skeleton height={50} />
          </Grid.Col>
          <Grid.Col xs={3}>
            <Skeleton height={50} />
          </Grid.Col>
        </Grid>
        <Skeleton mb="lg" height={50} />
        <Skeleton mb="lg" height={50} />
        <Skeleton mb="lg" height={50} />
      </Paper>
      <Paper
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
        })}
        my="md"
        shadow="xs"
        radius="md"
        p="md"
        withBorder
      >
        <Skeleton mb="lg" height={25} width="30%" />
        <Skeleton mb="lg" height={50} />
        <Grid mb="lg" grow>
          <Grid.Col xs={6}>
            <Skeleton height={50} />
          </Grid.Col>
          <Grid.Col xs={3}>
            <Skeleton height={50} />
          </Grid.Col>
          <Grid.Col xs={3}>
            <Skeleton height={50} />
          </Grid.Col>
        </Grid>
      </Paper>
    </Grid.Col>
  );
};

export default SkeletonUserCheckoutDetails;
