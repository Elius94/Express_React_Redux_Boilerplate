import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { GetUserProfilePic, Logout, UpdateUserProfile } from "../BkConnect";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserProfilePic,
    setUserProfilePic,
    selectUsername,
    selectUserSettingsDialogOpen,
    setUserSettingsDialogOpen,
    setIsLoading,
    selectEmail,
    setEmail,
    selectPermissions,
    setManageUsers,
    selectGuest,
} from '../features/app/appSlice';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import "./MyNavBar.css"
import { TextField, FormControlLabel, Checkbox, Switch, Grid } from '@mui/material';
import { useSnackbar } from "notistack";
import { DropzoneDialog } from "material-ui-dropzone";
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { capitalize } from "lodash";
import { MyAddUserDialog } from "./MyAddEditUserDialog";
import Box from '@mui/material/Box';

function PaperComponent(props) {
    return (
        <Draggable handle="#responsive-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const error = {
    txtEmail: false,
    txtOldPassword: false,
    txtNewPassword1: false,
    txtNewPassword2: false,
}

export default function AccountSettingsDialog() {
    const open = useSelector(selectUserSettingsDialogOpen)
    const [openUploader, setOpenUploader] = React.useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useDispatch()
    const username = useSelector(selectUsername)
    const userEmail = useSelector(selectEmail)
    const userProfilePic = useSelector(selectUserProfilePic)
    const userPermissions = useSelector(selectPermissions)
    const [newUserProfilePic, setNewUserProfilePic] = React.useState("")
    const [userProfilePicChanged, setUserProfilePicChanged] = React.useState("")
    const [localEmail, setLocalEmail] = React.useState("")
    const [oldPassword, setOldPassword] = React.useState("")
    const [newPassword1, setNewPassword1] = React.useState("")
    const [newPassword2, setNewPassword2] = React.useState("")
    const [changePassword, setChangePassword] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar();

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
        return re.test(String(email).toLowerCase());
    }

    const updateForm = (e) => {
        switch (e.target.id) {
            case 'txtEmail':
                setLocalEmail(e.target.value)
                if (validateEmail(e.target.value)) {
                    error[e.target.id] = false
                }
                else {
                    error[e.target.id] = true
                }
                break
            case 'txtOldPassword':
                setOldPassword(e.target.value)
                if (e.target.value.length > 3) {
                    error[e.target.id] = false
                }
                else {
                    error[e.target.id] = true
                }
                break
            case 'txtNewPassword1':
                setNewPassword1(e.target.value)
                if (e.target.value.length > 3 && e.target.value === newPassword2) {
                    error[e.target.id] = false
                }
                else {
                    error[e.target.id] = true
                }
                break
            case 'txtNewPassword2':
                setNewPassword2(e.target.value)
                if (e.target.value.length > 3 && e.target.value === newPassword1) {
                    error[e.target.id] = false
                    error['txtNewPassword1'] = false
                }
                else {
                    error[e.target.id] = true
                }
                break
            default:
                break
        }
    }

    const handleClose = async (action) => {
        switch (action) {
            case 'cancel':
                break
            case 'submit':
                if (localEmail.length === 0 || (changePassword && newPassword2.length === 0) || oldPassword.length === 0) {
                    enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                    return
                }
                for (let er in error) {
                    if (error[er]) {
                        enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                        return
                    }
                }
                dispatch(setIsLoading(true))
                const res = await UpdateUserProfile(username, localEmail, changePassword ? newPassword2 : undefined, oldPassword, userProfilePicChanged ? newUserProfilePic : undefined)
                if (res.accepted) {
                    if (userProfilePicChanged) {
                        dispatch(setUserProfilePic(newUserProfilePic))
                    }
                    dispatch(setEmail(localEmail))
                    localStorage.setItem("email", localEmail)
                    enqueueSnackbar('Profile Updated!', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error! Wrong Password Maybe...', { variant: 'error' });
                    error['txtOldPassword'] = true
                    dispatch(setIsLoading(false))
                    return
                }
                dispatch(setIsLoading(false))
                dispatch(setUserSettingsDialogOpen(false))
                break
            default:
                break
        }
        setUserProfilePicChanged(false)
        setNewUserProfilePic(userProfilePic)
        setLocalEmail("")
        setOldPassword("")
        setNewPassword1("")
        setNewPassword2("")
        dispatch(setUserSettingsDialogOpen(false))
    }

    useEffect(() => {
        setNewUserProfilePic(userProfilePic)
    }, [userProfilePic])

    useEffect(() => {
        setLocalEmail(userEmail)
    }, [userEmail])

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    const addProfilePictureFile = async (files) => {
        if (files.length > 0) {
            try {
                let file = files[0];
                const _base64Planimetry = await readFileAsync(file)
                setNewUserProfilePic(_base64Planimetry)
                setUserProfilePicChanged(true)
                setOpenUploader(false)
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div>
            <Dialog
                fullWidth
                maxWidth={"xs"}
                fullScreen={fullScreen}
                PaperComponent={!fullScreen ? PaperComponent : undefined}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{`Account Settings For ${capitalize(username)}`}</DialogTitle>
                <DialogContent>
                    <Avatar alt={username} src={newUserProfilePic.indexOf('base64,') > -1 ? newUserProfilePic : `data:image/jpeg;base64,${newUserProfilePic}`} />
                    <Button tabIndex={0} variant="outlined" fullWidth onClick={() => setOpenUploader(true)}>Change Profile Picture</Button>
                    <DropzoneDialog
                        open={openUploader}
                        onClose={() => setOpenUploader(false)}
                        filesLimit={1}
                        dropzoneText={"Drop here the profile picture [.JPG] if you want"}
                        onSave={addProfilePictureFile}
                        acceptedFiles={['image/jpeg']}
                        showPreviewsInDropzone={true}
                        showPreviews={false}
                        maxFileSize={2000000}
                    />
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <FormControlLabel
                                key="sw1_new"
                                control={<Switch checked={userPermissions.users_management} onChange={() => { }} id="swRole_users_management" />}
                                label="Edit Users"
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                key="sw2_new"
                                control={<Switch checked={userPermissions.dataset_management} onChange={() => { }} id="swRole_dataset_management" />}
                                label="Edit Dataset"
                                labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        tabIndex={1}
                        autoFocus
                        margin="dense"
                        id="txtEmail"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={localEmail}
                        onChange={updateForm}
                        aria-errormessage="Incorrect Email Address"
                        error={error["txtEmail"]}
                    />
                    <TextField
                        tabIndex={2}
                        autoFocus
                        margin="dense"
                        id="txtOldPassword"
                        label="Old Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={oldPassword}
                        onChange={updateForm}
                        aria-errormessage="Insert the actual Password"
                        error={error["txtOldPassword"]}
                    />
                    <FormControlLabel
                        control={<Checkbox icon={<VpnKeyOutlinedIcon />} checkedIcon={<VpnKeyIcon />} name="checked" onChange={(e) => setChangePassword(e.target.checked)} />}
                        label="Change Password"
                    />
                    <TextField
                        tabIndex={3}
                        autoFocus
                        margin="dense"
                        id="txtNewPassword1"
                        label="Type New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword1}
                        onChange={updateForm}
                        aria-errormessage="Insert the new Password"
                        error={error["txtNewPassword1"]}
                        disabled={!changePassword}
                    />
                    <TextField
                        tabIndex={4}
                        autoFocus
                        margin="dense"
                        id="txtNewPassword2"
                        label="Type New Password Again"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword2}
                        onChange={updateForm}
                        aria-errormessage="New password should be the same"
                        error={error["txtNewPassword2"]}
                        disabled={!changePassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button tabIndex={4} color="secondary" onClick={() => handleClose('submit')} variant="contained">Save User Profile</Button>
                    <Button tabIndex={5} autoFocus onClick={() => handleClose('cancel')} color="primary" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function AccountMenu() {
    const userProfilePic = useSelector(selectUserProfilePic)
    const userPermissions = useSelector(selectPermissions)
    const guest = useSelector(selectGuest)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const username = useSelector(selectUsername)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const Login = () => {
        navigate('/login')
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="button">Hello {username} </Typography>
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }} alt={username} src={userProfilePic.indexOf('base64,') > -1 ? userProfilePic : `data:image/jpeg;base64,${userProfilePic}`}>{username}</Avatar>
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar alt={username} src={userProfilePic.indexOf('base64,') > -1 ? userProfilePic : `data:image/jpeg;base64,${userProfilePic}`} />
                </MenuItem>
                {!guest ? (
                    <MenuItem onClick={e => dispatch(setUserSettingsDialogOpen(true))}>
                        <ListItemIcon>
                            <AccountCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Account Settings" />
                    </MenuItem>
                ) : undefined}
                {userPermissions.users_management ? (
                    <MenuItem onClick={e => dispatch(setManageUsers(true))}>
                        <ListItemIcon>
                            <AccountCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Manage Users" />
                    </MenuItem>
                ) : undefined}
                {!guest ? (
                    <MenuItem onClick={e => Logout(true)}>
                        <ListItemIcon>
                            <ExitToApp fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </MenuItem>
                ) : (
                    <MenuItem onClick={Login}>
                        <ListItemIcon>
                            <ExitToApp fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    );
}

export function MyNavBar(props) {
    const [small, setSmall] = useState(false);
    const dispatch = useDispatch()
    const username = useSelector(selectUsername)

    async function storeUserProfilePic(_username) {
        dispatch(setUserProfilePic(await GetUserProfilePic(_username)))
    }

    useEffect(() => {
        storeUserProfilePic(username)
        const mediaQuery = window.matchMedia('(min-width: 880px)');
        //console.log(mediaQuery)
        if (mediaQuery.matches) {
            setSmall(false)
        } else {
            setSmall(true)
        }
        mediaQuery.addEventListener("change", (mq) => {
            if (mq.matches) {
                setSmall(false)
            } else {
                setSmall(true)
            }
        });
    }, [username]) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div>
            <AppBar id={props.id} position="static" color="default">
                <Toolbar>
                    <IconButton
                        edge="start"
                        aria-label="menu"
                        size="large">
                        <WhatshotIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{!small ? props.active : ""}</Typography>
                    <AccountMenu />
                </Toolbar>
            </AppBar>
            <AccountSettingsDialog></AccountSettingsDialog>
            <MyAddUserDialog></MyAddUserDialog>
        </div>
    );
}