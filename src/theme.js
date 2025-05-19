import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FBAC3C', // Thay bằng mã màu bạn muốn (ví dụ: #ff5722)
        },
        secondary: {
            main: '#ffffff', // Nếu muốn thay cả secondary
        },
    },
});

export default theme;
