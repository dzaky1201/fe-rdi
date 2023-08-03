import {useEffect, useState} from "react";
import {Chart} from "chart.js/auto";

function formatRupiah(money) {

    return new Intl.NumberFormat('id-ID',
        {style: 'currency', currency: 'IDR'}
    ).format(money);

}
export default function LineChartComponent({report}) {
    const dataArrayMonth = [];
    const dataArrayTotal = [];
    useEffect(() => {
        report.data.allData.map((data)=>{
            dataArrayMonth.push(data.month)
            dataArrayTotal.push(data.total)
        })
        console.log(dataArrayMonth)

        let ctx = document.getElementById('myChart').getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataArrayMonth,
                datasets: [{
                    data: dataArrayTotal,
                    label: "Data Ringkasan",
                    borderColor: "#3e95cd",
                    backgroundColor: "#7bb6dd",
                    fill: false,
                }
                ]
            },
        });
    }, [])
    return (
        <>
            {/* line chart */}
            {/*<h1 className="w-[110px] mx-auto mt-10 text-xl font-semibold capitalize ">line Chart</h1>*/}
            <div className="w-[1100px] h-screen flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
        </>
    )
}