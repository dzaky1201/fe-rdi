"use client";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, LinearProgress, MenuItem, TablePagination, TextField, Typography} from "@mui/material";
import nookies, {parseCookies} from "nookies";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import {DataGrid} from "@mui/x-data-grid";
import {useForm} from "react-hook-form";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useSWR from "swr";
import {redirect} from "next/navigation";
import CheckSession from "@/app/(home)/helper";


export default function OperationalPage() {
    CheckSession()
    const cookies = parseCookies()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [open, setOpen] = useState(false);
    const [valueDate, setValueDate] = useState(dayjs);

    const addData = (e) => {
        axios.request({
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            },
            method: 'POST',
            url: `http://localhost:8080/api/v1/activity/create/operation`,
            data: {
                input_date: e.input_date,
                description: e.description,
                amount: e.amount,
                type_transaction: e.type_transaction,
                year_period_id: e.year_period_id,
            }
        }).then(res => {
            if (res) {
                handleClose()
            }
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const typeTransaction = [
        {
            value: 'debit',
            label: 'debit',
        },
        {
            value: 'credit',
            label: 'credit',
        }
    ]

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const fetcherPeriod = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data: dataListTable,
        error: errorListTable,
        isLoading: loadingListTable
    } = useSWR(`http://localhost:8080/api/v1/activity/list/operation?page=${page + 1}&limit=${rowsPerPage}`, fetcher)

    const {
        data,
        error: errorPeriod,
        isLoading: loadingPeriod
    } = useSWR(`http://localhost:8080/api/v1/periods`, fetcherPeriod)

    console.log(data)
    // console.log(dataPeriod)

    if (errorListTable) return <div>failed to load</div>
    if (loadingListTable) return <LinearProgress className={"bg-orange-500"}/>


    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Tambah data baru
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Tambah data arus kas</DialogTitle>
                <form onSubmit={handleSubmit(addData)}>
                    <DialogContent>
                        <DialogContentText>
                            Masukan data operation
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            {...register("description", {required: true})}
                        />
                        <TextField
                            id="outlined-select-type-transaction"
                            select
                            label="tipe transaksi"
                            defaultValue="debit"
                            helperText="Pilih tipe transaksi"
                            className="mt-2"
                            {...register("type_transaction", {required: true})}
                        >
                            {typeTransaction.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField id="amount-input" label="Masukan Jumlah" variant="outlined"
                                   className="mt-2 ml-2" {...register("amount", {required: true})}/>
                        <TextField
                            id="outlined-select-period"
                            select
                            defaultValue={2}
                            label="periode"
                            helperText="Pilih periode"
                            className=" ml-2 mt-2"
                            {...register("year_period_id", {required: true})}
                        >
                            {data ? data.data_list.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.month} {option.year}
                                </MenuItem>
                            )) : <Typography>Error</Typography>}
                        </TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DatePicker
                                label="Controlled picker"
                                value={valueDate}
                                className="mt-2"
                                onChange={(newValue) => setValueDate(newValue)}
                            />

                        </LocalizationProvider>
                        <TextField
                            id="outlined-select-period"
                            value={valueDate.format('YY-MM-DD')}
                            label="input_date"
                            helperText="Pilih tanggal"
                            className="hidden"
                            {...register("input_date", {required: true})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Batal</Button>
                        <Button type={"submit"}>Simpan</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <TableContainer component={Paper} className={"mt-2"}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tanggal Input</TableCell>
                            <TableCell align="right">Deskripsi</TableCell>
                            <TableCell align="right">Jumlah</TableCell>
                            <TableCell align="right">Tipe Transaksi</TableCell>
                            <TableCell align="right">Periode</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataListTable.data_list.map((res, index) => (
                            <TableRow
                                key={res.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                onClick={()=>{
                                    console.log(index)
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {res.input_date}
                                </TableCell>
                                <TableCell align="right">{res.description}</TableCell>
                                <TableCell align="right">{res.amount}</TableCell>
                                <TableCell align="right">{res.type_transaction}</TableCell>
                                <TableCell align="right">{res.period.month} {res.period.year}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={dataListTable.count}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>

    );
}