import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '../../hooks';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, Box, Typography } from '@mui/material';
import { calculateRGBA } from '../../helpers/InterpolateColors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ColorSpectrumChart() {
  const myList = useAppSelector((state) => state.myBeers.myList);

  const dataPoints = myList
    .filter((beer) => beer.srm != null || beer.ebc != null)
    .map((beer) => {
      // Some beers have only EBC or only SRM. SRM = EBC / 1.97
      const srm = beer.srm ?? (beer.ebc ? beer.ebc / 1.97 : 0);
      return {
        name: beer.name,
        srm: srm,
        color: calculateRGBA(Math.min(srm, 40)), // clamp to max 40 for color scale
      };
    })
    .sort((a, b) => a.srm - b.srm); // Sort from light to dark

  if (dataPoints.length === 0) return null;

  const chartData = {
    labels: dataPoints.map((dp) => dp.name),
    datasets: [
      {
        label: 'SRM (Color)',
        data: dataPoints.map((dp) => dp.srm),
        backgroundColor: dataPoints.map((dp) => dp.color),
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 4,
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
          label: (context: any) => `SRM: ${context.raw.toFixed(1)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          // Hide labels if too many to prevent crowding
          display: dataPoints.length <= 15,
        },
      },
      y: {
        title: { display: true, text: 'SRM Rating' },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ color: '#C96E12', fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Beer Color Spectrum
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Card>
  );
}
