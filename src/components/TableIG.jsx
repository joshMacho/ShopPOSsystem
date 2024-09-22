import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { formatMoney } from "./Constants";

function TableIG({ groups }) {
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", enableClickToCopy: true },
      { accessorKey: "total_qnt", header: "Qnt Purchased" },

      {
        accessorKey: "profit",
        header: "Profit Gained",
        Cell: ({ cell }) => `GHC ${formatMoney(cell.getValue())}`,
      },
      {
        accessorKey: "total",
        header: "Total",
        Cell: ({ cell }) => `GHC ${formatMoney(cell.getValue())}`,
      },
    ],
    []
  );

  const data = useMemo(() => groups, [groups]);

  const table = useMaterialReactTable({
    columns,
    data,
    muiCopyButtonProps: {
      startIcon: <CopyIcon />,
    },
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

export default TableIG;
