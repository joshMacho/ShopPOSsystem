import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { formatMoney } from "./Constants";

function Table({ purchases }) {
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", enableClickToCopy: true },
      { accessorKey: "description", header: "Desc" },
      {
        accessorKey: "cost_price",
        header: "Cost Price",
        Cell: ({ cell }) => `GHC ${formatMoney(cell.getValue())}`,
      },
      {
        accessorKey: "selling_price",
        header: "Price",
        Cell: ({ cell }) => `GHC ${formatMoney(cell.getValue())}`,
      },
      { accessorKey: "qnt", header: "Qnt" },
      {
        accessorKey: "subtotal",
        header: "Total",
        Cell: ({ cell }) => `GHC ${formatMoney(cell.getValue())}`,
      },
      {
        accessorKey: "profit",
        header: "Profit",
        Cell: ({ cell }) => `GHC ${formatMoney(cell.getValue())}`,
      },
    ],
    []
  );

  const data = useMemo(() => purchases, [purchases]);
  // const total = useMemo(
  //   () => data.reduce((acc, row) => acc + row.subtotal, 0),
  //   [data]
  // );
  // const profit = useMemo(
  //   () => data.reduce((acc, row) => acc + row.profit, 0),
  //   [data]
  // );
  //console.log(`profit: ${profit}\nTotal: ${total}`);
  //const costPriceSum = useMemo(() => data.reduce((acc, row) => acc + row.cost_price, 0), [data]);

  const table = useMaterialReactTable({
    columns,
    data,
    muiCopyButtonProps: {
      startIcon: <CopyIcon />,
    },
    enableGrouping: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
      columnVisibility: {
        destination: false,
      },
      density: "comfortable",
      expanded: true,
    },
  });

  return (
    <MaterialReactTable
      table={table}
      enableColumnResizing
      enableGrouping
      enableStickyHeader
      enableStickyFooter
      initialState={table.initialState}
      muiToolbarAlertBannerChipProps={{ color: "primary" }}
      muiTableContainerProps={{ sx: { maxHeight: 600, overflow: "auto" } }}
      onPaginationChange={(pageIndex, pageSize) =>
        table.setPageIndex(pageIndex)
      }
      paginationState={{
        pageIndex: table.getState().pagination.pageIndex,
        pageSize: table.getState().pagination.pageSize,
      }}
    />
  );
}

export default Table;
