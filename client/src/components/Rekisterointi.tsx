import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const Rekisterointi: React.FC<Props> = ({ setToken }) => {
  const [kayttajatunnus, setKayttajatunnus] = useState('');
  const [salasana, setSalasana] = useState('');
  const [virhe, setVirhe] = useState('');
  const navigate = useNavigate();

  const rekisteroiKayttaja = async (e: React.FormEvent) => {
    e.preventDefault();
    setVirhe('');

    try {
      const res = await fetch("http://localhost:3107/api/auth/rekisterointi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kayttajatunnus, salasana }),
      });

      if (res.status === 201) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/");
      } else {
        const data = await res.json();
        setVirhe(data.viesti || "Rekisteröinti epäonnistui");
      }
    } catch {
      setVirhe("Palvelimeen ei saada yhteyttä");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Rekisteröidy</Typography>
      <form onSubmit={rekisteroiKayttaja}>
        <Stack spacing={2}>
          {virhe && <Alert severity="error">{virhe}</Alert>}
          <TextField
            label="Käyttäjätunnus"
            value={kayttajatunnus}
            onChange={(e) => setKayttajatunnus(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Salasana"
            type="password"
            value={salasana}
            onChange={(e) => setSalasana(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" type="submit">Rekisteröidy</Button>
          <Button variant="text" onClick={() => navigate("/")}>Peruuta</Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Rekisterointi;