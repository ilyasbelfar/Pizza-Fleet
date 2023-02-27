import {
  ActionIcon,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  NumberInput,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

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
      theme.colorScheme === "dark" ? theme.colors.dark[5] : "#e9e9ec",
  },
  input: {
    textAlign: "center",
    paddingRight: `${theme.spacing.sm}px !important`,
    paddingLeft: `${theme.spacing.sm}px !important`,
    height: 28,
    width: 55,
  },
  control: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : "#cbcbcb",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]
    }`,

    "&:disabled": {
      borderColor: "transparent",
      opacity: theme.colorScheme === "dark" ? 0.8 : 1,
      backgroundColor: "transparent",
    },
  },
}));

const PizzaItem = ({
  id,
  name,
  description,
  price,
  image,
  loading,
  onAddingToCart,
}) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { loading: isAddingToCart } = useSelector(
    (state) => state.cart.addToCart
  );

  const handleSubmit = (values) => {
    if (!form.isValid()) return;
    onAddingToCart();
    dispatch(addToCart(values));
  };

  const form = useForm({
    initialValues: {
      pizzaId: id,
      price,
      quantity: 1,
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card
        sx={{
          boxShadow: "0 6px 10px rgb(0 0 0 / 5%)",
        }}
        withBorder
        radius="md"
        p="md"
      >
        <Card.Section>
          <Image fit="fill" src={image} height={220} withPlaceholder />
        </Card.Section>
        <Card.Section className={classes.section}>
          <Group
            sx={{
              color: "white",
            }}
            mt="xs"
            position="apart"
          >
            <Text
              sx={(theme) => ({
                color:
                  theme.colorScheme === "dark" ? "#fff" : theme.colors.dark[7],
              })}
              weight={700}
            >
              {name}
            </Text>
            <Text
              sx={(theme) => ({
                color:
                  theme.colorScheme === "dark" ? "#fff" : theme.colors.dark[7],
              })}
              mt="xs"
            >
              {price}DA
            </Text>
          </Group>
          <Text
            sx={(theme) => ({
              color:
                theme.colorScheme === "dark" ? "#a5a8ab" : theme.colors.dark[7],
            })}
            size="sm"
            mt="xs"
          >
            {description}
          </Text>
        </Card.Section>
        <Card.Section>
          <Group mt="xs" position="center">
            <Text>Qty</Text>
            <div className={classes.wrapper}>
              <ActionIcon
                size={28}
                variant="transparent"
                disabled={form.values.quantity === 1}
                onClick={() =>
                  form.setFieldValue("quantity", form.values.quantity - 1)
                }
                className={classes.control}
              >
                <HiOutlineMinus />
              </ActionIcon>
              <NumberInput
                hideControls
                variant="unstyled"
                min={1}
                value={form.values.quantity}
                onChange={(e) => form.setFieldValue("quantity", e)}
                classNames={{ input: classes.input }}
              />
              <ActionIcon
                size={28}
                variant="transparent"
                className={classes.control}
                onClick={() =>
                  form.setFieldValue("quantity", form.values.quantity + 1)
                }
              >
                <HiOutlinePlus />
              </ActionIcon>
            </div>
          </Group>
        </Card.Section>
        <Button
          type="submit"
          loading={isAddingToCart && loading}
          fullWidth
          radius="md"
          mt="xs"
          style={{ flex: 1 }}
        >
          Add to cart
        </Button>
      </Card>
    </form>
  );
};

export default PizzaItem;
