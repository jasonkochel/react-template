import { getAll } from "@/api";
import SimpleList from "@/components/SimpleList/SimpleList";
import { Center, Loader, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all"],
    queryFn: getAll,
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>{JSON.stringify(error)}</div>;

  return (
    <Center h="100vh" bg="var(--mantine-color-blue-light)">
      <Stack>
        <Title order={1} ta="center">
          All
        </Title>
        <SimpleList w={200}>
          {data.map((el) => (
            <div key={el.id} onClick={() => navigate(`${el.id}`)}>
              {el.name}
            </div>
          ))}
        </SimpleList>
      </Stack>
    </Center>
  );
};

export default Menu;
