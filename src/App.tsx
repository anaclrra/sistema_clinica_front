
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { myTheme } from './theme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './pages/layout';
import Patients from './pages/patients';
import Doctors from './pages/doctors';
import PatientHistory from './pages/patients/Appointmentshistory';
import DoctorHistory from './pages/doctors/AppointmentsHistory';

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [colorMode, setColorMode] = useState<boolean>(prefersDarkMode);
  const theme = useMemo(() => myTheme(colorMode), [colorMode]);
  useEffect(() => {
    setColorMode(prefersDarkMode);
  }, [prefersDarkMode]);
  useEffect(() => {
    const colorModeStorage = JSON.parse(localStorage.getItem("theme") as string);
    if (colorModeStorage) {
      setColorMode(colorModeStorage.colorMode);
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout colorMode={colorMode} setColorMode={setColorMode} />
              }
            >
              <Route index element={<Navigate to="/patients" replace />} />
              <Route path="patients" element={<Patients />} />
              <Route path='doctors' element={<Doctors />} />
              <Route path='appointments/patient/:id' element={<PatientHistory />} />
              <Route path='appointments/doctor/:id' element={<DoctorHistory />} />

            </Route>

          </Routes></BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App
