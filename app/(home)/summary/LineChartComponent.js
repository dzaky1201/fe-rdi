import {useEffect   } from "react";
import {Chart} from "chart.js/auto";

let myChart = null;
export default function LineChartComponent({report,year}) {
    const dataArrayMonth = [];
    const dataArrayTotal = [];
    useEffect(() => {
        report.data.allData.map((data)=>{
            dataArrayMonth.push(data.month)
            dataArrayTotal.push(data.total)
        })
        console.log(report)

        let ctx = document.getElementById('myChart').getContext('2d');
        const config = {
            type: 'line',
            data: {
                labels: dataArrayMonth,
                datasets: [{
                    data: dataArrayTotal,
                    label: `Data kas ${year}`,
                    borderColor: "#3e95cd",
                    backgroundColor: "#7bb6dd",
                    fill: false,
                }
                ]
            },
        }
        if (myChart !== null){
            myChart.destroy()
        }
        myChart = new Chart(ctx, config);

    }, [report])
    return (
        <>
            <div className="tx-w-full tx-h-screen">
                <div className='tx-border tx-border-gray-400 tx-pt-0 tx-rounded-xl  tx-w-full tx-h-max tx-shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
        </>
    )
}