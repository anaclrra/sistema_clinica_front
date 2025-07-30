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
import { maskCPF, maskPhone, removeMask } from "../../../utils/maskFields";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
interface ModalEditProps {
    openEditPatientModal: boolean;
    setOpenEditPatientModal: (value: boolean) => void;
    rows: Patient[] | [];
    setRows: React.Dispatch<SetStateAction<Patient[]>>;
    selectedRow: Patient | null
    setSnackbar: (value: AlertProps | null) => void;

}


const ModalEditPatient: React.FC<ModalEditProps> = (params) => {
    const {
        openEditPatientModal,
        setOpenEditPatientModal,
        rows,
        setRows,
        selectedRow,
        setSnackbar
    } = params;

    const [id, setId] = useState<string>("")
    const [name, setName] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [inputCpf, setInputCpf] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [inputPhone, setInputPhone] = useState<string>("");

    const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
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
        if (selectedRow) {

            setIsSubmit(false);
            setId(selectedRow?.id);
            setName(selectedRow?.name);
            setCpf(selectedRow.cpf);
            setInputCpf(maskCPF(selectedRow.cpf));
            setInputPhone(maskPhone(selectedRow.phone));
            setPhone(selectedRow.phone)
            setDateOfBirth(dayjs(selectedRow.dateOfBirth))
        }
    }, [selectedRow]);

    async function handleEditPatient() {
        setIsSubmit(true);
        if (!id ||
            !phone ||
            !name ||
            !cpf ||
            !dateOfBirth
        )
            return;
        try {
            setLoading(true);

            const response = await api.put(`/patient/update/${id}`, {
                name, phone, cpf, dateOfBirth
            });

            if (response.data) {
                setRows((prevRows) =>
                    prevRows.map((item) =>
                        item.id === response.data.id ? response.data : item
                    )
                ); handleClose();
                setSnackbar({
                    children: "Paciente editado com sucesso!",
                    severity: "success"
                });
            }
        } catch (error: unknown) {
            console.log(error);
            setSnackbar({
                children: "Erro ao editar paciente",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpenEditPatientModal(false);
        setCpf('');
        setDateOfBirth(null);
        setName('');
        setPhone('');
        setIsSubmit(false);
    };



    const handleValidateCpf = () => {
        const verificaCpf = rows?.some(
            (row: Patient) => cpf === row?.cpf && row.id !== id
        );
        if (verificaCpf) {
            return true;
        }
        return false;
    };

    return (
        <Modal
            open={openEditPatientModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={styles.modal}
        >
            <Paper sx={styles.paper}>
                <DialogTitle sx={styles.dialogTitle}>
                    <Box sx={styles.boxHeader}>
                        <Box sx={styles.boxTitle}>
                            <IconButton size="small">
                                <HowToReg sx={{ color: "text.secondary" }} />
                            </IconButton>
                            <Typography sx={{ color: 'text.primary' }} fontWeight={500}>Editar Paciente {name}</Typography>
                        </Box>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                setOpenEditPatientModal(false);
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
                                    size="small"
                                    type="text"
                                    autoComplete="off"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    label="Nome"
                                    variant="filled"
                                    error={
                                        (isSubmit &&
                                            !name)
                                    }
                                    helperText={
                                        (isSubmit &&
                                            !name && "Nome é obrigatório")
                                    }
                                    disabled={loading}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>

                                <TextField
                                    size="small"
                                    type="text"
                                    autoComplete="off"
                                    value={inputCpf}
                                    onChange={(e) => {
                                        setCpf(removeMask(maskCPF(e.target.value)));
                                        setInputCpf(maskCPF(e.target.value));
                                    }
                                    } label="CPF"
                                    variant="filled"
                                    error={
                                        (isSubmit &&
                                            !cpf) || handleValidateCpf()
                                    }
                                    helperText={
                                        (isSubmit &&
                                            !cpf && "CPF é obrigatório") || handleValidateCpf() && "CPF ja cadastrado"
                                    }
                                    disabled={loading}
                                />
                            </Box>
                        </Grid><Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>

                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale={"pt-br"}
                                >
                                    <DatePicker
                                        disableFuture
                                        value={dateOfBirth}
                                        maxDate={dayjs()}
                                        onChange={(newValue) => {
                                            setDateOfBirth(newValue);
                                        }}
                                    //sx={styles.textField}

                                    />
                                </LocalizationProvider>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box sx={styles.boxRowFields}>

                                <TextField
                                    size="small"
                                    type="phone"
                                    autoComplete="off"
                                    value={inputPhone}
                                    onChange={(e) => {
                                        setPhone(removeMask(maskPhone(e.target.value)));
                                        setInputPhone(maskPhone(e.target.value));
                                    }}
                                    label="Telefone"
                                    variant="filled"
                                    error={
                                        isSubmit &&
                                        !phone
                                    }
                                    helperText={
                                        (isSubmit &&
                                            !phone && "Telefone é obrigatório")
                                    }
                                    disabled={loading}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={styles.dialogActions}>
                    <Button
                        onClick={handleClose}
                        variant="text"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleEditPatient}
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

export default ModalEditPatient;