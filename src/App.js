// import logo from './logo.svg';
import './App.css';
import AllRoutes from './components/AllRoutes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AllRoutes />
    </ThemeProvider>
  );
}

export default App;
