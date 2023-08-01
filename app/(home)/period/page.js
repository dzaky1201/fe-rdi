"use client"
import {Typography} from "@mui/material";
import {useEffect} from "react";
import CheckSession from "@/app/(home)/helper";


export default function PeriodPage() {
    useEffect(()=>{
        CheckSession()
    })
    return (
        <Typography className="m-auto">
            Ini adalah period
        </Typography>

    )
}