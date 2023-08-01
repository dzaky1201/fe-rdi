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
import {
    Alert, Autocomplete,
    Button,
    CircularProgress,
    LinearProgress,
    MenuItem,
    TablePagination,
    TextField,
    Typography
} from "@mui/material";
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
import Box from "@mui/material/Box";


export default function OperationalPage() {
    useEffect(() => {
        CheckSession()
    })
    const cookies = parseCookies()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [valueDate, setValueDate] = useState(dayjs());
    const [description, setDescription] = useState("");
    const [selectTypeTransaction, setSelectTypeTransaction] = useState("");
    const [amount, setAmount] = useState("");
    const [yearPeriodID, setYearPeriodID] = useState(0);
    const [periodCollection, setPeriodCollection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorData, setErrorData] = useState(false);


    useEffect(() => {
        if (open) {
            axios.request({
                headers: {
                    'Authorization': `Bearer ${cookies.token}`
                },
                method: 'GET',
                url: `http://localhost:8080/api/v1/periods`,
            }).then(res => {
                if (res.status === 200) {
                    setPeriodCollection(res.data.data_list)
                }
            }).catch(() => {
                setLoading(false)
                setErrorData(true)
            })
        }
    }, [open])

    const addData = () => {
        setErrorData(false)
        setLoading(true)
        axios.request({
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            },
            method: 'POST',
            url: `http://localhost:8080/api/v1/activity/create/operation`,
            data: {
                input_date: valueDate.$d,
                description: description,
                amount: amount,
                type_transaction: selectTypeTransaction,
                year_period_id: yearPeriodID,
            }
        }).then(res => {
            if (res.status === 200) {
                handleClose()
                setValueDate(dayjs())
            }
        }).catch(() => {
            setLoading(false)
            setErrorData(true)
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpen(false);
            setLoading(false)
            setErrorData(false)
            setDescription("")
            setAmount("")
            setSelectTypeTransaction("")
            setYearPeriodID(0)
        }
    };
    const typeTransaction = [
        {
            id: 1,
            value: 'debit',
            label: 'debit',
        },
        {
            id: 2,
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
    const {
        data: dataListTable,
        error: errorListTable,
        isLoading: loadingListTable
    } = useSWR(`http://localhost:8080/api/v1/activity/list/operation?page=${page + 1}&limit=${rowsPerPage}`, fetcher, {refreshInterval: 1000})


    return (
        <>
            {loadingListTable && <Box className={'w-full mb-2'}><LinearProgress className={"bg-orange-500"}/></Box>}
            <Button variant="outlined" onClick={handleClickOpen}>
                Tambah data baru
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle>Tambah data arus kas</DialogTitle>
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
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />
                    <Autocomplete
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        className={"mt-2"}
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => {
                            return (
                                <Box component='li' {...props} key={option.id}>
                                    {option.label}
                                </Box>
                            );
                        }}
                        onChange={(e, type) => {
                            setSelectTypeTransaction(type.value)
                        }}
                        options={typeTransaction}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Pilih Tipe Transaksi"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )}
                    />
                    <TextField id="amount-input" label="Masukan Jumlah" variant="outlined"
                               className="mt-2" value={amount}
                               onChange={(e) => {
                                   setAmount(e.target.value)
                               }}/>
                    <Autocomplete
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        className={"mt-2"}
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => {
                            return (
                                <Box component='li' {...props} key={option.id}>
                                    {option.label}
                                </Box>
                            );
                        }}
                        onChange={(e, period) => {
                            setYearPeriodID(period.id)
                        }}
                        options={periodCollection}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Pilih Periode"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <DatePicker
                            label="Pilih Tanggal"
                            value={valueDate}
                            className="mt-3"
                            format={"DD/MM/YYYY"}
                            onChange={(newValue) => {
                                setValueDate(newValue)
                            }}
                        />

                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Batal</Button>
                    <Button onClick={addData}>Simpan</Button>
                </DialogActions>
                {loading && <CircularProgress/>}
                {errorData && <Alert variant="filled" severity="error">
                    Gagal menambahkan data
                </Alert>}
            </Dialog>
            {dataListTable ? dataListTable.data_list ? <><TableContainer component={Paper} className={"mt-2"}>
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
                            {dataListTable ? dataListTable.data_list.map((res, index) => (
                                <TableRow
                                    key={res.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    onClick={() => {
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
                            )) : <Typography>Error</Typography>}
                        </TableBody>
                    </Table>
                </TableContainer>
                    <TablePagination
                        component="div"
                        count={dataListTable ? dataListTable.count : 10}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /></> : <Typography className={"text-center"}> Tidak Ada data</Typography> :
                <Typography className={"text-center"}>Tunggu sebentar</Typography>}
        </>

    );
}