import React, {useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate} from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import type { NavigateFunction } from 'react-router-dom';


interface Props {
    setToken : Dispatch<SetStateAction<string>>
}

const kirjautuminen: React.FC<Props> = (props : Props) : React.ReactElement => {
    const navigate : NavigateFunction = useNavigate();
    const [loginError, setLoginError] = useState<string>("");

    const lomakeRef = useRef<HTMLFormElement>(null);

    const kirjaudu = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
      
        if (!lomakeRef.current) return;
      
        const formData = new FormData(lomakeRef.current);
      
        const kayttajatunnus = formData.get("kayttajatunnus")?.toString() || "";
        const salasana = formData.get("salasana")?.toString() || "";
      
        if (kayttajatunnus && salasana) {
          const yhteys = await fetch("http://localhost:3107/api/auth/kirjautuminen", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ kayttajatunnus, salasana })
          });
          
          if (yhteys.status === 200) {
            const { token } = await yhteys.json();
            props.setToken(token);
            localStorage.setItem("token", token);
            navigate("/");
          } else {
            const errorText = await yhteys.text();
            setLoginError(errorText || "Kirjautuminen epäonnistui.");
          }
        }
      };
      
    return (
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={kirjaudu}
                        ref={lomakeRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Kirjaudu sisään</Typography>
                            {loginError && (
                            <Typography color="error" variant="body2">{loginError}</Typography>
                            )}
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="kayttajatunnus"
                            />
                            <TextField 
                                label="Salasana"
                                name="salasana"
                                type="password" 
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Kirjaudu
                            </Button>
                            <Button 
                                type="button" 
                                variant="contained" 
                                size="large"
                                onClick={() => navigate("/")}
                            >
                                Peruuta
                            </Button>
                            <Button 
                            onClick={() => navigate("/rekisterointi")}>
                            Rekisteröidy
                            </Button>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
    );
};

export default kirjautuminen;