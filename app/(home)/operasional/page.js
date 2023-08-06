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
    CircularProgress, InputAdornment,
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
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useSWR, {mutate} from "swr";
import CheckSession from "@/app/(home)/helper";
import Box from "@mui/material/Box";
import {useDebounce} from "use-debounce";
import {Delete, KeyboardArrowDown} from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import * as React from "react";
import StyledMenu from "@/app/(home)/_style/MenuStyle";
import UpdateDialogOperationalComponent from "@/app/(home)/operasional/UpdateDialogOperationalComponent";

function formatRupiah(money) {

    return new Intl.NumberFormat('id-ID',
        {style: 'currency', currency: 'IDR'}
    ).format(money);

}


export default function OperationalPage() {
    useEffect(() => {
        CheckSession()
    })
    const cookies = parseCookies()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [valueDate, setValueDate] = useState(dayjs());
    const [description, setDescription] = useState("");
    const [selectTypeTransaction, setSelectTypeTransaction] = useState("");
    const [amount, setAmount] = useState(0);
    const [yearPeriodID, setYearPeriodID] = useState(0);
    const [periodCollection, setPeriodCollection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorData, setErrorData] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedText] = useDebounce(search, 2000);
    const [itemId, setItemId] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [statusUpdate, setStatusUpdate] = useState(0);

    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (open) {
            axios.request({
                headers: {
                    'Authorization': `Bearer ${cookies.token}`
                },
                method: 'GET',
                url: `https://test.rumahdermawan.com/api/v1/periods`,
            }).then(res => {
                if (res.status === 200) {
                    setPeriodCollection(res.data.data)
                }
            }).catch(() => {
                setLoading(false)
                setErrorData(true)
            })
        }
    }, [open])

    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data: dataListTable,
        error: errorListTable,
        isLoading: loadingListTable,
        mutate: mutateData
    } = useSWR(`https://test.rumahdermawan.com/api/v1/activity/list/operation?page=${page + 1}&limit=${rowsPerPage}&description=${debouncedText}`, fetcher)

    useEffect(()=>{
        if (statusUpdate === 200) {
            mutateData({...dataListTable, name: statusUpdate})
            setStatusUpdate(0)
        }
    }, [statusUpdate])



    const addData = () => {
        setErrorData(false)
        setLoading(true)
        axios.request({
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            },
            method: 'POST',
            url: `https://test.rumahdermawan.com/api/v1/activity/create/operation`,
            data: {
                input_date: dayjs(valueDate.$d).format("DD/MM/YYYY"),
                description: description,
                amount: amount,
                type_transaction: selectTypeTransaction,
                year_period_id: yearPeriodID,
            }
        }).then(res => {
            if (res.status === 200) {
                handleClose()
                setValueDate(dayjs())
                mutateData({...dataListTable, name: res.data.data})
            }
        }).catch(() => {
            setLoading(false)
            setErrorData(true)
        })
    }

    const deleteData = () => {
        setErrorData(false)
        setLoading(true)
        axios.request({
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            },
            method: 'DELETE',
            url: `https://test.rumahdermawan.com/api/v1/activity/delete/operation/${itemId}`,
        }).then(res => {
            setLoading(false)
            if (res.status === 200) {
                handleCloseDelete()
                mutateData({...dataListTable, name: res.data.data})
            }
        }).catch(() => {
            setLoading(false)
            setErrorData(true)
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
        handleCloseMenu()
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setItemId(0)
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpen(false);
            setLoading(false)
            setErrorData(false)
            setDescription("")
            setAmount(0)
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



    return (
        <>
            {loadingListTable && <Box className={'tx-w-full tx-mb-2'}><LinearProgress className={"tx-bg-orange-500"}/></Box>}
            <Box className={"tx-flex tx-justify-between"}>
                <TextField id="outlined-search" size={"small"} label="Cari data keuangan" type="search"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                <Button variant="contained" className={"tx-bg-orange-500 tx-hover:tx-bg-orange-400"} size={"small"}
                        onClick={handleClickOpen}>
                    Tambah data baru
                </Button>
            </Box>
            <UpdateDialogOperationalComponent openUpdateDialog={openUpdateDialog} setOpenUpdateDialog={setOpenUpdateDialog}
                                              id={itemId} setId={setItemId} status={statusUpdate} setStatus={setStatusUpdate}/>
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
                        className={"tx-mt-2"}
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
                               className="tx-mt-2" value={amount}
                               onChange={(e) => {
                                   setAmount(e.target.value)
                               }}
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                               }}

                    />
                    <Autocomplete
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        disabled={periodCollection === null && true}
                        className={"tx-mt-2"}
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
                                label={periodCollection === null ? "Buat periode terlebih dahulu !" : "Pilih Periode"}
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
                            className="tx-mt-3"
                            format={"DD/MM/YYYY"}
                            onChange={(newValue) => {
                                setValueDate(newValue)
                            }}
                        />

                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Batal</Button>
                    <Button disabled={periodCollection === null && true} onClick={addData}>Simpan</Button>
                </DialogActions>
                {loading && <CircularProgress/>}
                {errorData && <Alert variant="filled" severity="error">
                    Gagal menambahkan data
                </Alert>}
            </Dialog>
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Apakah anda yakin ingin Menghapus data ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Jika sudah yakin silahkan klik ya
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} autoFocus>
                        Tidak
                    </Button>
                    <Button onClick={deleteData}>Ya</Button>
                </DialogActions>
            </Dialog>
            {dataListTable ? dataListTable.data ? <><TableContainer component={Paper} className={"tx-mt-2"}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead className={"tx-bg-gray-100"}>
                            <TableRow>
                                <TableCell>Tanggal Input</TableCell>
                                <TableCell align="left">Deskripsi</TableCell>
                                <TableCell align="left">Jumlah</TableCell>
                                <TableCell align="left">Tipe Transaksi</TableCell>
                                <TableCell align="left">Periode</TableCell>
                                <TableCell align="center">Action</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataListTable ? dataListTable.data.map((res, index) => (
                                <TableRow
                                    key={res.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {res.input_date}
                                    </TableCell>
                                    <TableCell align="left">{res.description}</TableCell>
                                    <TableCell align="left">{formatRupiah(res.amount)}</TableCell>
                                    <TableCell align="left">{res.type_transaction}</TableCell>
                                    <TableCell align="left">{res.period.month} {res.period.year}</TableCell>
                                    <TableCell align="center">

                                        <Button
                                            id="demo-customized-button"
                                            aria-controls={openMenu ? 'demo-customized-menu' : undefined}
                                            aria-haspopup="true"
                                            className={"tx-bg-orange-500 tx-hover:tx-bg-orange-400"}
                                            aria-expanded={openMenu ? 'true' : undefined}
                                            variant="contained"
                                            disableElevation
                                            onClick={(event) => {
                                                handleClickMenu(event)
                                                setItemId(res.id)
                                            }}
                                            endIcon={<KeyboardArrowDown/>}
                                        >
                                            Actions
                                        </Button>
                                        <StyledMenu
                                            id="demo-customized-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'demo-customized-button',
                                            }}
                                            anchorEl={anchorEl}
                                            open={openMenu}
                                            onClose={handleCloseMenu}
                                        >
                                            <MenuItem onClick={() => {
                                                setOpenUpdateDialog(true)
                                                handleCloseMenu()
                                            }} disableRipple>
                                                <EditIcon/>
                                                Edit
                                            </MenuItem>
                                            <MenuItem onClick={handleClickOpenDelete} disableRipple>
                                                <Delete/>
                                                Delete
                                            </MenuItem>
                                        </StyledMenu>

                                    </TableCell>
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
                    /></> : <Typography className={"tx-text-center tx-mt-80"}> Tidak Ada data</Typography> :
                <Typography className={"tx-text-center tx-mt-80"}>Tunggu sebentar</Typography>}
        </>

    );
}