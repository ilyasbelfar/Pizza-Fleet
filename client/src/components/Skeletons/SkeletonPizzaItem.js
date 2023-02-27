import { Card, createStyles, Group, Skeleton } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  section: {
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    textAlign: "center",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `6px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    border: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
  },
}));

const SkeletonPizzaItem = () => {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p="md">
      <Card.Section>
        <Skeleton height={220} />
      </Card.Section>
      <Card.Section className={classes.section}>
        <Group my="lg" position="apart">
          <Skeleton height={14} width={150} />
          <Skeleton height={14} width={80} />
        </Group>
        <Skeleton my="sm" height={10} width="100%" />
        <Skeleton my="sm" height={10} width="100%" />
        <Skeleton my="sm" height={10} width="100%" />
        <Skeleton my="sm" height={10} width="100%" />
      </Card.Section>
      <Card.Section>
        <Group mt="xs" position="center">
          <Skeleton height={25} width="12%" />
          <Skeleton height={42} width="30%" />
        </Group>
      </Card.Section>
      <Skeleton my="sm" height={40} width="100%" />
    </Card>
  );
};

export default SkeletonPizzaItem;
