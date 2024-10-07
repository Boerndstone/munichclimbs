import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

const loadingIssueDetailPage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Flex className="space-x-3" my="2">
        <Skeleton width="5rem" />
        <Skeleton width="8rem" />
      </Flex>
      <Card className="p-4 my-4">
        <Skeleton count={3} />
      </Card>
    </Box>
  );
};

export default loadingIssueDetailPage;
