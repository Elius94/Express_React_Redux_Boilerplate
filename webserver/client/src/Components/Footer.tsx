import { AppBar, Container, Toolbar, Typography } from "@mui/material";

export default function Footer() {
    return (
        <AppBar position="fixed" color="default" style={{position: "fixed", top: 'unset', left: 0, bottom: 0}}>
          <Container maxWidth="md">
            <Toolbar>
              <Typography variant="body1" color="inherit" align="center" style={{width: "100%"}}>
                © 2021 webapp - <a href="#" >Cookie Policy</a> - <a href="#" >Privacy Policy</a><br/>Tutti i diritti riservati. E' vietata la riproduzione di tutto o di parte dei dati visualizzati.
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
    )
}