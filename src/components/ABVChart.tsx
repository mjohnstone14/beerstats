import { Bar } from "react-chartjs-2"
import { useAppSelector } from "../hooks";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ABVChart() {
    const currentData: Array<BeerObject> = useAppSelector((state) => state.beers.data);

    function createData() {
        const currentLabels: string[] = [];
        const abvs: number[] = [];
        currentData.forEach((beer: BeerObject) => {
            currentLabels.push(beer.name);
            abvs.push(parseFloat(beer.alcohol));
        });

        const barData = {
            labels: currentLabels,
            datasets: [{
                label: 'ABV by Beer',
                data: abvs,
                backgroundColor: [
                    'rgb(242, 142, 28)'
                ],
                borderColor: [
                    'rgb(0, 0, 0)'
                ],
                borderWidth: 1
            }]
        }
        return barData
    }

    const barData = createData();
    
    return (
        <Card style={{ margin: '3%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Bar data={barData}/>
        </Card>  
    )
}