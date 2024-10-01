import React from "react";
import { Button, Flex, TextField } from "@radix-ui/themes";
import Link from "next/link";

const IssuesPage = () => {
  return (
    <div>
      <Flex gap="3">
        <Button color="indigo" variant="soft">
          <Link href="/issues/new">New</Link>
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
