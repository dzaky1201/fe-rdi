"use client"
import {FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {parseCookies} from "nookies";
import {redirect, useRouter} from "next/navigation";
import CheckSession from "@/app/(home)/helper";
import {useEffect, useState} from "react";
import axios from "axios";
import useSWR, {mutate} from "swr";
import LineChartComponent from "@/app/(home)/summary/LineChartComponent";
import Box from "@mui/material/Box";

export default function SummaryPage() {
    useEffect(() => {
        CheckSession()
    })
    const cookies = parseCookies()
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [dataRes, setDataRes] = useState({});
    const fullYear = [];


    for (let i = currentYear; i >= 2022; i--) {
        fullYear.push(i)
    }

    const handleChange = (event) => {
        setYear(event.target.value);

    };

    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR(`http://localhost:8080/api/v1/activity/report?year=${year}`, fetcher)


    if (isLoading) {
        return (
            <Typography className={"text-center my-0"}>Tunggu sebentar ....</Typography>)
    }


    return (
        <>
            <Box className={"flex flex-row justify-center m-3"}>
                <LineChartComponent report={data} year={year}/>
                <FormControl sx={{minWidth: 120}} size="small" className={"ml-2"}>
                    <InputLabel id="demo-select-small-label">Tahun</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={year}
                        label="Tahun"
                        onChange={handleChange}
                    >
                        {fullYear.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </Box>
        </>
    )


}