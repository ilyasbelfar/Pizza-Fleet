import { Container, SimpleGrid } from "@mantine/core";
import PizzaItem from "../components/PizzaItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getPizzas } from "../redux/slices/pizzaSlice";
import SkeletonPizzaItem from "../components/Skeletons/SkeletonPizzaItem";
import { showNotification } from "@mantine/notifications";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { clearAddToCart } from "../redux/slices/cartSlice";
import FiltersBar from "../components/FiltersBar";

const Home = () => {
  const dispatch = useDispatch();
  const { pizzas, filters, loading } = useSelector((state) => state.pizza);
  const { success, error, message } = useSelector(
    (state) => state.cart.addToCart
  );
  const [toAdd, setToAdd] = useState(null);

  useMemo(() => {
    document.title = "Home | Pizza Fleet";
    return () => {
      document.title = "Pizza Fleet";
    };
  }, []);

  useEffect(() => {
    dispatch(getPizzas(filters));
    return () => {
      dispatch(clearAddToCart());
    };
  }, [dispatch, filters]);

  success &&
    showNotification({
      autoClose: 3000,
      title: "Success",
      message: message,
      icon: <IoCheckmarkOutline size={20} />,
      color: "green",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });

  error &&
    showNotification({
      autoClose: 3000,
      title: "Error",
      message: message,
      icon: <IoCloseOutline size={20} />,
      color: "red",
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === "dark" ? theme.colors.white : theme.black,
          fontWeight: 500,
          fontSize: 16,
        },
        description: {
          color: theme.colors.gray[6],
          fontSize: 15,
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }),
    });

  return (
    <Container size="lg" py="xl">
      <FiltersBar filters={filters} />
      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "xs" },
        ]}
      >
        {pizzas.length === 0 && loading && (
          <>
            <SkeletonPizzaItem />
            <SkeletonPizzaItem />
            <SkeletonPizzaItem />
          </>
        )}
        {pizzas.length > 0 &&
          pizzas.map((pizza) => {
            return (
              <PizzaItem
                key={pizza._id}
                id={pizza._id}
                name={pizza.name}
                description={pizza.description}
                price={pizza.price}
                image={pizza.image}
                onAddingToCart={() => setToAdd(pizza._id)}
                loading={toAdd === pizza._id}
              />
            );
          })}
      </SimpleGrid>
    </Container>
  );
};

export default Home;
