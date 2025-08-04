import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Paper,
    TextField,
    Typography,
    useTheme,
    type AlertProps,
} from "@mui/material";

import { HowToReg } from "@mui/icons-material";


import { useEffect, useState, type SetStateAction } from "react";

import { LoadingButton } from "@mui/lab";

import api from "../../../services/api";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import type { AxiosResponse } from "axios";

interface ModalCreateProps {
    openCreateAppointmentModal: boolean;
    setOpenCreateAppointmentModal: (value: boolean) => void;
    rows: Appointment[] | [];
    setRows: React.Dispatch<SetStateAction<Appointment[]>>;
    setSnackbar: (value: AlertProps | null) => void;
    selectedRow?: Appointment | null
    setSelectedRow?: React.Dispatch<SetStateAction<Appointment | null>>
}


const ModalCreateAppointment: React.FC<ModalCreateProps> = (params) => {
    const {
        openCreateAppointmentModal,
        setOpenCreateAppointmentModal,
        rows,
        setRows,
        setSnackbar,
        selectedRow,
        setSelectedRow
    } = params;

    const [id, setId] = useState<string>("")
    const [status, setStatus] = useState<Status | null>(null)
    const [date, setDate] = useState<Dayjs | null>(null);
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedSpecialtie, setSelectedSpecialtie] = useState<string | null>(null)
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const styles = {
        modal: { display: "flex", justifyContent: "center", alignItems: "center" },
        paper: {
            padding: 2,
            maxWidth: "432px",
            width: "90%",
            minWidth: "232px",
            maxHeight: "90vh",
            gap: 2,
            flexDirection: "column",
            display: "flex",
            alignItems: "felx-start",
        },
        formControl: {
            width: "100%",
            marginTop: "12px",
        },
        boxTitle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
        },
        subtitle: {
            fontSize: "14px",
            fontWeight: 500,
            color: "text.primary",
        },
        dialogTitle: {
            padding: 0,
        },
        dialogActions: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            gap: 0,
            padding: 0,
            width: "100%",
        },
        dialogContent: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 0,
            gap: 1.5,
        },
        boxRowFields: {
            display: "flex",
            flexDirection: "column",
            with: "100%",
            gap: 1,
        },
        boxPasswords: {
            display: "flex",
            flexDirection: "column",
            with: "100%",
            gap: 2,
        },
        textfield: {
            width: "100%",
        },
        boxHeader: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            mb: 1,
        },
    };
    const theme = useTheme()
    useEffect(() => {
        if (selectedRow && selectedRow.doctor) {
            setId(selectedRow.id);
            setStatus(selectedRow.status);
            setSelectedSpecialtie(selectedRow.doctor.specialtiesId);
            setSelectedPatient(selectedRow.patientId);
            setSelectedDoctor(selectedRow.doctorId);
            setDate(dayjs(selectedRow.dateTime));
        }
    }, [selectedRow]);
    useEffect(() => {
        async function handleFetchSpecialties() {
            try {
                setLoading(true);
                const response = await api.get("/specialties");
                setSpecialties(response.data);
            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }
        }
        async function handleFetchPatients() {
            try {
                setLoading(true);
                const response = await api.get("/patients");
                setPatients(response.data);
            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }
        }
        handleFetchSpecialties();
        handleFetchPatients();
    }, [])

    useEffect(() => {
        async function handleFetchDoctorsBySpecialties() {
            if (
                !selectedSpecialtie
            )
                return;
            try {
                setLoading(true);
                const response = await api.get(`/specialtie/${selectedSpecialtie}`);
                setDoctors(response.data.doctors);
            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }
        }

        handleFetchDoctorsBySpecialties();

    }, [selectedSpecialtie])

    async function handleSaveAppointment() {
        setIsSubmit(true);

        if (!selectedPatient || !selectedDoctor || !date) return;

        try {
            setLoading(true);

            const payload = {
                dateTime: date,
                patientId: selectedPatient,
                doctorId: selectedDoctor,
            };

            let response: AxiosResponse;

            if (selectedRow) {
                const editPayload = { ...payload, status }
                response = await api.put(`/appointment/update/${id}`, editPayload);

                if (response.data) {
                    setRows((prevRows) =>
                        prevRows.map((item) =>
                            item.id === response.data.id ? response.data : item
                        )
                    );
                    setSnackbar({
                        children: "Consulta atualizada com sucesso!",
                        severity: "success",
                    });
                }
            } else {
                response = await api.post("/appointment/create", payload);

                if (response.data) {
                    setRows([...(rows || []), response.data]);
                    setSnackbar({
                        children: "Consulta criada com sucesso!",
                        severity: "success",
                    });
                }
            }

            handleClose();
        } catch (error) {
            console.error(error);
            setSnackbar({
                children: "Erro ao salvar Consulta",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    }


    const handleClose = () => {
        setOpenCreateAppointmentModal(false);
        setSelectedDoctor(null);
        setSelectedPatient(null);
        setSelectedSpecialtie(null);
        setDate(null);
        setStatus(null);
        setIsSubmit(false);
        if (setSelectedRow)
            setSelectedRow(null);
    };


    return (
        <Modal
            open={openCreateAppointmentModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={styles.modal}
        >
            <Paper sx={styles.paper}>
                <DialogTitle sx={styles.dialogTitle} >
                    <Box sx={styles.boxHeader}>
                        <Box sx={styles.boxTitle}>
                            <IconButton size="small">
                                <HowToReg sx={{ color: "text.secondary" }} />
                            </IconButton>
                            <Typography sx={{ color: 'text.primary' }} fontWeight={500}>{selectedRow ? 'Editar consulta' : 'Cadastrar consulta'}</Typography>
                        </Box>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                setOpenCreateAppointmentModal(false);
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                </DialogTitle>
                <DialogContent sx={styles.dialogContent}>
                    <Grid container columnSpacing={1.5} rowSpacing={2}>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>

                                <TextField
                                    select
                                    label="Especialidade"
                                    variant="filled"
                                    value={selectedSpecialtie}
                                    onChange={(e) => setSelectedSpecialtie(e.target.value)}
                                >
                                    {specialties.map((specialtie) =>
                                        <MenuItem value={specialtie.id}>{specialtie.name}</MenuItem>
                                    )}
                                </TextField>

                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>

                                <TextField
                                    select
                                    label="Médico"
                                    variant="filled"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    disabled={!selectedSpecialtie}
                                >
                                    {doctors.length > 0 ? doctors.map((doctor) =>
                                        <MenuItem value={doctor.id}>{doctor.name}</MenuItem>
                                    ) : <MenuItem disabled>Nenhum médico encontrado para a especialidade</MenuItem>}
                                </TextField>

                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>

                                <TextField
                                    select
                                    label="Paciente"
                                    variant="filled"
                                    value={selectedPatient}
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                >
                                    {patients.map((patient) =>
                                        <MenuItem value={patient.id}>{patient.name}</MenuItem>
                                    )}
                                </TextField>

                            </Box>
                        </Grid>
                        {selectedRow && (
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <Box sx={styles.boxRowFields}>

                                    <TextField
                                        select
                                        label="Status"
                                        variant="filled"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as Status)}
                                    >
                                        <MenuItem value={'AGENDADA'}>Agendada</MenuItem>
                                        <MenuItem value={'CONCLUIDA'}>Concluida</MenuItem>

                                    </TextField>

                                </Box>
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale={"pt-br"}
                                >
                                    <DatePicker
                                        label="Data"
                                        sx={styles.textfield}
                                        disabled={loading}
                                        disableFuture
                                        value={date}
                                        maxDate={dayjs()}
                                        onChange={(newValue) => {
                                            setDate(newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: "filled",
                                                error: isSubmit && !date,
                                                helperText:
                                                    isSubmit && !date
                                                        ? "Campo obrigatório"
                                                        : "",
                                            },
                                        }}
                                    />

                                </LocalizationProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={styles.dialogActions}>
                    <Button
                        sx={{ color: "text.primary " }}
                        onClick={handleClose}
                        variant="text"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleSaveAppointment}
                        loading={loading}
                        sx={{ backgroundColor: theme.palette.text.primary, color: theme.palette.text.inverted }}
                    >
                        Salvar
                    </LoadingButton>
                </DialogActions>
            </Paper>
        </Modal>
    );
};

export default ModalCreateAppointment;