import {styled, TextField} from '@mui/material';

export const AuthTextField = styled(TextField)({
    "& .MuiInputBase-input": {
        color: "#fff",
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255, 255, 255, 0.7)",
    },
    "& label.Mui-focused": {
        color: "#7b3be1",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.23)",
        },
        "&:hover fieldset": {
            borderColor: "#7b3be1",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#7b3be1",
        },
        "&.Mui-disabled fieldset": {
            borderColor: "rgba(255, 255, 255, 0.23)",
            borderStyle: "solid",
        },
    },
});