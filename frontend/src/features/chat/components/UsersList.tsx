import React from 'react';
import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import type {UserPayload} from "../../../types";
import {API_URL} from "../../../constants.ts";

interface Props {
    onlineUsers: UserPayload[];
}

const UsersList: React.FC<Props> = ({onlineUsers}) => {
    return (
        <Box sx={{p: 2}}>
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
    </Box>
    );
};

export default UsersList;