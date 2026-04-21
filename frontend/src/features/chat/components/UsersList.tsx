import React from 'react';
import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Button} from "@mui/material";
import type {UserPayload} from "../../../types";
import {API_URL} from "../../../constants.ts";
import LogoutIcon from '@mui/icons-material/Logout';
import {clearChat} from "../store/chatSlice.ts";
import {useAppDispatch} from "../../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {logout} from "../../users/store/usersSlice.ts";

interface Props {
    onlineUsers: UserPayload[];
}

const UsersList: React.FC<Props> = ({onlineUsers}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout()).unwrap();
        dispatch(clearChat());
        navigate('/login');
    };

    return (
        <Box sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h6">Online users</Typography>
            <List sx={{flex: 1, overflowY: 'auto'}}>
                {onlineUsers.map((user) => {
                    return (<ListItem key={user._id} disablePadding
                                      sx={{
                                          borderRadius: '12px',
                                          padding: '0 10px',
                                          mb: 0.5,
                                          transition: 'background-color 0.2s ease',
                                          cursor: 'pointer',

                                          '&:hover': {
                                              backgroundColor: '#353535',
                                          },
                                      }}>
                        <ListItemAvatar>
                            <Avatar src={(API_URL + '/' + user?.avatar) || user?.avatar || undefined}/>
                        </ListItemAvatar>
                        <ListItemText primary={user.displayName}
                                      sx={{
                                          '& .MuiListItemText-secondary': {
                                              color: '#bf94ff !important',
                                              fontSize: '14px',
                                          }
                                      }}
                                      secondary="online"/>
                    </ListItem>)
                })}
            </List>
            <Button sx={{mt: 'auto', backgroundColor: '#7b3be1', color: '#fff'}}
                    endIcon={<LogoutIcon/>}
                    onClick={() => handleLogout()}>Log
                out</Button>
        </Box>
    );
};

export default UsersList;