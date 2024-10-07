import { Box, Card, Flex } from "@radix-ui/themes";
import React from "react";
import { Skeleton } from "@/app/components";

const loadingIssueNewPage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Skeleton height="20rem" />
    </Box>
  );
};

export default loadingIssueNewPage;
