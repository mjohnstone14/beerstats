import { useMemo } from 'react';
import { Paper, Box } from "@mui/material";
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import { useAppSelector } from "../hooks";
import { Data, BeerObject } from "../interfaces/base";

/**
 * Styled AG Grid table that shows details on each beer and relevant information
 * regarding them. It uses the fetched data from the user's initial dispatch
 * for a certain number of beers
 * 
 * @returns a table showing the data the user reuquested
 */
export default function BeerTable() {
  const currentData: Array<BeerObject> = useAppSelector((state) => state.beers.data);

  const beerData: Data[] = useMemo(() => {
    return currentData.map((beer: BeerObject) => ({
      name: beer.name,
      style: beer.style,
      ibu: beer.ibu,
      alcohol: beer.alcohol,
      malts: beer.malts,
      hop: beer.hop,
      yeast: beer.yeast,
    }));
  }, [currentData]);

  const colDefs = useMemo<ColDef<Data>[]>(() => [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 170 },
    { field: 'style', headerName: 'Style', minWidth: 100 },
    { field: 'ibu', headerName: 'IBU', minWidth: 100 },
    { field: 'alcohol', headerName: 'ABV', minWidth: 100 },
    { field: 'malts', headerName: 'Malts', flex: 1, minWidth: 170 },
    { field: 'hop', headerName: 'Hop', flex: 1, minWidth: 170 },
    { field: 'yeast', headerName: 'Yeast', flex: 1, minWidth: 170 },
  ], []);

  return (
    <Paper sx={{ width: '100%', height: 440, overflow: 'hidden' }}>
      <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          theme="legacy"
          rowData={beerData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          rowHeight={48}
          headerHeight={48}
          suppressCellFocus={true}
        />
      </div>
    </Paper>
  );
}
