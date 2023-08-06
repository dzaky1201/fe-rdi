import axios from "axios";
import useSWR from "swr";
import {Button, TextField} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

export default function PeriodUpdateComponent({idPeriod, openUpdateDialog, setOpenUpdateDialog, token, setStatus}) {
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenUpdateDialog(false)
        }
    }

    const updateData = () => {
        axios.request({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'PUT',
            url: `https://test.rumahdermawan.com/api/v1/period/update/${idPeriod}`,
            data: {
                year: year,
                month: month,
            }
        }).then(res => {
            if (res.status === 200) {
                handleClose()
                setStatus(res.status)
            }
        })
    }

    const fetcherDetail = url => axios.get(url, {headers: {Authorization: `Bearer ${token}`}}).then(res => res.data)
    const {
        data,
        isLoading,
        error
    } = useSWR(openUpdateDialog ? `https://test.rumahdermawan.com/api/v1/period/${idPeriod}` : "", fetcherDetail)
    useEffect(() => {
        if (!data || isLoading) {
            setYear('')
            setMonth('')
        } else {
            setYear(data.data.year)
            setMonth(data.data.month)
        }
    }, [data])

    return (
        <>
            <Dialog open={openUpdateDialog} onClose={handleClose} fullWidth={true}>
                <DialogTitle>Update periode</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update periode
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="year"
                        label="Tahun"
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="month"
                        label="Bulan"
                        className={"tx-mx-2"}
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Batal</Button>
                    <Button onClick={updateData}>Update</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}