import axios from "axios";
import useSWR from "swr";
import {useEffect, useState} from "react";
import CheckSession from "@/app/(home)/helper";
import {parseCookies} from "nookies";
import {Button, FormControl, InputLabel, MenuItem, Select, TablePagination, Typography} from "@mui/material";
import * as React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Delete, KeyboardArrowDown} from "@mui/icons-material";
import StyledMenu from "@/app/(home)/_style/MenuStyle";
import EditIcon from "@mui/icons-material/Edit";
import PeriodDeleteComponent from "@/app/(home)/period/component/PeriodDeleteComponent";
import PeriodUpdateComponent from "@/app/(home)/period/component/PeriodUpdateComponent";
import PeriodCreateComponent from "@/app/(home)/period/component/PeriodCreateComponent";
import Box from "@mui/material/Box";

export default function PeriodListComponent() {
    const cookies = parseCookies()
    const [page, setPage] = useState(0)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [status, setStatus] = useState(0)
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState('')
    const [idPeriod, setIdPeriod] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deletePermission, setDeletePermission] = useState(0);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleChange = (event) => {
        setYear(event.target.value);

    };
    const fetcher = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR(year !== '' ? `http://localhost:8080/api/v1/periods?year=${year}` : `http://localhost:8080/api/v1/periods`, fetcher)

    const fetcherFullYear = url => axios.get(url, {headers: {Authorization: `Bearer ${cookies.token}`}}).then(res => res.data)
    const {
        data: dataYears,
        error: errorYear,
        isLoading: loadingYear,
        mutate: mutateYears
    } = useSWR(`http://localhost:8080/api/v1/period/years`, fetcherFullYear)

    useEffect(() => {
        if (status === 200) {
            mutateYears({...dataYears, name: status})
            mutate({...data, name: status})
            setYear(currentYear)
            setStatus(0)
        }
    }, [status])

    if ((!data || isLoading) && (!dataYears || loadingYear) || data === undefined || data.data === null || dataYears === undefined ||dataYears.data === null) {
        return (
            <>
                <Box className={"flex flex-col"}>
                    <Button variant="contained" className={"bg-orange-500 hover:bg-orange-400 w-fit"} size={"small"}
                            onClick={() => {
                                setOpenCreateDialog(true)
                            }}>
                        Tambah data baru
                    </Button>
                    <Typography className={"text-center"}>Tidak ada data</Typography>
                </Box>
                <PeriodCreateComponent openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog}
                                       token={cookies.token} setStatus={setStatus}/>
            </>
        )
    }

    if ((data || true) && (dataYears || true)) {
        return (
            <>
                <Box className={"flex"}>
                    <Button variant="contained" className={"bg-orange-500 hover:bg-orange-400"} size={"small"}
                            onClick={() => {
                                setOpenCreateDialog(true)
                            }}>
                        Tambah data baru
                    </Button>
                    <FormControl sx={{minWidth: 120}} size="small" className={"ml-2"}>
                        <InputLabel id="demo-select-small-label">Tahun</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={year}
                            label="Tahun"
                            onChange={handleChange}
                        >
                            {dataYears.data.map((res) => (
                                <MenuItem key={res.year} value={res.year}>{res.year}</MenuItem>
                            ))}


                        </Select>
                    </FormControl>
                </Box>

                <TableContainer component={Paper} className={"mt-4"}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead className={"bg-gray-100"}>
                            <TableRow>
                                <TableCell align={"center"}>Periode</TableCell>
                                <TableCell align="center">Action</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.data.map((res, index) => (
                                <TableRow
                                    key={res.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell align="center">{res.label}</TableCell>
                                    <TableCell align="center">

                                        <Button
                                            id="demo-customized-button"
                                            aria-controls={openMenu ? 'demo-customized-menu' : undefined}
                                            aria-haspopup="true"
                                            className={"bg-orange-500 hover:bg-orange-400"}
                                            aria-expanded={openMenu ? 'true' : undefined}
                                            variant="contained"
                                            disableElevation
                                            onClick={(event) => {
                                                handleClickMenu(event)
                                                setDeletePermission(res.have_relation)
                                                setIdPeriod(res.id)
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
                                                handleCloseMenu()
                                                setOpenUpdateDialog(true)
                                            }} disableRipple>
                                                <EditIcon/>
                                                Edit
                                            </MenuItem>

                                            {deletePermission === 0 &&
                                                <MenuItem onClick={() => {
                                                    handleCloseMenu()
                                                    setOpenDeleteDialog(true)
                                                }} disableRipple>
                                                    <Delete/>
                                                    Delete
                                                </MenuItem>}
                                        </StyledMenu>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={10}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <PeriodDeleteComponent idPeriod={idPeriod} openDeleteDialog={openDeleteDialog}
                                       setOpenDeleteDialog={setOpenDeleteDialog} token={cookies.token}
                                       setStatus={setStatus}/>
                <PeriodUpdateComponent idPeriod={idPeriod} openUpdateDialog={openUpdateDialog}
                                       setOpenUpdateDialog={setOpenUpdateDialog} token={cookies.token}
                                       setStatus={setStatus}/>
                <PeriodCreateComponent openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog}
                                       token={cookies.token} setStatus={setStatus}/>
            </>
        )
    }
}