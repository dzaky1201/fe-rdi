"use client"
import {Typography} from "@mui/material";
import {useEffect} from "react";
import CheckSession from "@/app/(home)/helper";


export default function AccountPage() {
    useEffect(()=>{
        CheckSession()
    })
    return (
        <Typography className="m-auto">
            Ini adalah Account
        </Typography>

    )
}