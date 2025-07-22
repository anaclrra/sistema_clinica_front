
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { myTheme } from './theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/layout';
import Patients from './pages/patients';
import Doctors from './pages/doctors';

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
            <Route path="/" element={<Layout colorMode={colorMode}
              setColorMode={setColorMode} />} >
              <Route path='/' element={<Patients />}></Route>
              <Route path='/doctors' element={<Doctors />}></Route>

            </Route>

          </Routes></BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App
