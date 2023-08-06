import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {Button} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import axios from "axios";

export default function PeriodDeleteComponent({idPeriod, openDeleteDialog, setOpenDeleteDialog, token, setStatus}) {
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenDeleteDialog(false)
        }
    }

    const deleteData = () => {
        axios.request({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'DELETE',
            url: `https://test.rumahdermawan.com/api/v1/period/delete/${idPeriod}`,
        }).then(res => {
            if (res.status === 200) {
                handleClose()
                setStatus(res.status)
                console.log("berhasil hapus")
            }
        })
    }
    return (
        <>
            <Dialog
                open={openDeleteDialog}
                onClose={handleClose}
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
                    <Button onClick={handleClose} autoFocus>
                        Tidak
                    </Button>
                    <Button onClick={deleteData}>Ya</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}