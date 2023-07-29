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
import {TablePagination, Typography} from "@mui/material";
import {parseCookies} from "nookies";


export default function OperationalPage() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataRes, setDataRes] = useState({});

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const cookies = parseCookies()
        axios.request({
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            },
            method: 'GET',
            url: `http://localhost:8080/api/v1/activity/list/operation?page=${page + 1}&limit=${rowsPerPage}`
        }).then(res => {
            setDataRes(res)
            console.log(res)
        })
    }, [page, rowsPerPage])


    return (
        <Paper>
            <TableContainer>
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
                        {dataRes.data ? dataRes.data.data_list.map((res) => (
                            <TableRow
                                key={res.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
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
                count={dataRes.data ? dataRes.data.count : 10}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>


    );
}