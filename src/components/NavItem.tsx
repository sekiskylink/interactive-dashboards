import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { IDashboard, LocationGenerics, Option } from "../interfaces";
import { $dashboard } from "../Store";

interface NavItemProps {
  option: Option & { dashboards: IDashboard[] };
}
const NavItem = ({ option: { label, value, dashboards } }: NavItemProps) => {
  const navigate = useNavigate();
  const search = useSearch<LocationGenerics>();
  const dashboard = useStore($dashboard);
  return (
    <Box key={value}>
      <Text
        color="gray.600"
        m="1"
        mt="4"
        fontSize="lg"
        fontWeight="bold"
        textTransform="uppercase"
      >
        {label}
      </Text>

      {dashboards.map((d) => (
        <Flex
          alignItems="center"
          key={d.id}
          gap="5"
          pt="1"
          pl="2"
          borderRadius="lg"
          fontSize="lg"
          m="2"
          cursor="pointer"
          _hover={{ bgColor: "#E8EDF2", color: "black" }}
          bgColor={dashboard.id === d.id ? "#00796B" : ""}
          color={dashboard.id === d.id ? "white" : ""}
          onClick={(e) => {
            e.stopPropagation();
            navigate({
              to: `/dashboards/${d.id}`,
              search,
            });
          }}
        >
          {d.name}
        </Flex>
      ))}
    </Box>
  );
};

export default NavItem;
