import { IssueStatusBadge } from "@/app/components";
import { Heading, Flex, Card, Text } from "@radix-ui/themes";
import React from "react";
import { Issue } from "@prisma/client";
import ReactMardown from "react-markdown";

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex className="space-x-3" my="2">
        <IssueStatusBadge status={issue.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="p-4 my-4">
        <ReactMardown className="prose max-w-full">
          {issue.description}
        </ReactMardown>
      </Card>
    </>
  );
};

export default IssueDetails;
