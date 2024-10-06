import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: Status;
}

const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" }
> = {
  OPEN: { label: "OPEN", color: "red" },
  IN_PROGRESS: { label: "IN_PROGRESS", color: "violet" },
  CLOSED: { label: "CLOSED", color: "green" },
};
const IssueStatusBadge = ({ status }: Props) => {
  // It is better to solve this with map
  //   if (status === "OPEN") {
  //     return <Badge color="red">Open</Badge>;
  //   }
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default IssueStatusBadge;
