import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "./Dashboard.css";
import {
  selectIsLoading,
  selectUsername
} from "../features/app/appSlice";
import { MyNavBar } from "../Components";
import { Container } from "@mui/material/";
import Footer from '../Components/Footer';

/**
 * The Dashboard component
 *
 * @export
 * @return {*} 
 */
export default function Dashboard(props: any) {
  const isLoading = useSelector(selectIsLoading)
  const username = useSelector(selectUsername)

  if (username !== undefined) {
    return (
      <>
        <MyNavBar id="navBar" active="webapp"></MyNavBar>
        <Container fixed>

        </Container>
        <Footer></Footer>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }
  else {
    return (<></>)
  }
}