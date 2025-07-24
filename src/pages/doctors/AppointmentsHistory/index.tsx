import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { alpha, Box, Breadcrumbs, Chip, CircularProgress, Grid, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { MedicalInformation, Person, Phone } from "@mui/icons-material";

interface History extends Appointment {
    doctor: Doctor;
    patient: Patient
}



const DoctorHistory: React.FC = () => {
    const [history, setHistory] = useState<History[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);

    const navigate = useNavigate()
    const theme = useTheme()
    const { id } = useParams();
    useEffect(() => {
        async function fetchDoctorHistory() {
            if (!id) {
                return
            }
            try {
                setLoadingPage(true);
                const response = await api.get(`/appointments/doctor/${id}`);

                setHistory(response.data); console.log(response.data);

            } catch (error) {
                console.error(error);
                // if (error?.response?.data?.error)
                //     notify(error.response.data.error, "error");
                // else notify("Não foi possível se conectar ao servidor!", "error");
            } finally {
                setLoadingPage(false);
            }
        }
        fetchDoctorHistory();
    }, [id]);
    const getStatusColor = (status: string) => {
        switch (status) {
            case "AGENDADA":
                return theme.palette.info.main as 'info';
            case "CANCELADA":
                return theme.palette.error.main as 'error'
            case "CONCLUIDA":
                return theme.palette.success.main as 'success'
            default:
                return theme.palette.primary.main as 'default'
        }
    }
    const styles = {
        containerBox: {
            //border: `1px solid ${theme.palette.divider}`,
            borderRadius: '0.5rem',
            color: theme.palette.text.primary,
            padding: 2,
            backgroundColor: theme.palette.background.paper,

        },
        boxHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
        },
        boxContent: {
            display: "flex",
            flexDirection: "column",
            gap: 1,
            color: theme.palette.text.secondary,
        },

    };
    return (loadingPage ? (
        <CircularProgress />
    ) : (
        <>
            <Stack>
                <Breadcrumbs aria-label="breadcrumb">
                    <Box
                        sx={{
                            fontSize: '1rem',
                            cursor: 'pointer',
                            color: 'inherit',
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' },
                        }}
                        onClick={() => navigate('/doctors')}
                    >
                        Médicos
                    </Box>
                    <Typography sx={{ fontSize: '1.125rem', color: 'text.primary' }}>Historico médico</Typography>
                </Breadcrumbs>

            </Stack>
            <Grid container spacing={2}>
                {history.map((h) => (
                    <Grid size={{ xs: 12, md: 4 }} key={h.id}>
                        <Box sx={styles.containerBox}>
                            <Box sx={styles.boxHeader}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {dayjs(h.dateTime).format("DD/MM/YYYY [às] HH:mm")}
                                </Typography>
                                <Chip
                                    label={h.status}
                                    sx={{
                                        backgroundColor: alpha(getStatusColor(h.status), 0.2),
                                        color: getStatusColor(h.status),

                                    }}
                                />
                            </Box>

                            <Box sx={styles.boxContent}>
                                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'start' }}>
                                    <MedicalInformation sx={{ color: theme.palette.text.disabled }} />
                                    <Typography color={theme.palette.text.primary}>
                                        {h.doctor.name} -{h.doctor.crm}
                                    </Typography>
                                </Stack>
                                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'start' }}>
                                    <Person sx={{ color: theme.palette.text.disabled }} />
                                    <Typography color={theme.palette.text.primary}>
                                        {h.patient.name} - {h.patient.cpf}
                                    </Typography>
                                </Stack>
                                <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'start' }}>
                                    <Phone sx={{ color: theme.palette.text.disabled }} />
                                    <Typography color={theme.palette.text.primary}>
                                        {h.patient.phone}
                                    </Typography>
                                </Stack>


                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    )

    )
}

export default DoctorHistory