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
    }, [])
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    const doLogin = (e) => {
        setLoading(true)
        axios.post('http://localhost:8080/api/v1/user/login', {
            email: e.email,
            password: e.password
        }).then(res => {
            setLoading(false)
            nookies.set(null, "token", res.data.data_list.token);
            router.replace("/summary");
        }).catch(err => {
            setLoading(false)
        })
    }


    return (
        <main
            className="flex flex-col min-h-screen max-h-screen items-center justify-items-start bg-[rgb(255,254,254)]">
            {loading && <Box sx={{width: '100%'}}>
                <LinearProgress className={"bg-orange-500"}/>
            </Box>}
            <Image width={200} height={70} src="/logo-fix.png" className="mt-6" alt={"logo-rdi"}></Image>
            <Typography className="text-xl font-semibold mt-6 text-black" variant={"h1"}>
                Sistem Keuangan Rumah Dermawan Indonesia
            </Typography>
            <Card
                className="flex-col box box-border h-[27rem] w-[24.813rem] border-[1px] border-[rgba(0, 0, 0, 0.53)] border-solid bg-white mt-6 rounded-[10px] shadow-[3px_4px_4px_0pxrgba(0, 0, 0, 0.25)]">
                <Typography variant="h1" className="text-center mt-[26px] text-[23px] font-semibold">
                    Login
                </Typography>
                <form
                    onSubmit={handleSubmit(doLogin)}
                    className="mt-12 flex flex-col gap-4 items-center">


                    <TextField className={"w-[16.25rem]"} id="outlined-basic" label="Email" type={"email"}
                               variant="outlined"  {...register("email", {required: true})} />

                    {errors.email &&
                        <Typography className="text-start text-red-600">Masukan alamat email !</Typography>}

                    <TextField className={"w-[16.25rem]"} id="outlined-basic" label="Password" type={"password"}
                               variant="outlined"  {...register("password", {required: true})} />
                    {errors.password && <Typography className="text-start text-red-600">Masukan password !</Typography>}

                    <Button variant={"contained"} type={"submit"}
                            disabled={(errors.email || errors.password) || (watch("email") === '' || watch("password") === '') && true}
                            className="bg-orange-500 hover:bg-orange-300">
                        Login
                    </Button>
                </form>
            </Card>
        </main>
    );
}