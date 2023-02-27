import { Grid, Group, Card, Skeleton } from "@mantine/core";

const SkeletonUserAddresses = () => {
  return (
    <>
      <Skeleton height={30} width={200} />
      <Grid py="lg">
        <Grid.Col xs={4}>
          <Card
            p="lg"
            shadow="lg"
            radius="md"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : "#f8f9fa",
              borderWidth: 2,
              borderStyle: "solid",
              borderColor:
                theme.colorScheme === "dark" ? "transparent" : "#f1f5f8",
            })}
          >
            <Group mb="lg" position="apart">
              <Skeleton height={20} width="45%" />
              <Skeleton height={12} width="30%" />
            </Group>
            <Skeleton mb="md" height={10} />
            <Skeleton mb="md" height={10} />
            <Skeleton mb="md" height={10} width="40%" />
          </Card>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Card
            p="lg"
            shadow="lg"
            radius="md"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : "#f8f9fa",
              borderWidth: 2,
              borderStyle: "solid",
              borderColor:
                theme.colorScheme === "dark" ? "transparent" : "#f1f5f8",
            })}
          >
            <Group mb="lg" position="apart">
              <Skeleton height={20} width="45%" />
              <Skeleton height={12} width="30%" />
            </Group>
            <Skeleton mb="md" height={10} />
            <Skeleton mb="md" height={10} />
            <Skeleton mb="md" height={10} width="40%" />
          </Card>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Card
            p="lg"
            shadow="lg"
            radius="md"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : "#f8f9fa",
              borderWidth: 2,
              borderStyle: "solid",
              borderColor:
                theme.colorScheme === "dark" ? "transparent" : "#f1f5f8",
            })}
          >
            <Group mb="lg" position="apart">
              <Skeleton height={20} width="45%" />
              <Skeleton height={12} width="30%" />
            </Group>
            <Skeleton mb="md" height={10} />
            <Skeleton mb="md" height={10} />
            <Skeleton mb="md" height={10} width="40%" />
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default SkeletonUserAddresses;
