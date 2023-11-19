import { Bar } from "react-chartjs-2"
import { useAppSelector } from "../hooks";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card } from "@mui/material";
import { getRGBAArrayForSRM } from "../helpers/InterpolateColors";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

/**
 * A bar chart that shows the user each beer and their ABV
 * in with each other, allowing the user a quick view of
 * the different alcohol levels for each
 * 
 * @returns a Chart.js bar chart with the processed data from the initial fetch
 */
export default function ABVChart() {
    const currentData: Array<BeerObject> = useAppSelector((state) => state.beers.data);

    /**
     * This function takes the data from the redux store and processes it
     * so that it can fit within the Chart.js bar component, and styles
     * the graph so that it fits the color scheme of the app
     * 
     * @returns processed data to be used in Chart.js Bar component
     */
    function createData() {
        const currentLabels: string[] = [];
        const abvs: number[] = [];
        
        currentData.forEach((beer: BeerObject) => {
            currentLabels.push(beer.name);
            abvs.push(parseFloat(beer.alcohol));
        });
        
       
        const srmColors = getRGBAArrayForSRM(currentLabels.length);


        const barData = {
            labels: currentLabels,
            datasets: [{
                label: 'ABV by Beer',
                data: abvs,
                backgroundColor: srmColors,
                borderColor: [
                    'rgb(0, 0, 0)'
                ],
                borderWidth: 1
            }]
        };
        return barData;
    }

    const barData = createData();
    
    return (
        <Card style={{ margin: '3%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Bar data={barData}/>
        </Card>  
    )
}