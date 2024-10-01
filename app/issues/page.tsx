import React from "react";
import { Button, Flex } from "@radix-ui/themes";

const IssuesPage = () => {
  return (
    <div>
      <Flex gap="3">
        <Button color="indigo" variant="soft">
          Edit profile
        </Button>
        <Button color="cyan" variant="soft">
          Edit profile
        </Button>
        <Button color="orange" variant="soft">
          Edit profile
        </Button>
        <Button color="crimson" variant="soft">
          Edit profile
        </Button>
      </Flex>
    </div>
  );
};

export default IssuesPage;
