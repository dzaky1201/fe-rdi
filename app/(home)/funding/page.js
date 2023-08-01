"use client"
import {Typography} from "@mui/material";
import {parseCookies} from "nookies";
import {redirect} from "next/navigation";
import {useEffect} from "react";
import CheckSession from "@/app/(home)/helper";


export default function FundingPage() {
    useEffect(()=>{
        CheckSession()
    })
    return (

        <Typography className="m-auto">
            Ini adalah funding
        </Typography>
    )
}