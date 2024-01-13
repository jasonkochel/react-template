import {
  ActionIcon,
  Flex,
  Group,
  Menu,
  Pagination,
  ScrollArea,
  SegmentedControl,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
import { MdFilterAlt } from "react-icons/md";

const pageSizeAsInt = (val) => (val == "All" ? Number.MAX_SAFE_INTEGER : Number(val));
const pageSizeAsString = (val) => (val == Number.MAX_SAFE_INTEGER ? "All" : val.toString());

const FilterMenu = ({ column }) => {
  const filterValues = column.columnDef.metadata?.filterValues ?? Array.from(column.getFacetedUniqueValues().keys());

  return (
    <Menu
      position="bottom-start"
      ml="md"
      styles={(theme) => ({
        dropdown: {
          backgroundColor: theme.colors.green[0],
        },
      })}
    >
      <Menu.Target>
        <ActionIcon variant="outline" color="brand">
          <MdFilterAlt />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <ScrollArea.Autosize mah={400}>
          <Menu.Item onClick={() => column.setFilterValue("")}>
            <i>Show All</i>
          </Menu.Item>
          {filterValues.sort().map((value, i) => (
            <Menu.Item key={i} onClick={() => column.setFilterValue(value)}>
              {value}
            </Menu.Item>
          ))}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

const DataTable = ({
  data,
  columns,
  title,
  fontSize = "md",
  initialSort,
  rightSection,
  onClickRow,
  pageIndex = 0,
  onChangePage,
  searchable = false,
  showPagination = true,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const [pageSize, setPageSize] = useState(pageSizeAsInt(localStorage.getItem("pageSize") ?? 25));

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination: { pageIndex, pageSize } },
    initialState: {
      sorting: initialSort ?? [],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSortingRemoval: false,
    enableRowSelection: !!onClickRow,
    enableMultiRowSelection: false,
  });

  const handleClickRow = (row) => {
    if (onClickRow) {
      row.toggleSelected(true);
      onClickRow(row.original);
    }
  };

  const totalWidth = columns.reduce((acc, col) => acc + (col.metadata?.width ?? 1), 0);

  return (
    <>
      {(title || searchable) && (
        <Group px={0} mx={0} mb={10} position="apart">
          {typeof title == "string" ? <Title order={2}>{title}</Title> : title}
          <Group>
            {searchable && (
              <TextInput
                placeholder="Search"
                icon={<FaSearch />}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.currentTarget.value)}
                rightSection={<FaTimes color="#ADB5BD" onClick={() => setGlobalFilter("")} />}
              />
            )}
            {rightSection}
          </Group>
        </Group>
      )}
      <Table className="datatable" fontSize={fontSize} highlightOnHover>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: `${(header.column.columnDef.metadata?.width / totalWidth) * 100}%` }}
                >
                  {header.isPlaceholder ? null : (
                    <Group spacing={4} noWrap position={header.column.columnDef.metadata?.align ?? "left"}>
                      <Group
                        spacing={4}
                        noWrap
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <FaChevronUp size="0.5em" />,
                          desc: <FaChevronDown size="0.5em" />,
                        }[header.column.getIsSorted()] ?? null}
                      </Group>
                      {header.column.columnDef.metadata?.filter && <FilterMenu column={header.column} />}
                    </Group>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleClickRow(row)}
              style={{
                backgroundColor: row.getIsSelected() ? "lightgray" : "white",
                cursor: row.getCanSelect() ? "pointer" : "default",
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} align={cell.column.columnDef.metadata?.align ?? "left"}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {showPagination && data.length > 0 && (
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "sm", sm: "lg" }}
          justify={{ sm: "center" }}
          position="center"
          align="center"
          mt={20}
        >
          <Pagination value={pageIndex + 1} onChange={(p) => onChangePage(p - 1)} total={table.getPageCount()} />
          <Group>
            <Text ml="xl">Rows per Page</Text>
            <SegmentedControl
              value={pageSizeAsString(pageSize)}
              onChange={(val) => {
                const pageSize = pageSizeAsInt(val);
                localStorage.setItem("pageSize", pageSize);
                setPageSize(pageSize);
              }}
              data={["25", "50", "100", "All"]}
            />
          </Group>
        </Flex>
      )}
    </>
  );
};

export default DataTable;
