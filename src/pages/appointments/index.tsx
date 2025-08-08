import { Add, Cancel, CheckCircle, Edit, Schedule, Search } from "@mui/icons-material";
import { Box, Button, Icon, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography, useTheme, type AlertProps } from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../../services/api";
import { ptBR } from "@mui/x-data-grid/locales";

import SnackBar from "../../components/snackBar";
import useStyles from "./styles";
import ModalCreateAppointment from "./modalCreateAppointment";
import { getStatusColor } from "../../utils/statusStyles";

function Appointments(): JSX.Element {
    const [rows, setRows] = useState<Appointment[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [openCreateAppointmentModal, setOpenCreateAppointmentModal] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<Appointment | null>(null)
    const [snackbar, setSnackbar] = useState<AlertProps | null>(null);
    const [searchText, setSearchText] = useState<string | null>(null)

    const theme = useTheme();
    const styles = useStyles(theme);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const getFilteredRows = useMemo(() => {
        return rows.filter((row: Appointment) => {
            return (
                (searchText
                    ? row?.status
                        ?.toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    row?.patient?.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    row?.patient?.name.toLowerCase().includes(searchText.toLowerCase())
                    : true)
            );
        });
    }, [
        rows, searchText
    ]);

    useEffect(() => {
        async function fetchAppointments() {
            try {
                setLoadingPage(true);
                const response = await api.get("/appointments");
                setRows(response.data);
                setSnackbar({
                    children: "Sucesso ao buscar consultas",
                    severity: "success"
                });
            } catch (error) {
                console.error(error);
                setSnackbar({
                    children: "Error: Não foi possível buscar consultas",
                    severity: "error"
                });
            } finally {
                setLoadingPage(false);
            }
        }
        fetchAppointments();
    }, []);
    const columns: GridColDef<Appointment>[] = [

        {
            minWidth: 100,
            flex: 1,
            field: "dateTime",
            headerName: "Data da consulta",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack>{dayjs(params.value).locale("pt-br")
                    .format("DD/MM/YYYY") || "-"}</Stack>;
            },
        },
        {
            minWidth: 200,
            flex: 1,
            field: "doctorId",
            headerName: "Médico",
            display: "flex",
            renderCell: (params) => (
                <Stack sx={styles.containerColumnEmailNome}>
                    <Typography fontSize={14}>
                        {params.row?.doctor?.name ? params.row?.doctor?.name : "-"}
                    </Typography>
                </Stack>
            ),
        },
        {
            minWidth: 200,
            flex: 1,
            field: "patientId",
            headerName: "Paciente",
            display: "flex",
            renderCell: (params) => (
                <Stack sx={styles.containerColumnEmailNome}>
                    <Typography fontSize={14}>
                        {params.row?.patient?.name ? params.row?.patient?.name : "-"}
                    </Typography>
                </Stack>
            ),
        },
        {
            minWidth: 100,
            flex: 1,
            field: "status",
            headerName: "Status",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack direction="row" spacing={1} alignItems="center" justifyContent='start'>
                    <Icon>{getStatusIcon(params.row.status)}</Icon>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: getStatusColor(params.row.status, theme),
                        }}
                        textTransform={'capitalize'}
                    >
                        {params.row.status.toLowerCase()}
                    </Typography>
                </Stack>
            },
        },
        {
            sortable: false,
            field: "options",
            headerName: "Opções",
            minWidth: 100,
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {

                return (
                    <Stack sx={styles.stackBtns}>
                        <IconButton onClick={() => handleEditOpen(params.row)} disabled={params.row.status === 'CANCELADA'}><Edit fontSize="small" /></IconButton>
                        <IconButton onClick={() => handleCancelAppointment(params.row.id)} disabled={params.row.status === 'CANCELADA'}><Cancel fontSize="small" /></IconButton>


                    </Stack>
                );
            },
        },
    ];
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "AGENDADA":
                return <Schedule color="primary" />;
            case "CANCELADA":
                return <Cancel color="error" />;
            case "CONCLUIDA":
                return <CheckCircle color="success" />;
            default:
                return null;
        }
    };
    const handleNewOpen = () => {
        setOpenCreateAppointmentModal(true);

    };
    const handleEditOpen = (row: Appointment) => {
        setSelectedRow(row);
        setOpenCreateAppointmentModal(true)
    }
    const handleCancelAppointment = async (id: string) => {
        try {
            setLoadingPage(true);
            const response = await api.patch(`/appointment/cancel/${id}`);
            setRows((prevRows) =>
                prevRows.map((item) =>
                    item.id === response.data.id ? response.data : item
                )
            );
            setSnackbar({
                children: "Sucesso ao cancelar consulta",
                severity: "success"
            });
        } catch (error) {
            console.error(error);
            setSnackbar({
                children: "Error: Não foi possível cancelar consulta",
                severity: "error"
            });
        } finally {
            setLoadingPage(false);
        }
    }

    return (
        <>
            <Box sx={styles.containerBox}>
                <Paper elevation={0} sx={styles.paper}>
                    <Box sx={styles.boxHeader}>
                        <Box sx={styles.boxSearchAndFilter}>
                            <TextField
                                size="small"
                                label="Pesquisar Consulta"
                                variant="filled"
                                sx={styles.searchInput}
                                value={searchText}
                                onChange={handleSearchInputChange}
                                autoComplete="off"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />


                            <Tooltip title="Adicionar consulta">
                                <Button
                                    onClick={handleNewOpen}
                                    sx={styles.buttonMobile}
                                    variant="contained" startIcon={<Add />}
                                >
                                    Novo
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box width="100%">
                        <DataGrid rows={getFilteredRows} columns={columns}
                            density="standard"
                            disableColumnMenu
                            disableColumnFilter
                            hideFooterSelectedRowCount
                            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                            sx={styles.dataGrid}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                            }
                            loading={loadingPage}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 5 },
                                },
                            }} />
                    </Box>
                </Paper>
            </Box>
            <ModalCreateAppointment
                openCreateAppointmentModal={openCreateAppointmentModal}
                setOpenCreateAppointmentModal={setOpenCreateAppointmentModal}
                rows={rows}
                setRows={setRows}
                setSnackbar={setSnackbar}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
            />
            <SnackBar snackbar={snackbar} setSnackbar={setSnackbar} />
        </>
    )
}

export default Appointments