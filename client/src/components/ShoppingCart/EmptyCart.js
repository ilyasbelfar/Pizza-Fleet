import { Stack, Image, Title, Text, Button } from "@mantine/core";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <Stack>
      <Title
        sx={(theme) => ({
          fontFamily: theme.fontFamily,
        })}
        mb="lg"
      >
        Your cart is empty!
      </Title>
      <Image
        mb={60}
        fit="contain"
        sx={(theme) => ({
          margin: "auto",
          width: "350px !important",
          height: "350px !important",
          [theme.fn.smallerThan("sm")]: {
            width: "80%",
            height: "auto",
          },
        })}
        src="https://res.cloudinary.com/djuxwysbl/image/upload/v1677176878/PizzaDelivery/Empty_Cart_SVG_kld2xp.png"
        alt="Empty Cart"
      />
      <Text my="lg">
        Looks like you haven't added any pizza items to your cart yet.
      </Text>
      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
    </Stack>
  );
};

export default EmptyCart;
