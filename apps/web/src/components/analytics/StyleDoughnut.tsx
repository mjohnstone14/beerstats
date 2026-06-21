import { Doughnut } from 'react-chartjs-2';
import { useAppSelector } from '../../hooks';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, Box, Typography } from '@mui/material';
import { getBeerStyle } from '../../features/myBeersSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StyleDoughnut() {
  const myList = useAppSelector((state) => state.myBeers.myList);

  const styleCounts: Record<string, number> = {};
  myList.forEach((beer) => {
    const style = getBeerStyle(beer);
    styleCounts[style] = (styleCounts[style] || 0) + 1;
  });

  const labels = Object.keys(styleCounts);
  const data = Object.values(styleCounts);

  if (labels.length === 0) return null;

  // Use a warm palette for beer styles
  const baseColors = [
    '#C96E12', '#EC9D00', '#F5C251', '#A85A0E', '#8B4513',
    '#D2B48C', '#DEB887', '#F4A460', '#CD853F', '#D2691E',
  ];

  const bgColors = labels.map((_, i) => baseColors[i % baseColors.length]);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColors,
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
    },
  };

  return (
    <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ color: '#C96E12', fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Style Breakdown
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Doughnut data={chartData} options={options} />
      </Box>
    </Card>
  );
}
