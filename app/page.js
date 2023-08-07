"use client";
import {useForm} from "react-hook-form";
import {Button, Card, LinearProgress, TextField, Typography} from "@mui/material";
import Image from "next/image";
import nookies, {parseCookies} from "nookies";
import {useRouter} from "next/navigation";
import {redirect} from 'next/navigation'
import axios from "axios";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";

export default function Home() {

    const router = useRouter();
    const cookies = parseCookies()
    useEffect(() => {
        if (cookies.token) {
            router.replace('/summary')
        }
    }, [cookies.token])
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    const doLogin = (e) => {
        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
            email: e.email,
            password: e.password
        }).then(res => {
            setLoading(false)
            if (res.status === 200){
                nookies.set(null, "token", res.data.data.token);
                router.replace("/summary");
            }

        }).catch(err => {
            setLoading(false)
        })
    }


    return (
        <main
            className="tx-flex tx-flex-col tx-min-h-screen tx-max-h-screen tx-items-center tx-justify-items-start tx-bg-[rgb(255,254,254)]">
            {loading && <Box sx={{width: '100%'}}>
                <LinearProgress className={"tx-bg-orange-500"}/>
            </Box>}
            <Image width={200} height={70} src="/logo-fix.png" className="mt-6" alt={"logo-rdi"} priority={false}></Image>
            <Typography className="tx-text-xl tx-font-semibold tx-mt-6 tx-text-black" variant={"h1"}>
                Sistem Keuangan Rumah Dermawan Indonesia
            </Typography>
            <Card
                className="tx-flex-col tx-box tx-box-border tx-h-[27rem] tx-w-[24.813rem] tx-border-[1px] tx-border-[rgba(0, 0, 0, 0.53)] tx-border-solid tx-bg-white tx-mt-6 tx-rounded-[10px] tx-shadow-[3px_4px_4px_0rgb(0, 0, 0, 0.25)]">
                <Typography variant="h1" className="tx-text-center tx-mt-[26px] tx-text-[23px] tx-font-semibold">
                    Login
                </Typography>
                <form
                    onSubmit={handleSubmit(doLogin)}
                    className="tx-mt-12 tx-flex tx-flex-col tx-gap-4 tx-items-center">


                    <TextField className={"tx-w-[16.25rem]"} id="outlined-basic" label="Email" type={"email"}
                               variant="outlined"  {...register("email", {required: true})} />

                    {errors.email &&
                        <Typography className="tx-text-start tx-text-red-600">Masukan alamat email !</Typography>}

                    <TextField className={"tx-w-[16.25rem]"} id="outlined-basic" label="Password" type={"password"}
                               variant="outlined"  {...register("password", {required: true})} />
                    {errors.password && <Typography className="tx-text-start tx-text-red-600">Masukan password !</Typography>}

                    <Button variant={"contained"} type={"submit"}
                            disabled={(errors.email || errors.password) || (watch("email") === '' || watch("password") === '' || loading) && true}
                            className={`${(errors.email || errors.password) || (watch("email") === '' || watch("password") === '' || loading) ? 'tx-bg-gray-300 tx-text-gray-200': 'tx-bg-orange-500 tx-hover:tx-bg-orange-300'}`}>
                        Login
                    </Button>
                </form>
            </Card>
        </main>
    );
}