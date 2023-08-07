import {useEffect, useState} from "react";
import axios from "axios";
import useSWR from "swr";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";

export default function PeriodCreateComponent({openCreateDialog, setOpenCreateDialog, token, setStatus}) {
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setYear('')
            setMonth('')
            setOpenCreateDialog(false)
        }
    }

    const updateData = () => {
        axios.request({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/period/create`,
            data: {
                year: year,
                month: month,
            }
        }).then(res => {
            if (res.status === 200) {
                handleClose()
                setYear('')
                setMonth('')
                setStatus(res.status)
            }
        })
    }


    return (
        <>
            <Dialog open={openCreateDialog} onClose={handleClose} fullWidth={true}>
                <DialogTitle>create periode</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create periode
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
                    <Button onClick={updateData}>Buat</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}