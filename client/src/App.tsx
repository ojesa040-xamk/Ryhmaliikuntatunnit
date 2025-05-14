import { Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Kirjautuminen from './components/Kirjautuminen';
import Rekisterointi from './components/Rekisterointi';
import Ryhmatunnit from './components/Ryhmatunnit';

const App : React.FC = () : React.ReactElement => {

    const [token, setToken] = useState<string>(localStorage.getItem("token") ?? "");

  return(
     <Container>
      <Typography variant="h4" align='center' sx={{margin:4}}>Ryhmäliikuntatunnit</Typography>
      
      <Routes>
        <Route path="/" element={<Ryhmatunnit token={token} setToken={setToken}/>}/>
        <Route path="/kirjautuminen" element={<Kirjautuminen setToken={setToken} />}/>
        <Route path="/rekisterointi" element={<Rekisterointi setToken={setToken} />} />
      </Routes>
      
    </Container>
  );
}


export default App;