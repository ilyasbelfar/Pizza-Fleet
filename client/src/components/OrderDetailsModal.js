import { Paper, Group, Title, Text, Image, Divider } from "@mantine/core";

const OrderDetailsModal = ({ order, subTotal }) => {
  return (
    <Paper
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          marginBottom: 120,
        },
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff",
      })}
      shadow="xs"
      radius="md"
      p="md"
    >
      <Title
        sx={(theme) => ({
          fontFamily: theme.fontFamily,
          paddingBottom: 16,
          marginBottom: 16,
          borderBottom: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.gray[3]
              : theme.colors.dark[7]
          }`,
        })}
        order={3}
      >
        Your Order
      </Title>

      {order?.cart?.cartItems?.map((item) => (
        <Group key={item._id} mb="md" mt="md">
          <Image
            radius="md"
            src={item.pizza.image}
            width={100}
            height={100}
            withPlaceholder
          />
          <div style={{ width: "min-content", flexGrow: 1 }}>
            <Text lineClamp={4} component="h3">
              {item.pizza.name}
            </Text>
            <Group position="apart">
              <Group position="apart">
                <Text fz="sm">{item.pizza.price}DA</Text>
                <Text fz="sm">x{item.quantity}</Text>
              </Group>
              <Text fz="sm" fw={700}>
                {item.subTotal}DA
              </Text>
            </Group>
          </div>
        </Group>
      ))}
      <Divider my="sm" variant="dashed" />

      <Group my={10} position="apart">
        <Text>Subtotal</Text>
        <Text fz="sm" fw={700}>
          {subTotal}DA
        </Text>
      </Group>

      <Group my={10} position="apart">
        <Text>Shipping</Text>
        <Text fz="sm" fw={700}>
          {order?.cart?.shipping === 0 ? "Free" : `${order?.cart?.shipping}DA`}
        </Text>
      </Group>
      <Group my={10} position="apart">
        <Text>Discount 10%</Text>
        <Text fz="sm" fw={700}>
          -DA5.00
        </Text>
      </Group>

      <Group my={10} position="apart">
        <Text>Total Cost</Text>
        <Text fz="sm" fw={700}>
          {order?.cart?.totalToPay}DA
        </Text>
      </Group>
    </Paper>
  );
};

export default OrderDetailsModal;
