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
    type AlertProps,
} from "@mui/material";

import { HowToReg } from "@mui/icons-material";


import { useEffect, useState, type SetStateAction } from "react";

import { LoadingButton } from "@mui/lab";

import api from "../../../services/api";

interface ModalCreateProps {
    openCreateDoctorModal: boolean;
    setOpenCreateDoctorModal: (value: boolean) => void;
    rows: Doctor[] | [];
    setRows: React.Dispatch<SetStateAction<Doctor[]>>;
    setSnackbar: (value: AlertProps | null) => void;

}


const ModalCreateDoctor: React.FC<ModalCreateProps> = (params) => {
    const {
        openCreateDoctorModal,
        setOpenCreateDoctorModal,
        rows,
        setRows,
        setSnackbar
    } = params;

    const [name, setName] = useState<string>("");
    const [crm, setCrm] = useState<string>("");
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [selectedSpecialtie, setSelectedSpecialtie] = useState<string | null>(null)
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
            color: "primary.main",
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

    useEffect(() => {
        async function handleFetchSpecialties() {
            try {
                setLoading(true);
                const response = await api.get("/specialties");
                setSpecialties(response.data);
            } catch (error) {
                console.error(error);
                // if (error?.response?.data?.error)
                //   notify(error.response.data.error, "error");
                // else notify("Não foi possível se conectar ao servidor!", "error");
            } finally {
                setLoading(false);
            }
        }
        handleFetchSpecialties();
    }, [])
    async function handleNewDoctor() {
        setIsSubmit(true);
        if (
            !name ||
            !crm
        )
            return;
        try {
            setLoading(true);

            const response = await api.post("/doctor/create", {
                name, crm, specialtiesId: selectedSpecialtie
            });

            if (response.data) {
                console.log(response.data);

                setRows([...(rows || []), response.data]);
                handleClose();
                setSnackbar({
                    children: "Médico criado com sucesso!",
                    severity: "success"
                });
            }
        } catch (error: unknown) {
            console.log(error);
            setSnackbar({
                children: "Erro ao criar médico",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpenCreateDoctorModal(false);
        setCrm('');
        setName('');
        setIsSubmit(false);
    };

    const handleValidateCrm = () => {
        const verificaCrm = rows?.some(
            (row: Doctor) => crm === row?.crm
        );
        if (verificaCrm) {
            return true;
        }
        return false;
    };

    return (
        <Modal
            open={openCreateDoctorModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={styles.modal}
        >
            <Paper sx={styles.paper}>
                <DialogTitle sx={styles.dialogTitle} color="primary.main">
                    <Box sx={styles.boxHeader}>
                        <Box sx={styles.boxTitle}>
                            <IconButton size="small">
                                <HowToReg sx={{ color: "primary.main" }} />
                            </IconButton>
                            <Typography fontWeight={500}>Cadastrar médico</Typography>
                        </Box>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                setOpenCreateDoctorModal(false);
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
                                    value={crm}
                                    onChange={(e) => {

                                        setCrm(e.target.value);
                                    }
                                    } label="CRM"
                                    variant="filled"
                                    error={
                                        (isSubmit &&
                                            !crm) || handleValidateCrm()
                                    }
                                    helperText={
                                        (isSubmit &&
                                            !crm && "CRM é obrigatório") || handleValidateCrm() && "CRM ja cadastrado"
                                    }
                                    disabled={loading}
                                />
                            </Box>
                        </Grid>
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
                    </Grid>
                </DialogContent>
                <DialogActions sx={styles.dialogActions}>
                    <Button
                        sx={{ color: "primary.main" }}
                        onClick={handleClose}
                        variant="text"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        onClick={handleNewDoctor}
                        variant="contained"
                        loading={loading}
                    >
                        Salvar
                    </LoadingButton>
                </DialogActions>
            </Paper>
        </Modal>
    );
};

export default ModalCreateDoctor;