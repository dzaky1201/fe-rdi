"use client"
import {Typography} from "@mui/material";
import {parseCookies} from "nookies";
import {redirect, useRouter} from "next/navigation";
import CheckSession from "@/app/(home)/helper";


export default function SummaryPage() {
    CheckSession()
    return (
        <Typography className="m-auto">
            Ini adalah Summary
        </Typography>
    )
}