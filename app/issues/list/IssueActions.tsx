import React from "react";
import Link from "next/link";
import { Button } from "@radix-ui/themes";

const IssueActions = () => {
  return (
    <div className="mb-5">
      <Button color="indigo" variant="soft">
        <Link href="/issues/new">New</Link>
      </Button>
    </div>
  );
};

export default IssueActions;
