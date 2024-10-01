import React from "react";
import { Button, Flex, TextField, TextArea } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Search the docs…">
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <TextArea placeholder="Reply to comment…" />
      <Button color="indigo" variant="soft">
        Submit new{" "}
      </Button>
    </div>
  );
};

export default NewIssuePage;
