import { useMemo } from 'react';
import { Box, Chip, IconButton, Tooltip, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import { UnifiedBeer } from '../../interfaces/base';
import { useAppSelector } from '../../hooks';

interface BeerSearchTableProps {
  searchResults: UnifiedBeer[];
  onAdd: (beer: UnifiedBeer) => void;
  onViewDetail: (beer: UnifiedBeer) => void;
}

export default function BeerSearchTable({ searchResults, onAdd, onViewDetail }: BeerSearchTableProps) {
  const myList = useAppSelector((state) => state.myBeers.myList);

  const colDefs = useMemo<ColDef<UnifiedBeer>[]>(() => [
    {
      headerName: 'Source',
      field: 'source',
      width: 100,
      cellRenderer: (params: ICellRendererParams<UnifiedBeer>) => {
        const source = params.value;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip
              label={source === 'punk' ? 'BrewDog' : 'US Craft'}
              size="small"
              sx={{
                background: source === 'punk' ? 'rgba(0,183,255,0.1)' : 'rgba(76,175,80,0.1)',
                color: source === 'punk' ? '#007eb3' : '#2e7d32',
                fontSize: '0.65rem',
                height: 20,
                fontWeight: 700,
              }}
            />
          </Box>
        );
      },
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams<UnifiedBeer>) => {
        const beer = params.data;
        if (!beer) return null;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', '&:hover': { color: '#C96E12' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              onClick={() => onViewDetail(beer)}
            >
              {beer.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerName: 'Brewery / Location',
      flex: 1.2,
      minWidth: 180,
      cellRenderer: (params: ICellRendererParams<UnifiedBeer>) => {
        const beer = params.data;
        if (!beer) return null;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {beer.brewery}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', lineHeight: 1, mt: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {beer.location || 'Unknown'}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerName: 'Style',
      field: 'style',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: ICellRendererParams<UnifiedBeer>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" sx={{ color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {params.value}
            </Typography>
          </Box>
        );
      }
    },
    {
      headerName: 'ABV / IBU',
      width: 100,
      cellRenderer: (params: ICellRendererParams<UnifiedBeer>) => {
        const beer = params.data;
        if (!beer) return null;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#C96E12', fontWeight: 600, lineHeight: 1.2 }}>
              {beer.abv ? `${beer.abv}%` : '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)', lineHeight: 1 }}>
              {beer.ibu ? `IBU ${beer.ibu}` : '—'}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<UnifiedBeer>) => {
        const beer = params.data;
        if (!beer) return null;
        const added = myList.some((b) => String(b.id) === String(beer.id));
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => onViewDetail(beer)} sx={{ color: '#555' }}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={added ? 'Already in your list' : 'Add to My Beers'}>
              <span>
                <IconButton
                  size="small"
                  disabled={added}
                  onClick={() => onAdd(beer)}
                  sx={{
                    background: added ? 'rgba(201,110,18,0.2)' : 'rgba(201,110,18,0.15)',
                    color: added ? 'rgba(201,110,18,0.5)' : '#C96E12',
                    '&:hover': { background: 'rgba(201,110,18,0.3)' },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ], [myList, onAdd, onViewDetail]);

  if (searchResults.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'rgba(0,0,0,0.5)' }}>
        No beers found matching your search.
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', height: 600, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          theme="legacy"
          rowData={searchResults}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={25}
          paginationPageSizeSelector={[10, 25, 50]}
          rowHeight={60}
          headerHeight={48}
          suppressCellFocus={true}
        />
      </div>
    </Paper>
  );
}
