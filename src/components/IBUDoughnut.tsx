import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from '@mui/material';
import { useAppSelector } from '../hooks';
import { getRGBAArrayForSRM } from '../helpers/InterpolateColors';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Doughnut chart that renders
 * a graph that highlights each beer
 * and their IBU
 */
export default function IBUDoughnut() {
  const currentData: Array<BeerObject> = useAppSelector((state) => state.beers.data);

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
    <Card style={{ margin: '3%', display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '80vh' }}>
      <Doughnut data={doughnutData} />
    </Card>
  );
}
