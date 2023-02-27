import {
  Grid,
  Paper,
  Title,
  Group,
  TextInput,
  InputBase,
  Text,
  Center,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { MdOutlineMailOutline } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";
import { TbInfoCircle } from "react-icons/tb";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import InputMask from "react-input-mask";
import { useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { addOrder } from "../../redux/slices/orderSlice";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    margin: `1rem 0`,
  },

  paperTitle: {
    fontFamily: theme.fontFamily,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[7]
    }`,
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

const BillingDetails = ({ user, onCheckoutFinish, mustSubmit }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const formCheckout = useRef(null);

  const handleSubmit = (values) => {
    if (!form.isValid()) return;
    dispatch(addOrder(values));
  };

  const form = useForm({
    initialValues: {
      user: user?._id ? user?._id : "",
      firstName: user?.primaryAddress?.firstName
        ? user?.primaryAddress?.firstName
        : "",
      lastName: user?.primaryAddress?.lastName
        ? user?.primaryAddress?.lastName
        : "",
      streetAddress: user?.primaryAddress?.streetAddress
        ? user?.primaryAddress?.streetAddress
        : "",
      city: user?.primaryAddress?.city ? user?.primaryAddress?.city : "",
      state: user?.primaryAddress?.state ? user?.primaryAddress?.state : "",
      zipCode: user?.primaryAddress?.zipCode
        ? user?.primaryAddress?.zipCode
        : "",
      country: user?.primaryAddress?.country
        ? user?.primaryAddress?.country
        : "",
      email: user?.primaryAddress?.email ? user?.primaryAddress?.email : "",
      phoneNumber: user?.primaryAddress?.phoneNumber
        ? user?.primaryAddress?.phoneNumber
        : "",
      cardName: "",
      cardNumber: "",
      ccv: "",
      expiry: "",
    },
    validate: {
      firstName: (value) =>
        /^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]+)*$/.test(value)
          ? null
          : "Invalid first name!",
      lastName: (value) =>
        /^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]+)*$/.test(value)
          ? null
          : "Invalid last name!",
      streetAddress: hasLength(
        { min: 5, max: 50 },
        "Street address must be 5-50 characters long!"
      ),
      city: isNotEmpty("City is required!"),
      state: isNotEmpty("State is required!"),
      zipCode: isNotEmpty("Zip code is required!"),
      country: isNotEmpty("Country is required!"),
      email: (value) =>
        /^\s*$/.test(value)
          ? "Email is required!"
          : !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? "Invalid email!"
          : null,
      phoneNumber: (value) =>
        /^\s*$/.test(value)
          ? "Phone number is required!"
          : !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
              value
            )
          ? "Invalid phone number!"
          : null,
      cardName: (value) =>
        /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/.test(value)
          ? null
          : "Invalid card holder name!",
      cardNumber: (value) =>
        /^[3-6]\d{3} \d{4} \d{4} \d{4}$/.test(value)
          ? null
          : "Invalid card number!",
      ccv: (value) => (/^[0-9]{3}$/.test(value) ? null : "Invalid CCV!"),
      expiry: (value) =>
        /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value) ? null : "Invalid expiry!",
    },
    validateInputOnBlur: true,
  });

  useMemo(() => {
    if (mustSubmit) {
      formCheckout?.current?.requestSubmit();
      onCheckoutFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mustSubmit]);

  return (
    <Grid.Col sm={8}>
      <form onSubmit={form.onSubmit(handleSubmit)} ref={formCheckout}>
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
          <Title className={classes.paperTitle} order={3}>
            Billing Details
          </Title>
          <Group position="center" grow>
            <TextInput
              placeholder="Your first name"
              label="First Name"
              withAsterisk
              sx={(theme) => ({
                input: {
                  background:
                    theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                },
              })}
              classNames={classes}
              {...form.getInputProps("firstName")}
            />
            <TextInput
              placeholder="Your last name"
              label="Last Name"
              withAsterisk
              sx={(theme) => ({
                input: {
                  background:
                    theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                },
              })}
              classNames={classes}
              {...form.getInputProps("lastName")}
            />
          </Group>
          <TextInput
            label="Street address"
            placeholder="15329 Huston 21st"
            withAsterisk
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            classNames={classes}
            {...form.getInputProps("streetAddress")}
          />
          <Grid grow>
            <Grid.Col xs={6}>
              <TextInput
                placeholder="Shipping City"
                label="Town/City"
                withAsterisk
                sx={(theme) => ({
                  input: {
                    background:
                      theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                  },
                })}
                classNames={classes}
                {...form.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col xs={3}>
              <TextInput
                placeholder="Shipping State"
                label="State"
                withAsterisk
                sx={(theme) => ({
                  input: {
                    background:
                      theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                  },
                })}
                classNames={classes}
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col xs={3}>
              <TextInput
                placeholder="Shipping Zip Code"
                label="Zip Code"
                withAsterisk
                sx={(theme) => ({
                  input: {
                    background:
                      theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                  },
                })}
                classNames={classes}
                {...form.getInputProps("zipCode")}
              />
            </Grid.Col>
          </Grid>
          <TextInput
            label="Country"
            placeholder="Shipping Country"
            classNames={classes}
            withAsterisk
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            {...form.getInputProps("country")}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            withAsterisk
            rightSection={<MdOutlineMailOutline size={14} />}
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            classNames={classes}
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Phone Number"
            placeholder="Your Phone Number"
            withAsterisk
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            rightSection={<HiOutlinePhone size={14} />}
            classNames={classes}
            {...form.getInputProps("phoneNumber")}
          />
        </Paper>
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
          <Title className={classes.paperTitle} order={3}>
            Payment Details
          </Title>
          <TextInput
            placeholder="Your name on card"
            label="Name on card"
            withAsterisk
            sx={(theme) => ({
              input: {
                background:
                  theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
              },
            })}
            classNames={classes}
            {...form.getInputProps("cardName")}
          />
          <Grid grow>
            <Grid.Col xs={6}>
              <InputBase
                label="Card number"
                placeholder="Your card number"
                component={InputMask}
                mask="9999 9999 9999 9999"
                sx={(theme) => ({
                  input: {
                    background:
                      theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                  },
                })}
                classNames={classes}
                {...form.getInputProps("cardNumber")}
              />
            </Grid.Col>
            <Grid.Col xs={3}>
              <InputBase
                label="CCV"
                placeholder="CCV"
                component={InputMask}
                mask="999"
                sx={(theme) => ({
                  input: {
                    background:
                      theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                  },
                })}
                classNames={classes}
                {...form.getInputProps("ccv")}
                rightSection={
                  <Tooltip
                    label="The 3 digit code usually found on the back of your card"
                    position="top-end"
                    withArrow
                    transition="pop-bottom-right"
                  >
                    <Text color="dimmed" sx={{ cursor: "help" }}>
                      <Center>
                        <TbInfoCircle size={18} />
                      </Center>
                    </Text>
                  </Tooltip>
                }
              />
            </Grid.Col>
            <Grid.Col xs={3}>
              <InputBase
                label="Date (MM/YY)"
                placeholder="MM/YY"
                component={InputMask}
                mask={[/[0-1]/, /\d/, "/", /[0-9]/, /\d/]}
                sx={(theme) => ({
                  input: {
                    background:
                      theme.colorScheme === "dark" ? "#1f2124" : "#e9e9ec",
                  },
                })}
                classNames={classes}
                {...form.getInputProps("expiry")}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </form>
    </Grid.Col>
  );
};

export default BillingDetails;
