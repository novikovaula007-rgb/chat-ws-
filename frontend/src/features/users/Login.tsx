import React, {useState} from 'react';
import {Alert, Avatar, Box, Button, Container, Grid, Typography} from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {login, selectLoginError, selectUser} from "./store/usersSlice.ts";
import AuthButtons from "./components/AuthButtons.tsx";
import type {LoginMutation} from "../../types";
import {Navigate} from "react-router";
import {AuthTextField} from "./components/AuthTextField.tsx";

const Login = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectLoginError);
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginMutation>({
        username: '',
        password: '',
    });

    if (user) {
        return <Navigate to="/chat" replace/>;
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prevState => ({...prevState, [name]: value}));
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(login(form)).unwrap();
            navigate('/chat');
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{m: 1, bgcolor: "#7b3be1"}}>
                    <LockOpenIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{color: "#fff"}}>
                    Sign in
                </Typography>

                {error && (<Alert severity="error" sx={{mt: 3, width: "100%"}}>
                    {error.error}
                </Alert>)}

                <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <AuthTextField
                                autoComplete="given-name"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                                value={form.username}
                                onChange={onInputChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <AuthTextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={onInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 1, backgroundColor: "#7b3be1"}}
                    >
                        Sign In
                    </Button>
                    <AuthButtons/>
                    <Grid container sx={{justifyContent: "flex-end"}}>
                        <Grid>
                            <Typography component={Link} to="/register" sx={{
                                textDecoration: "none",
                                fontSize: "16px",
                                color: "rgba(255,255,255,0.46)",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "#ccc",
                                    cursor: "pointer"
                                }
                            }}>
                                Don't have an account? Sign up
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;