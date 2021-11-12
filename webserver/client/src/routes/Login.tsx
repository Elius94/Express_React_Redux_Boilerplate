import ReactDOM from 'react-dom'
import React, { useState } from "react"
import { useDispatch } from 'react-redux';
import { useSpring, animated } from '@react-spring/web'
import Typography from '@material-ui/core/Typography'
import { Button, Dialog, DialogActions, DialogContent, FormControl, FormGroup } from '@mui/material';
import {
  StyledEngineProvider,
} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TryLogin, StartSocketConnection } from "../BkConnect"
import "./Login.css";
import "../App.css";
import { setEmail, setGuest, setPermissions, setUsername as setUser } from '../features/app/appSlice';

export default function Login(props: any) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [state, toggle] = useState(true)
  const { x } = useSpring({
    from: { x: 0 },
    x: state ? 1 : 0,
    config: { duration: 1000 },
  })
  const dispatch = useDispatch()

  function validateForm() {
    return username.length > 0 && password.length > 0
  }

  const handleChange = (prop: string) => (event: any) => {
    switch (prop) {
      case 'password':
        setPassword(event.target.value)
        break
      case 'username':
        setUsername(event.target.value)
        break
      default:
        break
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  };

  async function handleSubmit(event: any) {
    event.preventDefault();
    let response = await TryLogin(username.toLowerCase(), password)
    //console.log(response)
    if (response.accepted === true) {
      if (username !== '') StartSocketConnection(username.toLowerCase(), response.user_data.session_key)

      localStorage.setItem("session_key", response.user_data.session_key)
      localStorage.setItem("isUserAutenticated", "true")
      localStorage.setItem("username", username.toLowerCase())
      localStorage.setItem("email", response.user_data.email)

      localStorage.setItem("permissions", JSON.stringify({
        users_management: response.user_data.users_management,
        dataset_management: response.user_data.dataset_management,
      }))

      dispatch(setUser(username.toLowerCase()))
      dispatch(setGuest(false))
      dispatch(setEmail(response.user_data.email))
      dispatch(setPermissions({
        users_management: response.user_data.users_management,
        dataset_management: response.user_data.dataset_management,
      }))

    } else {
      ReactDOM.render(<><span style={{ color: '#cc0000' }}>Errore:</span> Username o password non validi.</>, document.getElementById('error'));
      toggle(!state)
    }
  }

  const _handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <StyledEngineProvider injectFirst>
        <div>
          <Dialog aria-labelledby="customized-dialog-title" open={true} hideBackdrop={true}>
            <Typography className="title" variant="h5">webapp</Typography>
            <DialogContent dividers>
              <animated.div style={{
                opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
                scale: x.to({
                  range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                  output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
                }),
              }}>
                <FormGroup onKeyDown={_handleKeyDown}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-start-adornment">Username</InputLabel>
                    <OutlinedInput
                      id="outlined-start-adornment"
                      type="text"
                      value={username}
                      tabIndex={1}
                      onChange={handleChange('username')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton tabIndex={5} edge="end" size="large">
                            <AccountCircle />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      tabIndex={2}
                      onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            tabIndex={3}
                            size="large">
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </FormGroup>
              </animated.div>
              <div id="error"></div>
              <p className="copytext text-center text-muted">&copy; 2021 &middot; ELIUSLAB v{process.env.REACT_APP_VERSION}</p>
            </DialogContent>
            <DialogActions>
              <Button tabIndex={4} type="submit" size="large" variant="contained" color="primary" onClick={handleSubmit} disabled={!validateForm()}>Login</Button>
            </DialogActions>
          </Dialog>
        </div>
    </StyledEngineProvider>
  );
}