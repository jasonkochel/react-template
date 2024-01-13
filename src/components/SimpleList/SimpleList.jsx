import { SimpleGrid } from "@mantine/core";
import { forwardRef } from "react";
import classes from "./SimpleList.module.css";

const forwardRefComponent = ({ children, ...rest }, ref) => {
  return (
    <SimpleGrid cols={1} spacing={0} className={classes.list} {...rest} ref={ref}>
      {children}
    </SimpleGrid>
  );
};

forwardRefComponent.displayName = "SimpleList";

const SimpleList = forwardRef(forwardRefComponent);

export default SimpleList;
