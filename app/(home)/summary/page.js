"use client"
import {Typography} from "@mui/material";
import {parseCookies} from "nookies";
import {redirect, useRouter} from "next/navigation";
import CheckSession from "@/app/(home)/helper";
import {useEffect, useState} from "react";
import axios from "axios";
import useSWR, {mutate} from "swr";
import {BarChart} from "@mui/x-charts";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Bar} from "react-chartjs-2";
import LineChartComponent from "@/app/(home)/summary/LineChartComponent";

export default function SummaryPage() {
    useEffect(() => {
        CheckSession()
    })
    const cookies = parseCookies()
    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data,
        error,
        isLoading
    } = useSWR(`http://localhost:8080/api/v1/activity/report?year=2023`, fetcher)

    if (isLoading) {
        return <Typography className={"text-center my-0"}>Tunggu sebentar ....</Typography>
    }

    if (data) {
        return (
            <>
                <LineChartComponent report={data}/>
            </>
        )
    }



}