import { Scatter } from 'react-chartjs-2';
import { useAppSelector } from '../../hooks';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function ABVvsIBUScatter() {
  const myList = useAppSelector((state) => state.myBeers.myList);

  const dataPoints = myList
    .filter((beer) => beer.abv != null && beer.ibu != null)
    .map((beer) => ({
      x: beer.ibu,
      y: beer.abv,
      beerName: beer.name,
    }));

  const chartData = {
    datasets: [
      {
        label: 'Beers',
        data: dataPoints,
        backgroundColor: '#C96E12',
        borderColor: '#a85a0e',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const pt = context.raw;
            return `${pt.beerName}: ${pt.y}% ABV, ${pt.x} IBU`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'IBU (Bitterness)' },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: {
        title: { display: true, text: 'ABV (%)' },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  if (dataPoints.length === 0) return null;

  return (
    <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ color: '#C96E12', fontWeight: 700, mb: 2, textAlign: 'center' }}>
        ABV vs IBU Matrix
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Scatter data={chartData} options={options} />
      </Box>
    </Card>
  );
}
