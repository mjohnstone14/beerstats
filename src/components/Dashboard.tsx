import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard(props: { numBeers?: Number }) {
    let navigate = useNavigate()

    useEffect(() => {
        // navigate to home if user did not provide a number of beers
        if(props.numBeers === undefined) {
            navigate('/')
        }
    }, [props.numBeers])

    return (
        <>
            <h1>Dash</h1>
        </>
    )
}

export default Dashboard