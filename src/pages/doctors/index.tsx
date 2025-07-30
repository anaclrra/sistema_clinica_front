import { Add, Edit, History, Search } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, useTheme, type AlertProps } from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import useStyles from "./styles";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
// import { maskCPF, maskPhone } from "../../utils/maskFields";
// import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../../services/api";
import { ptBR } from "@mui/x-data-grid/locales";
import ModalCreateDoctor from "./modalCreateDoctor";
import ModalEditDoctor from "./modalEditDoctor";
import { useNavigate } from "react-router-dom";
import SnackBar from "../../components/snackBar";


function Doctors(): JSX.Element {
    const [rows, setRows] = useState<Doctor[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [openCreateDoctorModal, setOpenCreateDoctorModal] = useState<boolean>(false);
    const [openEditDoctorModal, setOpenEditDoctorModal] = useState<boolean>(false)
    const [selectedRow, setSelectedRow] = useState<Doctor | null>(null)
    const [snackbar, setSnackbar] = useState<AlertProps | null>(null);
    const [searchText, setSearchText] = useState<string | null>(null)

    const theme = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate()
    console.log(loadingPage);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };


    const getFilteredRows = useMemo(() => {
        return rows.filter((row: Doctor) => {
            return (
                (searchText
                    ? row?.name
                        ?.toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    row?.crm.includes(searchText)
                    : true)
            );
        });
    }, [
        rows, searchText
    ]);
    useEffect(() => {
        async function fetchPatients() {
            try {
                setLoadingPage(true);
                const response = await api.get("/doctors");
                setRows(response.data);
                setSnackbar({
                    children: "Sucesso ao buscar médicos",
                    severity: "success"
                });
            } catch (error) {
                console.error(error);
                setSnackbar({
                    children: "Erro ao buscar médicos",
                    severity: "error"
                });
            } finally {
                setLoadingPage(false);
            }
        }
        fetchPatients();
    }, []);
    const columns: GridColDef<Doctor>[] = [
        {
            minWidth: 200,
            flex: 1,
            field: "name",
            headerName: "Nome",
            display: "flex",
        },
        {
            minWidth: 150,
            flex: 1,
            field: "crm",
            headerName: "CRM",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack>{params?.value ?? "-"}</Stack>;
            },
        },
        {
            minWidth: 100,
            flex: 1,
            field: "specialties",
            headerName: "Especialidades",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack>{params.value?.name || params.row?.specialtiesId || "-"}</Stack>;
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
                        <IconButton onClick={() => handleEditOpen(params.row)}><Edit fontSize="small" /></IconButton>
                        <IconButton onClick={() => navigate(`/appointments/doctor/${params.row.id}`)}><History fontSize="small" /></IconButton>

                    </Stack>
                );
            },
        },
    ];
    const handleNewOpen = () => {
        setOpenCreateDoctorModal(true);
    };
    const handleEditOpen = (row: Doctor) => {
        setSelectedRow(row);
        setOpenEditDoctorModal(true)
    }
    return (
        <>
            <Box sx={styles.containerBox}>
                <Paper elevation={0} sx={styles.paper}>
                    <Box sx={styles.boxHeader}>
                        <Box sx={styles.boxSearchAndFilter}>
                            <TextField
                                size="small"
                                label="Pesquisar Médico"
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


                            <Tooltip title="Adicionar médico">
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
                        <DataGrid rows={getFilteredRows} columns={columns} density="standard"
                            disableColumnMenu
                            disableColumnFilter
                            hideFooterSelectedRowCount
                            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                            sx={styles.dataGrid}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
                            }
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 5 },
                                },
                            }} />
                    </Box>
                </Paper>
            </Box>
            <ModalCreateDoctor
                openCreateDoctorModal={openCreateDoctorModal}
                setOpenCreateDoctorModal={setOpenCreateDoctorModal}
                rows={rows}
                setRows={setRows}
                setSnackbar={setSnackbar}

            />
            <ModalEditDoctor openEditDoctorModal={openEditDoctorModal} setOpenEditDoctorModal={setOpenEditDoctorModal} selectedRow={selectedRow} rows={rows}
                setRows={setRows} setSnackbar={setSnackbar} />
            <SnackBar snackbar={snackbar} setSnackbar={setSnackbar} />

        </>
    )
}

export default Doctors