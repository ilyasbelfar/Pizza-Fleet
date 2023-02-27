import { Grid, Group, Paper, Divider, Skeleton } from "@mantine/core";

const SkeletonOrderDetails = () => {
  return (
    <Grid.Col sm={4}>
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
        <Group mb={10}>
          <Skeleton height={25} width="40%" />
          <Skeleton height={15} width="30%" />
        </Group>
        <Group mb="md" mt="md">
          <Skeleton height={100} width={100} />
          <div style={{ width: "min-content", flexGrow: 1 }}>
            <Skeleton height={20} mb="md" />
            <Group position="apart">
              <Skeleton height={20} width="20%" />
              <Skeleton height={20} width="20%" />
              <Skeleton height={20} width="25%" />
            </Group>
          </div>
        </Group>
        <Group mb="md" mt="md">
          <Skeleton height={100} width={100} />
          <div style={{ width: "min-content", flexGrow: 1 }}>
            <Skeleton height={20} mb="md" />
            <Group position="apart">
              <Skeleton height={20} width="20%" />
              <Skeleton height={20} width="20%" />
              <Skeleton height={20} width="25%" />
            </Group>
          </div>
        </Group>
        <Divider my="sm" variant="dashed" />
        <Group my={10} position="apart">
          <Skeleton height={20} width="40%" />
          <Skeleton height={20} width="25%" />
        </Group>
        <Group my={10} position="apart">
          <Skeleton height={20} width="40%" />
          <Skeleton height={20} width="25%" />
        </Group>
        <Group my={10} position="apart">
          <Skeleton height={20} width="40%" />
          <Skeleton height={20} width="25%" />
        </Group>
        <Group my={10} position="apart">
          <Skeleton height={20} width="40%" />
          <Skeleton height={20} width="25%" />
        </Group>
        <Divider my="sm" variant="dashed" />
        <Skeleton height={40} />
      </Paper>
    </Grid.Col>
  );
};

export default SkeletonOrderDetails;
