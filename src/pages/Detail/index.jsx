import { getOne } from "@/api";
import { Center, Loader, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all", id],
    queryFn: () => getOne(id),
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>{JSON.stringify(error)}</div>;

  return (
    <Center h="100vh" bg="var(--mantine-color-blue-light)">
      <Stack>
        <Title order={1} ta="center">
          {id}
        </Title>
        <pre>{JSON.stringify(data)}</pre>
      </Stack>
    </Center>
  );
};

export default Detail;
