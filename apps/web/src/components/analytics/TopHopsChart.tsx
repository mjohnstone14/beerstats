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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopHopsChart() {
  const myList = useAppSelector((state) => state.myBeers.myList);

  const hopCounts: Record<string, number> = {};
  myList.forEach((beer) => {
    if (beer.ingredients && beer.ingredients.hops) {
      beer.ingredients.hops.forEach((hop) => {
        hopCounts[hop.name] = (hopCounts[hop.name] || 0) + 1;
      });
    }
  });

  const sortedHops = Object.entries(hopCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // top 10

  if (sortedHops.length === 0) return null;

  const chartData = {
    labels: sortedHops.map((h) => h[0]),
    datasets: [
      {
        label: 'Number of Beers',
        data: sortedHops.map((h) => h[1]),
        backgroundColor: 'rgba(201, 110, 18, 0.7)',
        borderColor: '#C96E12',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' },
        title: { display: true, text: 'Frequency' },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ color: '#C96E12', fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Top 10 Most Used Hops
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Card>
  );
}
