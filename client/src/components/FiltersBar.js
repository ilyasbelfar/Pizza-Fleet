import { useState } from "react";
import { useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { TbGripVertical } from "react-icons/tb";
import {
  Button,
  Group,
  RangeSlider,
  Stack,
  Text,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { clearFilters, setFilters } from "../redux/slices/pizzaSlice";

const FiltersBar = ({ filters }) => {
  const dispatch = useDispatch();
  const [price, setPrice] = useState(filters.price);
  const [search, setSearch] = useState(filters.search);
  return (
    <Stack
      spacing="sm"
      p="md"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? "#292c2f" : "#fff",
        boxShadow: "0 6px 10px rgb(0 0 0 / 5%)",
      })}
    >
      <Group
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Group
          sx={(theme) => ({
            flex: 1,
            [theme.fn.smallerThan("sm")]: {
              width: "100%",
            },
          })}
        >
          <TbGripVertical size={20} />
          <Text
            fw={700}
            sx={(theme) => ({
              [theme.fn.smallerThan("sm")]: {
                display: "none",
              },
            })}
          >
            Price range:
          </Text>
          <RangeSlider
            sx={{
              flex: 1,
            }}
            min={200}
            max={4000}
            step={10}
            label={(value) => `${value}DA`}
            value={price}
            onChange={(value) => setPrice(value)}
          />
        </Group>
        <TextInput
          sx={(theme) => ({
            flex: 1,
            input: {
              backgroundColor:
                theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
            },
            [theme.fn.largerThan("sm")]: {
              maxWidth: 300,
            },
            [theme.fn.smallerThan("sm")]: {
              width: "100%",
            },
          })}
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Group>
          <ActionIcon
            sx={(theme) => ({
              height: 36,
              width: 36,
              color: theme.colorScheme === "dark" && "white",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? "rgba(255, 99, 71, 0.4)"
                  : "rgba(255, 140, 0, 0.2)",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? "rgba(255, 99, 71, 0.4)"
                    : "rgba(255, 140, 0, 0.2)",
              },
            })}
            color="orange"
            onClick={() => {
              setPrice([200, 4000]);
              setSearch("");
              dispatch(clearFilters());
            }}
          >
            <IoClose size={24} />
          </ActionIcon>
          <Button
            onClick={() => {
              if (
                search?.length === 0 &&
                JSON.stringify(price) === JSON.stringify(filters.price)
              )
                return;
              dispatch(setFilters({ price, search }));
            }}
          >
            Apply Filters
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default FiltersBar;
