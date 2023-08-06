'use client'
import {FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {parseCookies} from "nookies";
import CheckSession from "@/app/(home)/helper";
import axios from "axios";
import useSWR, {mutate} from "swr";
import LineChartComponent from "@/app/(home)/summary/LineChartComponent";
import Box from "@mui/material/Box";
import * as React from "react";

export default function SummaryPage() {
    React.useEffect(() => {
        CheckSession()
    })
    const cookies = parseCookies()
    const currentYear = new Date().getFullYear();
    const [year, setYear] = React.useState(currentYear);

    const handleChange = (event) => {
        setYear(event.target.value);

    };

    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR(`https://test.rumahdermawan.com/api/v1/activity/report?year=${year}`, fetcher)

    const fetcherFullYear = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data: dataYears,
        error: errorYear,
        isLoading: loadingYear,
    } = useSWR(`https://test.rumahdermawan.com/api/v1/period/years`, fetcherFullYear)


    if (!data || isLoading || !dataYears) {
        return (
            <Typography className={"tx-text-center tx-my-0"}>Tunggu sebentar ....</Typography>)
    }
    if (dataYears.data === null) {
        return (
            <>
                <Typography className={"tx-text-center"}>Tidak ada data</Typography>
            </>
        )
    }


    if (data.data.allData === null && dataYears) {
        return (
           <>
               <Box className={"tx-flex tx-justify-between"}>
                   <Typography className={"tx-text-center tx-my-0 tx-basis-3/4"}>Tidak ada data</Typography>
                   <FormControl sx={{minWidth: 120}} size="small">
                       <InputLabel id="demo-select-small-label">Tahun</InputLabel>
                       <Select
                           labelId="demo-select-small-label"
                           id="demo-select-small"
                           value={year}
                           label="Tahun"
                           onChange={handleChange}
                       >
                           {dataYears.data.map((res) => (
                               <MenuItem key={res.year} value={res.year}>{res.year}</MenuItem>
                           ))}

                       </Select>
                   </FormControl>
               </Box>
           </>
        )
    }

    if (data && dataYears){
        return (
            <>
                <Box className={"tx-flex tx-flex-row tx-justify-center tx-m-3"}>
                    <LineChartComponent report={data} year={year}/>
                    <FormControl sx={{minWidth: 120}} size="small" className={"tx-ml-2"}>
                        <InputLabel id="demo-select-small-label">Tahun</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={year}
                            label="Tahun"
                            onChange={handleChange}
                        >
                            {dataYears.data.map((res) => (
                                <MenuItem key={res.year} value={res.year}>{res.year}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
            </>
        )
    }


}