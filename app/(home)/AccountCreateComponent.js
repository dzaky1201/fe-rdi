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

export default function AccountCreateComponent({openCreateDialog, setOpenCreateDialog, token, setStatus}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setName('')
            setEmail('')
            setOpenCreateDialog(false)
        }
    }

    const registerUser = () => {
        axios.request({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            url: `https://test.rumahdermawan.com/api/v1/user/register`,
            data: {
                name: name,
                email: email,
                password: password
            }
        }).then(res => {
            if (res.status === 200) {
                handleClose()
                setName('')
                setEmail('')
                setStatus(res.status)
            }
        })
    }


    return (
        <>
            <Dialog open={openCreateDialog} onClose={handleClose} fullWidth={true}>
                <DialogTitle>tambah user</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nama"
                        label="Nama"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="email"
                        type={"email"}
                        className={"tx-mx-2"}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="password"
                        type={"password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Batal</Button>
                    <Button onClick={registerUser}>Buat</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}