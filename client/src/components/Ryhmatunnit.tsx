import { Alert, Backdrop, Box, Button, CircularProgress, Container, FormControl, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, type NavigateFunction } from "react-router-dom"
import HowToRegIcon from '@mui/icons-material/HowToReg';


interface Tunnit {
    TunnitId: number
    tunti : string
    paivanmaara : string
    kellonaika : string
    osallistujat : Kayttajat[];
}

interface Kayttajat {
    kayttajaId: number
    kayttajatunnus: string
    ilmoittautumiset: Tunnit[];
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
    const [kayttaja, setKayttaja] = useState<Kayttajat | null>(null);

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

    const ilmoittaudu = async (TunnitId : number) => {
      try {
        const response = await fetch(`http://localhost:3107/api/tunnit/${TunnitId}`, {
          method: "PUT",
          headers: {
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Virhe palvelimessa");
        }

        alert("Ilmoittautuminen onnistui!")
        await haeKayttaja();
      } catch (error) {
        console.error("Ilmoittautuminen epäonnistui:", error);
        alert("Ilmoittautuminen epäonnistui");
      }
    };

    const haeKayttaja = async () => {
      try {
        const response = await fetch("http://localhost:3107/api/tunnit/kayttajaId", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setKayttaja(data);
      } else {
        console.error("Käyttäjää ei syötetty");
      }
      } catch (e) {
        console.error("Virhe käyttäjää haettaessa:", e);
      }
    };

    const peruIlmoittautuminen = async (TunnitId: number) => {
      try {
        const response = await fetch(`http://localhost:3107/api/tunnit/peru/${TunnitId}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error("Virhe peruuttaessa ilmoittautumista");
    }

    alert("Ilmoittautuminen peruttu");
    await haeKayttaja();
    
      } catch (error) {
        console.error("Peruutus epäonnistui:", error);
        alert("Peruutus epäonnistui");
      }
    };

     useEffect(() => {
      const haeTiedot = async () => {
       await apiKutsu();
       if (token) {
         await haeKayttaja();
       }
      };

     haeTiedot();
      }, [token]);

      useEffect(() => {
}, [kayttaja]);

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
                <ListItemText
                  primary={tunnit.tunti}
                  secondary={
                      <Typography variant="body1" color="textPrimary">
                        {tunnit.paivanmaara} klo {tunnit.kellonaika}
                      </Typography>
                  }
                />
                {token && (
                  <Box
                    onClick={() => ilmoittaudu(tunnit.TunnitId)}
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                  <HowToRegIcon />
                  </ListItemIcon>
                  <Typography variant="body1">Ilmoittaudu</Typography>
                  </Box>
                  )}
                
              </ListItem>
            ))}
        </List>

       {token && kayttaja && (
  <>
    <Typography variant="h6" sx={{ marginTop: 4 }}>
      Aktiiviset ilmoittautumiset:
    </Typography>

    {kayttaja.ilmoittautumiset.length > 0 ? (
      <List sx={{ maxWidth: "650px", margin: "auto", marginTop: 2 }}>
        {kayttaja.ilmoittautumiset.map((tunti) => (
          <ListItem
            key={tunti.TunnitId}
            sx={{ textAlign: "center", justifyContent: "space-between" }}
            style={{
              borderBottom: "1px solid",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <ListItemText
              primary={tunti.tunti}
              secondary={
                <Typography variant="body1" color="textPrimary">
                  {tunti.paivanmaara} klo {tunti.kellonaika}
                </Typography>
              }
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => peruIlmoittautuminen(tunti.TunnitId)}
            >
              Peruuta
            </Button>
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>Ei ilmoittautumisia vielä.</Typography>
    )}
  </>
)}

            

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