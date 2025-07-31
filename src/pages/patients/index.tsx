import { Add, Edit, History, Search } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, useTheme, type AlertProps } from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import useStyles from "./styles";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { maskCPF, maskPhone } from "../../utils/maskFields";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../../services/api";
import { ptBR } from "@mui/x-data-grid/locales";
import ModalCreatePatient from "./modalCreatePatient";
import ModalEditPatient from "./modalEditPatient";
import { useNavigate } from "react-router-dom";
import SnackBar from "../../components/snackBar";

function Patients(): JSX.Element {
    const [rows, setRows] = useState<Patient[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [openCreatePatientModal, setOpenCreatePatientModal] = useState<boolean>(false);
    const [openEditPatientModal, setOpenEditPatientModal] = useState<boolean>(false)
    const [selectedRow, setSelectedRow] = useState<Patient | null>(null)
    const [snackbar, setSnackbar] = useState<AlertProps | null>(null);
    const [searchText, setSearchText] = useState<string | null>(null)

    const theme = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };


    const getFilteredRows = useMemo(() => {
        return rows.filter((row: Patient) => {
            return (
                (searchText
                    ? row?.name
                        ?.toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    row?.cpf.includes(searchText)
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
                const response = await api.get("/patients");
                setRows(response.data);
                setSnackbar({
                    children: "Sucesso ao buscar pacientes",
                    severity: "success"
                });
            } catch (error) {
                console.error(error);
                setSnackbar({
                    children: "Error: Não foi possível buscar pacientes",
                    severity: "error"
                });
            } finally {
                setLoadingPage(false);
            }
        }
        fetchPatients();
    }, []);
    const columns: GridColDef<Patient>[] = [
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
            field: "cpf",
            headerName: "CPF",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack>{maskCPF(params?.value) ?? "-"}</Stack>;
            },
        },
        {
            minWidth: 100,
            flex: 1,
            field: "dateOfBirth",
            headerName: "Data de nascimento",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack>{dayjs(params.value).locale("pt-br")
                    .format("D [de] MMM, YYYY") || "-"}</Stack>;
            },
        },
        {
            minWidth: 100,
            flex: 1,
            field: "phone",
            headerName: "Telefone",
            display: "flex",
            renderCell: (params: GridRenderCellParams) => {
                return <Stack>{maskPhone(params?.value) ?? "-"}</Stack>;
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
                        <IconButton onClick={() => navigate(`/appointments/patient/${params.row.id}`)} ><History fontSize="small" /></IconButton>

                    </Stack>
                );
            },
        },
    ];
    const handleNewOpen = () => {
        setOpenCreatePatientModal(true);
    };
    const handleEditOpen = (row: Patient) => {
        setSelectedRow(row);
        setOpenEditPatientModal(true)
    }

    return (
        <>
            <Box sx={styles.containerBox}>
                <Paper elevation={0} sx={styles.paper}>
                    <Box sx={styles.boxHeader}>
                        <Box sx={styles.boxSearchAndFilter}>
                            <TextField
                                size="small"
                                label="Pesquisar Paciente"
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


                            <Tooltip title="Adicionar paciente">
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
            <ModalCreatePatient
                openCreatePatientModal={openCreatePatientModal}
                setOpenCreatePatientModal={setOpenCreatePatientModal}
                rows={rows}
                setRows={setRows}
                setSnackbar={setSnackbar}
            />
            <ModalEditPatient openEditPatientModal={openEditPatientModal} setOpenEditPatientModal={setOpenEditPatientModal} selectedRow={selectedRow} rows={rows}
                setRows={setRows} setSnackbar={setSnackbar} />
            <SnackBar snackbar={snackbar} setSnackbar={setSnackbar} />
        </>
    )
}

export default Patients