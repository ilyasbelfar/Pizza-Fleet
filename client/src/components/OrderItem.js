import { useState } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { HiOutlineEye } from "react-icons/hi";
import OrderDetailsModal from "./OrderDetailsModal";

const OrderItem = ({ order }) => {
  const [isOpen, setIsOpen] = useState(null);
  let subTotal = 0;
  order?.cart?.cartItems?.map((item) => {
    subTotal += item.subTotal;
    return subTotal;
  });
  return (
    <tr key={order._id}>
      <td>
        <strong>{order._id}</strong>
      </td>
      <td>
        {new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td>
        {order?.cart?.cartItems?.map((item) => {
          return (
            <div key={item._id}>
              <span>{item.pizza.name}</span>
              <span> x {item.quantity}</span>
              <br />
            </div>
          );
        })}
      </td>
      <td>
        {order?.address?.streetAddress}, {order?.address?.city},{" "}
        {order?.address?.state}, {order?.address?.country},{" "}
        {order?.address?.zipCode}
      </td>
      <td>
        {order?.cart?.totalToPay?.toLocaleString("en-US", {
          style: "currency",
          currency: "DZD",
        })}
      </td>
      <td>{order?.status}</td>
      <td>
        <ActionIcon
          onClick={() => {
            if (isOpen === order._id) {
              setIsOpen(null);
            } else {
              setIsOpen(order._id);
            }
          }}
        >
          <HiOutlineEye size={20} />
        </ActionIcon>
      </td>
      <Modal
        opened={isOpen === order._id}
        onClose={() => setIsOpen(null)}
        centered
      >
        <OrderDetailsModal subTotal={subTotal} order={order} />
      </Modal>
    </tr>
  );
};

export default OrderItem;
