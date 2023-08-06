"use client";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {Alert, Autocomplete, Button, CircularProgress, InputAdornment, LinearProgress, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {parseCookies} from "nookies";
import useSWR, {mutate} from "swr";
import axios from "axios";
import dayjs from "dayjs";


export default function UpdateDialogOperationalComponent({openUpdateDialog, setOpenUpdateDialog, id, setId,status, setStatus}) {
    const cookies = parseCookies()
    const [description, setDescription] = useState("")
    const [selectTypeTransaction, setSelectTypeTransaction] = useState("")
    const [amount, setAmount] = useState(0)
    const [yearPeriodID, setYearPeriodID] = useState(0);
    const [valueDate, setValueDate] = useState(dayjs());
    const [typeTransactionValue, setTypeTransactionValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorData, setErrorData] = useState(false);
    const [valuePeriod, setValuePeriod] = React.useState({id: 0, year: "", month: "", label: ""});
    const [period, setPeriod] = React.useState([]);


    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data: periodCollection,
        isLoading: loadingPeriod,
        error: errorPeriod
    } = useSWR(openUpdateDialog ? `https://test.rumahdermawan.com/api/v1/periods` : "", fetcher)

    const fetcherDetail = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data: detailData,
        isLoading,
        error
    } = useSWR(openUpdateDialog ? `https://test.rumahdermawan.com/api/v1/activity/operation/${id}` : "", fetcherDetail)

    useEffect(() => {
        if (openUpdateDialog) {
            detailData ? setDescription(detailData.data.description) : setDescription("")
            detailData ? setAmount(detailData.data.amount) : setAmount(0)
            detailData ? setValuePeriod({
                id: detailData.data.period.id,
                year: detailData.data.period.year,
                month: detailData.data.period.month,
                label: detailData.data.period.label
            }) : setValuePeriod({
                id: 0,
                year: "",
                month: "",
                label: ""
            })
            periodCollection ? setPeriod(periodCollection.data) : setValuePeriod([])
            detailData ? setSelectTypeTransaction(detailData.data.type_transaction): setSelectTypeTransaction("")
            detailData ? setValueDate(dayjs(detailData.data.input_date, "DD/MM/YYYY")): setValueDate(dayjs)
        }

    }, [openUpdateDialog, detailData, periodCollection])

    const updateData = () => {
        setErrorData(false)
        setLoading(true)
        axios.request({
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            },
            method: 'PUT',
            url: `https://test.rumahdermawan.com/api/v1/activity/update/operation/${id}`,
            data: {
                input_date: dayjs(valueDate.$d).format("DD/MM/YYYY"),
                description: description,
                amount: amount,
                type_transaction: selectTypeTransaction,
                year_period_id: yearPeriodID,
            }
        }).then(res => {
            if (res.status === 200) {
                setLoading(false)
                handleClose()
                setValueDate(dayjs())
                setStatus(res.status)
            }
        }).catch(() => {
            setLoading(false)
            setErrorData(true)
        })
    }
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
    const resetAllValue = () => {
        setId(0)
        setDescription("")
        setAmount("")
        setValuePeriod({
            id: 0,
            year: "",
            month: "",
            label: ""
        })
        setPeriod([])
        setSelectTypeTransaction("")
    }
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenUpdateDialog(false)
            resetAllValue()
        }
    }
    if (periodCollection && detailData) {
        return (
            <>
                <Dialog open={openUpdateDialog} onClose={handleClose} fullWidth={true}>
                    <DialogTitle>Update data arus kas</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Update data operation
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
                            value={selectTypeTransaction}
                            // defaultValue={detailData ? detailData.data ? detailData.data.type_transaction : "" : ""}
                            getOptionLabel={(option) => typeof option.label === 'string'
                            || option.label instanceof String ? option.label : selectTypeTransaction}
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
                            className={"tx-mt-2"}
                            value={valuePeriod.label}
                            // defaultValue={detailData ? detailData.data ? detailData.data.label : "" : ""}
                            getOptionLabel={(option) => typeof option.label === 'string'
                            || option.label instanceof String ? option.label : valuePeriod.label}
                            renderOption={(props, option) => {
                                return (
                                    <Box component='li' {...props} key={option.id}>
                                        {option.label}
                                    </Box>
                                );
                            }}
                            onChange={(e, period) => {
                                setYearPeriodID(period.id)
                                setValuePeriod({
                                    id: period.id,
                                    year: period.year,
                                    month: period.month,
                                    label: period.label
                                })
                            }}
                            options={period}
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
                                // defaultValue={detailData ? detailData.data ? detailData.data.input_value : "" : ""}
                                className="tx-mt-3"
                                format={"DD/MM/YYYY"}
                                onChange={(newValue) => {
                                    setValueDate(newValue)
                                }}
                            />

                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} className={"tx-text-orange-300"}>Batal</Button>
                        <Button onClick={updateData} className={"tx-text-orange-300"}>Update</Button>
                    </DialogActions>
                    {(loading || isLoading) && <CircularProgress/>}
                    {(errorData || error) && <Alert variant="filled" severity="error">
                        Ada kesalahan
                    </Alert>}
                </Dialog>
            </>
        )
    }
    if (isLoading || loadingPeriod) {
        return (
            <>
                <Box className={'tx-w-full tx-mb-2'}><LinearProgress className={"tx-bg-orange-500"}/></Box>
            </>
        )
    }
}