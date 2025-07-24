
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
  useEffect(() => {
    // Define o estilo a ser aplicado com base no modo de cor
    //outra opcap de cor para o background 29323B
    const style = `
      ::-webkit-scrollbar {
        width: 9px;
        height: 9px;        
      }
 
      ::-webkit-scrollbar-track {
        background: ${colorMode ? "#1D242C" : "#e2e2e2"};
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 8px; 
        background: ${colorMode ? "#637381" : "#b3b3b3"};
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${colorMode ? "#8196A8" : "#8f8e8e"};
      }
    `;

    // Cria o elemento <style> e adiciona o CSS
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";

    // Verifica compatibilidade para inserir o CSS
    styleElement.textContent = style;
    // Adiciona o elemento <style> ao <head> do documento
    document.head.appendChild(styleElement);
    // Remove o estilo ao desmontar o componente
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [colorMode]);
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
