import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { Avatar, Box, Breadcrumbs, CircularProgress, Divider, Grid, Icon, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import EmptyBox from '../../../assets/emptyBox.svg?react'
import { maskPhone } from "../../../utils/maskFields";
import { Cancel, CheckCircle, Schedule } from "@mui/icons-material";
import { getStatusColor } from "../../../utils/statusStyles";

interface History extends Appointment {
    doctor: Doctor;
    patient: Patient
}



const DoctorHistory: React.FC = () => {
    const [history, setHistory] = useState<History[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [name, setName] = useState<string | null>(null)

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
                setHistory(response.data);
                setName(response.data[0].doctor.name ?? 'Sem nome')

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

    const styles = {
        container: { display: 'flex', flexDirection: 'column', gap: 3 },
        stackProgress: {
            display: 'flex', height: '100%', minHeight: '50vh', justifyContent: 'center', alignItems: 'center'
        },
        containerBox: {
            borderRadius: '0.5rem',
            color: theme.palette.text.primary,
            padding: 2,
            backgroundColor: theme.palette.background.paper,

        },
        boxHeader: {
            display: "flex",
            flexDirection: 'column', gap: 1,
            justifyContent: 'space-between',
            marginTop: 1
        },
        boxContent: {
            display: "flex",
            color: theme.palette.text.secondary,
            marginBottom: 1
        },
        stack: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }

    };
    return (loadingPage ? (
        <Stack sx={styles.stackProgress}>
            <CircularProgress />
        </Stack>
    ) : (
        <Box sx={styles.container}>
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
                    <Typography sx={{ fontSize: '1.125rem', color: 'text.primary' }}>Historico médico {name}</Typography>
                </Breadcrumbs>

            </Stack>
            {history && history.length > 0 ? (
                <Grid container spacing={2}>
                    {history.map((h) => (
                        <Grid size={{ xs: 12, md: 4 }} key={h.id}>
                            <Box sx={styles.containerBox}>

                                <Box sx={styles.boxContent}>
                                    <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'start' }}>
                                        <Avatar alt={h.patient.name.toUpperCase()} src="unknow" />
                                        <Stack>
                                            <Typography color={theme.palette.text.primary}>
                                                {h.patient.name}
                                            </Typography>
                                            <Typography color={theme.palette.text.secondary}>
                                                {maskPhone(h.patient.phone)}
                                            </Typography></Stack>
                                    </Stack>
                                </Box>
                                <Divider />
                                <Box sx={styles.boxHeader}>
                                    <Stack>
                                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                                            Horário
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {dayjs(h.dateTime).format("DD/MM/YYYY [às] HH:mm")}
                                        </Typography>
                                    </Stack>
                                    <Stack >
                                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                                            Status
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent='start'>
                                            <Icon>{getStatusIcon(h.status)}</Icon>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: getStatusColor(h.status, theme),
                                                }}
                                                textTransform={'capitalize'}
                                            >
                                                {h.status.toLowerCase()}
                                            </Typography>
                                        </Stack>

                                    </Stack>

                                </Box>

                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (<Stack sx={styles.stack} ><EmptyBox style={{ height: 140, width: 140, fill: theme.palette.text.disabled }} /><Typography sx={{ color: theme.palette.text.disabled }}>Sem historico de consultas</Typography></Stack>)}
        </Box>
    )

    )
}

export default DoctorHistory