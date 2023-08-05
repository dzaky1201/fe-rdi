"use client"
import {Typography} from "@mui/material";
import {useEffect} from "react";
import CheckSession from "@/app/(home)/helper";
import PeriodListComponent from "@/app/(home)/period/component/PeriodListComponent";


export default function PeriodPage() {
    useEffect(() => {
        CheckSession()
    })
    return (
        <>
            <PeriodListComponent/>
        </>

    )
}