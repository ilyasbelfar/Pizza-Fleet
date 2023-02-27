import {
  Group,
  Image,
  NumberInput,
  Text,
  Title,
  createStyles,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCart } from "../redux/slices/cartSlice";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useRef } from "react";

const useStyles = createStyles((theme) => ({
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
  ProductDetailsTD: {
    width: 450,
  },
}));

const CartItem = ({ cart, item }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const qtyRef = useRef();
  const form = useForm({
    initialValues: {
      cartId: cart,
      pizzaId: item.pizza._id,
      quantity: item.quantity,
    },
  });

  const formOfRemoveItem = useForm({
    initialValues: {
      cartId: cart,
      pizzaId: item.pizza._id,
    },
  });

  return (
    <tr key={item._id}>
      <td className={classes.ProductDetailsTD}>
        <Group spacing="sm" sx={{ flexWrap: "nowrap" }}>
          <Image
            fit="fill"
            src={item.pizza.image}
            width={120}
            height={90}
            withPlaceholder
            radius="sm"
          />
          <Title
            sx={(theme) => ({
              fontFamily: theme.fontFamily,
            })}
            order={4}
          >
            {item.pizza.name}
          </Title>
        </Group>
      </td>
      <td>
        <Text>{item.pizza.price}DA</Text>
      </td>
      <td>
        <Group position="center">
          <div className={classes.wrapper}>
            <ActionIcon
              size={28}
              variant="transparent"
              disabled={form.values.quantity === 1}
              onClick={() => {
                form.setFieldValue("quantity", form.values.quantity - 1);
                dispatch(
                  updateCart({
                    ...form.values,
                    quantity: form.values.quantity - 1,
                  })
                );
              }}
              className={classes.control}
            >
              <HiOutlineMinus />
            </ActionIcon>
            <NumberInput
              ref={qtyRef}
              hideControls
              variant="unstyled"
              min={1}
              value={form.values.quantity}
              onChange={(e) => {
                if (isNaN(e)) return;
                form.setFieldValue("quantity", e);
                dispatch(updateCart({ ...form.values, quantity: e }));
              }}
              classNames={{ input: classes.input }}
            />
            <ActionIcon
              size={28}
              variant="transparent"
              className={classes.control}
              onClick={() => {
                form.setFieldValue("quantity", form.values.quantity + 1);
                dispatch(
                  updateCart({
                    ...form.values,
                    quantity: form.values.quantity + 1,
                  })
                );
              }}
            >
              <HiOutlinePlus />
            </ActionIcon>
          </div>
        </Group>
      </td>
      <td>
        <Text>{item.subTotal}DA</Text>
      </td>
      <td>
        <ActionIcon
          size={28}
          variant="transparent"
          onClick={() => {
            dispatch(removeFromCart(formOfRemoveItem.values));
          }}
          className={classes.control}
        >
          <IoClose />
        </ActionIcon>
      </td>
    </tr>
  );
};

export default CartItem;
