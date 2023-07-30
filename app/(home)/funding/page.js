import {Typography} from "@mui/material";
import {parseCookies} from "nookies";
import {redirect} from "next/navigation";


export default function FundingPage() {
    const cookies = parseCookies()
    console.log(cookies)
    return (

        <Typography className="m-auto">
            Ini adalah funding
        </Typography>
    )
}