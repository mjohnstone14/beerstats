import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, Box } from '@mui/material';
import { useAppSelector } from '../hooks';
import { getRGBAArrayForSRM } from '../helpers/InterpolateColors';
import { BeerObject } from '../interfaces/base';
import { beerToBeerObject } from '../features/myBeersSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Doughnut chart that renders
 * a graph that highlights each beer
 * and their IBU
 */
export default function IBUDoughnut() {
  const rawData = useAppSelector((state) => state.myBeers.myList);
  const currentData = rawData.map(beerToBeerObject);

  function createData() {
    const currentLabels: string[] = [];
    const ibus: number[] = [];

    currentData.forEach((beer: BeerObject) => {
        currentLabels.push(beer.name);
        ibus.push(parseInt(beer.ibu));
    });
    
    const srmColors = getRGBAArrayForSRM(currentLabels.length);
    const doughnutData = {
      labels: currentLabels,
      datasets: [{
        label: 'IBU by Beer',
        data: ibus,
        backgroundColor: srmColors,
        borderColor: srmColors,
        borderWidth: 1,
      }],
    };
    return doughnutData;
  }

  const doughnutData = createData();

  return (
    <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
      </Box>
    </Card>
  );
}
