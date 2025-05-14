import { Alert, Backdrop, Box, Button, CircularProgress, Container, FormControl, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useNavigate, type NavigateFunction } from "react-router-dom"
import HowToRegIcon from '@mui/icons-material/HowToReg';


interface Tunnit {
    TunnitId: number
    tunti : string
    paivanmaara : string
    kellonaika : string
}

interface apiData {
    tunnit : Tunnit[]
    virhe : string
    haettu : boolean
}

interface Props {
    token : string
    setToken: React.Dispatch<React.SetStateAction<string>>;
}

const Ryhmatunnit : React.FC<Props> = ({token, setToken}) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();
    const [valittuPaiva, setValittuPaiva] = useState<string>("Maanantai 26.5.25");

    const [apiData, setApiData] = useState<apiData>({
        tunnit : [],
        virhe : "",
        haettu : false
    });


    const kirjauduUlos = () => {
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    };

    const tietytPaivat = Array.from(
    new Set(apiData.tunnit.map((t) => t.paivanmaara))
);

    const apiKutsu = async () : Promise<void> => {
        setApiData({
            ...apiData,
            haettu : false
        });

        try {
            const yhteys = await fetch(`http://localhost:3107/api/tunnit`);
        if (yhteys.status === 200) {
            setApiData({
                ...apiData,
                tunnit : await yhteys.json(),
                haettu : true
            });
        } else {
            let virheteksti : string = "";

            switch (yhteys.status) {
                case 404 : virheteksti = "Tunteja ei löytynyt"; break;
                default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
            }
            setApiData({
                ...apiData,
                virhe : virheteksti,
                haettu : true
            });
        } 
    } catch (e : any) {
        setApiData({
            ...apiData,
        virhe : "Palvelimeen ei saada yhteyttä",
        haettu : true
        });
    }
    }

    useEffect(() => {
        apiKutsu();
    }, []);

return (
  <Container sx={{textAlign:'center', backgroundColor:"rgb(207, 248, 255)", padding:"2em", boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)'}}>
    {!apiData.haettu ? (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    ) : apiData.virhe ? (
      <Alert severity="error">{apiData.virhe}</Alert>
    ) : (
      <>
        <FormControl>
          <InputLabel id="date-select-label">Valitse päivä</InputLabel>
          <Select
            labelId="date-select-label"
            value={valittuPaiva}
            label="Valitse päivä"
            onChange={(e) => setValittuPaiva(e.target.value)}
          >
            {tietytPaivat.map((paivanmaara: string) => (
              <MenuItem key={paivanmaara} value={paivanmaara}>
                {paivanmaara}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <List sx={{ maxWidth: "650px", margin: "auto", marginTop: 2 }}>
          {apiData.tunnit
            .filter((tunnit) => valittuPaiva === "" || tunnit.paivanmaara === valittuPaiva)
            .map((tunnit) => (
              <ListItem
                key={tunnit.TunnitId}
                sx={{ textAlign: "center" }}
                style={{
                  borderBottom: "1px solid",
                  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                {token && (
                  <Link 
                  to={`/ilmoittaudu/${tunnit.TunnitId}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                    <Box>
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <HowToRegIcon />
                      </ListItemIcon>
                      <Typography variant="body1">Ilmoittaudu</Typography>
                    </Box>
                  </Link>
                )}
                <ListItemText
                  primary={tunnit.tunti}
                  secondary={
                    <Typography variant="body1" color="textPrimary">
                      {tunnit.paivanmaara} klo {tunnit.kellonaika}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
        </List>

        <Stack direction="row" spacing={2} sx={{ marginTop: 4, justifyContent: "center" }}>
          {!token ? (
            <Button
              type="button"
              variant="contained"
              size="large"
              color="info"
              onClick={() => navigate("/kirjautuminen")}
            >
              Kirjaudu sisään ilmoittautuaksesi
            </Button>
          ) : (
            <Button variant="outlined" onClick={kirjauduUlos}>
              Kirjaudu ulos
            </Button>
          )}
        </Stack>
      </>
    )}
  </Container>
);

};


    export default Ryhmatunnit;