import { Group, Skeleton } from "@mantine/core";

const SkeletonUserOrders = () => {
  return (
    <>
      <Skeleton height={30} width={200} />
      <Group
        my="lg"
        py="lg"
        sx={(theme) => ({
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          borderBottomColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "#f1f5f8",
        })}
      >
        <Skeleton height={25} width="15%" />
        <Skeleton height={25} width="25%" />
        <Skeleton height={25} width="20%" />
        <Skeleton height={25} width="10%" />
        <Skeleton height={25} width="15%" />
      </Group>
      <Group>
        <Skeleton height={25} width="15%" />
        <Skeleton height={25} width="25%" />
        <Skeleton height={25} width="20%" />
        <Skeleton height={25} width="10%" />
        <Skeleton height={25} width="15%" />
      </Group>
      <Group my="lg" py="lg">
        <Skeleton height={25} width="15%" />
        <Skeleton height={25} width="25%" />
        <Skeleton height={25} width="20%" />
        <Skeleton height={25} width="10%" />
        <Skeleton height={25} width="15%" />
      </Group>
    </>
  );
};

export default SkeletonUserOrders;
