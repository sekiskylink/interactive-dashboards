import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPrevious,
  usePagination,
} from "@ajna/pagination";
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import { IndicatorProps } from "../../interfaces";
import { useOrganisationUnitLevels } from "../../Queries";
import { $paginations } from "../../Store";
import { globalIds } from "../../utils/utils";
import GlobalAndFilter from "./GlobalAndFilter";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const OrganizationUnitLevels = ({ denNum, onChange }: IndicatorProps) => {
  const [dimension, setDimension] = useState<"filter" | "dimension">("filter");
  const selected = Object.entries(denNum?.dataDimensions || {})
    .filter(([k, { what }]) => what === "oul")
    .map(([key]) => {
      return key;
    });
  const [useGlobal, setUseGlobal] = useState<boolean>(
    selected.indexOf("GQhi6pRnTKF") !== -1
  );
  const [q, setQ] = useState<string>("");
  const paginations = useStore($paginations);

  const {
    pages,
    pagesCount,
    currentPage,
    setCurrentPage,
    isDisabled,
    pageSize,
    setPageSize,
  } = usePagination({
    total: paginations.totalOrganisationUnitLevels,
    limits: {
      outer: OUTER_LIMIT,
      inner: INNER_LIMIT,
    },
    initialState: {
      pageSize: 10,
      currentPage: 1,
    },
  });
  const { isLoading, isSuccess, isError, error, data } =
    useOrganisationUnitLevels(currentPage, pageSize, q);

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  return (
    <Stack spacing="30px">
      <GlobalAndFilter
        denNum={denNum}
        dimension={dimension}
        setDimension={setDimension}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
        type="oul"
        onChange={onChange}
        id={globalIds[4].value}
      />
      {!useGlobal && (
        <Input
          value={q}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
      )}
      {isLoading && (
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {isSuccess && !useGlobal && (
        <Table
          variant="striped"
          size="sm"
          colorScheme="gray"
          textTransform="none"
        >
          <Thead>
            <Tr py={1}>
              <Th>
                <Checkbox />
              </Th>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Id
                </Heading>
              </Th>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Name
                </Heading>
              </Th>
            </Tr>
          </Thead>
          <Tbody py={10}>
            {data.map((record: any) => (
              <Tr key={record.id}>
                <Td>
                  <Checkbox
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        onChange({
                          id: record.id,
                          type: dimension,
                          what: "oul",
                        });
                      } else {
                        onChange({
                          id: record.id,
                          type: dimension,
                          what: "oul",
                          remove: true,
                        });
                      }
                    }}
                    checked={!!denNum?.dataDimensions?.[record.id]}
                  />
                </Td>
                <Td>{record.id}</Td>
                <Td>{record.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {!useGlobal && (
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          isDisabled={isDisabled}
          onPageChange={handlePageChange}
        >
          <PaginationContainer
            align="center"
            justify="space-between"
            p={4}
            w="full"
          >
            <PaginationPrevious
              _hover={{
                bg: "yellow.400",
              }}
              bgColor="yellow.300"
            >
              <Text>Previous</Text>
            </PaginationPrevious>
            <PaginationNext
              _hover={{
                bg: "yellow.400",
              }}
              bgColor="yellow.300"
            >
              <Text>Next</Text>
            </PaginationNext>
          </PaginationContainer>
        </Pagination>
      )}
      {isError && <Box>{error?.message}</Box>}
    </Stack>
  );
};

export default OrganizationUnitLevels;
