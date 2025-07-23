import { Add, Edit, History, Search } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, useTheme } from "@mui/material";
import { useEffect, useState, type JSX } from "react";
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


function Doctors(): JSX.Element {
    const [rows, setRows] = useState<Doctor[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [openCreateDoctorModal, setOpenCreateDoctorModal] = useState<boolean>(false);
    const [openEditDoctorModal, setOpenEditDoctorModal] = useState<boolean>(false)
    const [selectedRow, setSelectedRow] = useState<Doctor | null>(null)
    const theme = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate()
    console.log(loadingPage);

    //     const handleSearchInputChange = (event) => {
    //     setSearchText(event.target.value);
    //   };

    //   const getFilteredRows = useMemo(() => {
    //     const rowsFiltered = Array.isArray(rows)
    //       ? rows?.filter(
    //           (row) =>
    //             (tabValue === 0 && row.status === true) ||
    //             (tabValue === 1 && row.status === false)
    //         )
    //       : [];

    //     return rowsFiltered?.filter((row) => {
    //       return (
    //         (searchText
    //           ? row?.PerfilCliente?.nomeFantasia
    //               ?.toLowerCase()
    //               .includes(searchText.toLowerCase()) ||
    //             row?.PerfilCliente?.nome
    //               ?.toLowerCase()
    //               .includes(searchText.toLowerCase()) ||
    //             row?.PerfilCliente?.sobrenome
    //               ?.toLowerCase()
    //               .includes(searchText.toLowerCase()) ||
    //             row?.login?.toLowerCase().includes(searchText.toLowerCase()) ||
    //             row?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    //             (removeMask(row?.PerfilCliente?.cpf).includes(
    //               removeMask(searchText)
    //             ) &&
    //               !!removeMask(searchText)) ||
    //             (removeMask(row?.PerfilCliente?.cnpj).includes(
    //               removeMask(searchText)
    //             ) &&
    //               !!removeMask(searchText))
    //           : true) &&
    //         row.verificado?.toString().includes(verifyStatus?.value?.toString()) &&
    //         row.codigoPermissao?.includes(permissionStatus?.value) &&
    //         (criadoEm
    //           ? new Date(row?.createAt)
    //               .toLocaleDateString()
    //               .includes(new Date(criadoEm).toLocaleDateString())
    //           : true) &&
    //         (row?.PerfilCliente
    //           ? row?.PerfilCliente?.pessoaFisica
    //               ?.toString()
    //               .includes(personTypeStatus?.value?.toString())
    //           : true)
    //       );
    //     });
    //   }, [
    //     verifyStatus,
    //     permissionStatus,
    //     personTypeStatus,
    //     criadoEm,
    //     tabValue,
    //     rows,
    //     searchText,
    //   ]);

    useEffect(() => {
        async function fetchPatients() {
            try {
                setLoadingPage(true);
                const response = await api.get("/doctors");

                setRows(response.data);
            } catch (error) {
                console.error(error);
                // if (error?.response?.data?.error)
                //     notify(error.response.data.error, "error");
                // else notify("Não foi possível se conectar ao servidor!", "error");
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
                                label="Pesquisar Medico"
                                variant="filled"
                                sx={styles.searchInput}
                                // value={searchText}
                                // onChange={handleSearchInputChange}
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


                            <Tooltip title="Adicionar medico">
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
                        <DataGrid rows={rows} columns={columns} density="standard"
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

            />
            <ModalEditDoctor openEditDoctorModal={openEditDoctorModal} setOpenEditDoctorModal={setOpenEditDoctorModal} selectedRow={selectedRow} rows={rows}
                setRows={setRows} />
        </>
    )
}

export default Doctors