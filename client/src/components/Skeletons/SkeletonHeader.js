import React, { forwardRef } from "react";
import { Group, Skeleton } from "@mantine/core";

// The forwardRef is used to pass the ref to the component
const SkeletonHeader = forwardRef((props, ref) => {
  return (
    <Group mr="md" spacing={7}>
      <Skeleton radius="xl" height={30} width={30} />
      <Skeleton
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            display: "none",
          },
        })}
        height={15}
        width={80}
      />
    </Group>
  );
});

export default SkeletonHeader;
