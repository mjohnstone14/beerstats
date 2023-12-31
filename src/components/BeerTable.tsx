import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  tableCellClasses,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../hooks";

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'style', label: 'Style', minWidth: 100 },
  { id: 'ibu', label: 'IBU', minWidth: 100 },
  { id: 'alcohol', label: 'ABV', minWidth: 100 },
  { id: 'malts', label: 'Malts', minWidth: 170 },
  { id: 'hop', label: 'Hop', minWidth: 170 },
  { id: 'yeast', label: 'Yeast', minWidth: 170 },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

/**
 * Styled MUI table that shows details on each beer and relevant information
 * regarding them. It uses the fetched data from the user's initial dispatch
 * for a certain number of beers
 * 
 * @returns a table showing the data the user reuquested
 */
export default function BeerTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const currentData: Array<BeerObject> = useAppSelector((state) => state.beers.data);

  function createData(): Data[] {
    const beerEntries: Data[] = [];

    currentData.forEach((beer: BeerObject) => {
      beerEntries.push({
        name: beer.name,
        style: beer.style,
        ibu: beer.ibu,
        alcohol: beer.alcohol,
        malts: beer.malts,
        hop: beer.hop,
        yeast: beer.yeast,
      });
    });

    return beerEntries;
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const beerData: Data[] = createData();

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {beerData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((beerRow) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={beerRow.name + beerRow.style + beerRow.ibu}>
                    {columns.map((column) => {
                      const value = beerRow[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={beerData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
