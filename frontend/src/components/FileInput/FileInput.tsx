import {useRef, useState} from 'react';
import {Button, FormHelperText, Grid} from '@mui/material';
import React from "react";
import {AuthTextField} from "../../features/users/components/AuthTextField.tsx";

interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
    error?: boolean;
    helperText?: string;
}

const FileInput: React.FC<Props> = ({onChange, name, label, error, helperText}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState('');


    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFilename(e.target.files[0].name);
        } else {
            setFilename('');
        }
        onChange(e);
    };

    const activateInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <>
            <input
                style={{display: 'none'}}
                type="file"
                name={name}
                onChange={onFileChange}
                ref={inputRef}
            />
            <Grid container direction="row" spacing={2} sx={{alignItems: "center"}}>
                <Grid size={6}>
                    <AuthTextField
                        disabled
                        label={label}
                        value={filename}
                        onClick={activateInput}
                        error={error}
                    />
                    {error && (
                        <FormHelperText error sx={{ml: 2}}>
                            {helperText}
                        </FormHelperText>
                    )}
                </Grid>
                <Grid size={6}>
                    <Button variant="contained" onClick={activateInput}
                            sx={{backgroundColor: "#7b3be1"}}>Browse</Button>
                </Grid>
            </Grid>
        </>
    );
};

export default FileInput;