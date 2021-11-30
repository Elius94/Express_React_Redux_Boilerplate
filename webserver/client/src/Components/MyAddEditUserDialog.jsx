import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
    setIsLoading,
    selectManageUsers,
    setManageUsers,
    selectUsername,
    setSelectedUser,
} from '../features/app/appSlice';
import {
    CreateUserProfile,
    DeleteUser,
    GetUsersList,
    UpdateSelectedUser,
} from "../BkConnect";
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField'
import {
    Button,
    Paper,
    useMediaQuery,
    Avatar,
    Box,
    AppBar,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    FormControlLabel,
    Switch,
    Grid,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { DropzoneDialog } from 'material-ui-dropzone'
import { useTheme } from '@mui/material/styles';
import "./MyNavBar.css"
import Draggable from 'react-draggable';
import { clone } from "lodash";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { RenderStandaloneAvatar, FillProfilePicCollection } from "./renderer";
import SwipeableViews from 'react-swipeable-views';

function PaperComponent(props) {
    return (
        <Draggable handle="#adduser-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const error_user = {
    txtUsername: false,
    txtEmail: false,
    txtOldPassword: false,
    txtNewPassword1: false,
    txtNewPassword2: false,
}

const error_edit_users = {
    txtYourPassword: false,
    txtNewPassword1_edit: false,
    txtNewPassword2_edit: false,
}

export const MyAddUserDialog = () => {
    const manageUsers = useSelector(selectManageUsers)
    const [openUploader, setOpenUploader] = React.useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useDispatch()
    const [newUserProfilePic, setNewUserProfilePic] = React.useState("")
    const [userProfilePicChanged, setUserProfilePicChanged] = React.useState("")
    const username = useSelector(selectUsername)
    const [localUsername, setLocalUsername] = React.useState("")
    const [localEmail, setLocalEmail] = React.useState("")
    const [newPassword1, setNewPassword1] = React.useState("")
    const [newPassword2, setNewPassword2] = React.useState("")
    const { enqueueSnackbar } = useSnackbar();
    const [tabVal, setTabVal] = React.useState(0);
    const [usersList, setUsersList] = React.useState([])
    const [checked, setChecked] = React.useState([]);
    const [yourPassword, setYourPassword] = React.useState("")
    const [newPassword1_edit, setNewPassword1_edit] = React.useState("")
    const [newPassword2_edit, setNewPassword2_edit] = React.useState("")
    const [changePassword, setChangePassword] = React.useState(false)
    const [userEnabled, setUserEnabled] = React.useState(false)
    const [editedUserPermissions, setEditedUserPermissions] = React.useState({
        users_management: false, dataset_management: false,
    })
    const [userPermissions, setUserPermissions] = React.useState({
        users_management: false, dataset_management: false,
    })

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
        return re.test(String(email).toLowerCase());
    }

    function validateUsername(username) {
        const re = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        return re.test(String(username).toLowerCase());
    }

    const updateUsersList = async () => {
        const res = await GetUsersList()
        if (res) {
            let usrList = []
            for (let row in res) {
                await FillProfilePicCollection(res[row].username)
                usrList[row] = res[row]
            }
            setUsersList(usrList)
        }
    }

    const UserList = () => {
        return (
            usersList.map(usr => {
                const labelId = `checkbox-list-secondary-label-${usr.username}`
                return (
                    <ListItem key={`${usr.username}_avatar`} button onClick={handleToggle(usr.username)}>
                        <ListItemAvatar>
                            <RenderStandaloneAvatar name={usr.username}></RenderStandaloneAvatar>
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={usr.username} />
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(usr.username)}
                                checked={checked.indexOf(usr.username) !== -1}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            }
            )
        )
    }

    const handleToggle = (value) => () => {
        if (checked.indexOf(value) === -1) {
            setChecked([value]);
            for (let el in usersList) {
                if (usersList[el].username === value) {
                    setUserEnabled(!usersList[el].user_disabled)
                    setEditedUserPermissions({
                        users_management: usersList[el].users_management,
                        dataset_management: usersList[el].dataset_management,
                    })
                    dispatch(setSelectedUser(usersList[el].username))
                }
            }
        }
    };

    useEffect(() => {
        if (manageUsers) {
            updateUsersList()
        }
    }, [manageUsers]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (tabVal === 0) {
            setTimeout(() => dispatch(setSelectedUser("new")), 250)
        } else {
            setTimeout(() => dispatch(setSelectedUser(checked[0])), 250)
        }
    }, [tabVal]) // eslint-disable-line react-hooks/exhaustive-deps

    const updateForm = (e) => {
        switch (e.target.id) {
            case 'txtUsername':
                setLocalUsername(e.target.value)
                if (validateUsername(e.target.value)) {
                    error_user[e.target.id] = false
                }
                else {
                    error_user[e.target.id] = true
                }
                break
            case 'txtEmail':
                setLocalEmail(e.target.value)
                if (validateEmail(e.target.value)) {
                    error_user[e.target.id] = false
                }
                else {
                    error_user[e.target.id] = true
                }
                break
            case 'txtNewPassword1':
                setNewPassword1(e.target.value)
                if (e.target.value.length > 3 && e.target.value === newPassword2) {
                    error_user[e.target.id] = false
                }
                else {
                    error_user[e.target.id] = true
                }
                break
            case 'txtNewPassword2':
                setNewPassword2(e.target.value)
                if (e.target.value.length > 3 && e.target.value === newPassword1) {
                    error_user[e.target.id] = false
                    error_user['txtNewPassword1'] = false
                }
                else {
                    error_user[e.target.id] = true
                }
                break
            case 'swUserEnabled':
                setUserEnabled(e.target.checked)
                break
            case 'txtYourPassword':
                setYourPassword(e.target.value)
                if (e.target.value.length > 3) {
                    error_edit_users[e.target.id] = false
                }
                else {
                    error_edit_users[e.target.id] = true
                }
                break
            case 'txtNewPassword1_edit':
                setNewPassword1_edit(e.target.value)
                if (e.target.value.length > 3) {
                    error_edit_users[e.target.id] = false
                }
                else {
                    error_edit_users[e.target.id] = true
                }
                break
            case 'txtNewPassword2_edit':
                setNewPassword2_edit(e.target.value)
                if (e.target.value.length > 3 && e.target.value === newPassword1_edit) {
                    error_edit_users[e.target.id] = false
                    error_edit_users['txtNewPassword1'] = false
                }
                else {
                    error_edit_users[e.target.id] = true
                }
                break
            case 'swRoleEdit_users_management':
            case 'swRoleEdit_dataset_management':
                let perm = clone(editedUserPermissions)
                perm[e.target.id.replace('swRoleEdit_', '')] = e.target.checked
                setEditedUserPermissions(perm)
                break
            case 'swRole_users_management':
            case 'swRole_dataset_management':
                let _perm = clone(userPermissions)
                _perm[e.target.id.replace('swRole_', '')] = e.target.checked
                setUserPermissions(_perm)
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
                if (localUsername.length === 0 || localEmail.length === 0 || newPassword2.length === 0) {
                    enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                    return
                }
                for (let er in error_user) {
                    if (error_user[er]) {
                        enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                        return
                    }
                }
                dispatch(setIsLoading(true))
                const res = await CreateUserProfile(userPermissions, localUsername.toLocaleLowerCase(), localEmail, newPassword2, userProfilePicChanged ? newUserProfilePic : undefined)
                if (res.accepted) {
                    enqueueSnackbar('User created!', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error! User Exists...', { variant: 'error' });
                    error_user['txtUsername'] = true
                    dispatch(setIsLoading(false))
                    return
                }
                dispatch(setIsLoading(false))
                break
            case 'submit_edit':
                if (yourPassword.length === 0 || (changePassword === true && newPassword2_edit.length === 0)) {
                    enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                    return
                }
                for (let er in error_edit_users) {
                    if (error_edit_users[er]) {
                        enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                        return
                    }
                }
                dispatch(setIsLoading(true))
                // Aggiungere i campi
                const result = await UpdateSelectedUser(username, yourPassword, checked[0], editedUserPermissions, !userEnabled, (changePassword ? newPassword2_edit : undefined))
                if (result) {
                    enqueueSnackbar('User created!', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error! Password is wrong...', { variant: 'error' });
                    error_edit_users['txtYourPassword'] = true
                    dispatch(setIsLoading(false))
                    return
                }
                dispatch(setIsLoading(false))
                break
            case 'delete_user':
                if (yourPassword.length === 0 || (changePassword === true && newPassword2_edit.length === 0)) {
                    enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                    return
                }
                for (let er in error_edit_users) {
                    if (error_edit_users[er]) {
                        enqueueSnackbar('You have to fill the form as well!', { variant: 'error' });
                        return
                    }
                }
                dispatch(setIsLoading(true))
                // Aggiungere i campi
                const _result = await DeleteUser(checked[0])
                if (_result) {
                    enqueueSnackbar('User Deleted!', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error deleting user...', { variant: 'error' });
                    dispatch(setIsLoading(false))
                    return
                }
                dispatch(setIsLoading(false))
                break
            default:
                break
        }
        setUserProfilePicChanged(false)
        setNewUserProfilePic("")
        setLocalUsername("")
        setLocalEmail("")
        setNewPassword1("")
        setNewPassword2("")
        dispatch(setManageUsers(false))
    }

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

    const handleChangeTabs = (event, newValue) => {
        setTabVal(newValue);
    };

    return (
        <div>
            <Dialog
                fullWidth
                maxWidth={"sm"}
                fullScreen={fullScreen}
                PaperComponent={!fullScreen ? PaperComponent : undefined}
                open={manageUsers}
                onClose={handleClose}
                aria-labelledby="adduser-dialog-title"
            >
                <AppBar position="static" color="default">
                    <Tabs
                        id="adduser-dialog-title"
                        value={tabVal}
                        onChange={handleChangeTabs}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="User Manager"
                    >
                        <Tab label="Create New" {...a11yProps(0)} />
                        <Tab label="Edit Existing" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabVal}
                >
                    <TabPanel value={tabVal} index={0} dir={theme.direction}>
                        <DialogContent >
                            <Avatar className="largeAvatar" alt={localUsername} src={newUserProfilePic.indexOf('base64,') > -1 ? newUserProfilePic : `data:image/jpeg;base64,${newUserProfilePic}`} />
                            <Button tabIndex={0} fullWidth variant="outlined" onClick={() => setOpenUploader(true)}>Change Profile Picture</Button>
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
                            <TextField
                                tabIndex={1}
                                autoFocus
                                margin="dense"
                                id="txtUsername"
                                label="Username"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={localUsername}
                                onChange={updateForm}
                                aria-errormessage="Incorrect Username"
                                error={error_user["txtUsername"]}
                            />
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
                                error={error_user["txtEmail"]}
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
                                        control={<Switch checked={userPermissions.users_management} onChange={updateForm} id="swRole_users_management" />}
                                        label="Edit Users"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        key="sw2_new"
                                        control={<Switch checked={userPermissions.dataset_management} onChange={updateForm} id="swRole_dataset_management" />}
                                        label="Edit Dataset"
                                        labelPlacement="start"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        key="sw5"
                                        control={<Switch checked={userEnabled} onChange={updateForm} id="swUserEnabled" />}
                                        label="User Enabled"
                                    />
                                </Grid>
                            </Grid>
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
                                aria-errormessage="Insert the User Password"
                                error={error_user["txtNewPassword1"]}
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
                                aria-errormessage="Password should be the same"
                                error={error_user["txtNewPassword2"]}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button tabIndex={4} color="secondary" variant="contained" onClick={() => handleClose('submit')}>Save User Profile</Button>
                            <Button tabIndex={5} autoFocus onClick={() => handleClose('cancel')} variant="contained" color="primary">Close</Button>
                        </DialogActions>
                    </TabPanel>
                    <TabPanel value={tabVal} index={1} dir={theme.direction}>
                        <DialogContent >
                            <List dense >
                                <UserList></UserList>
                                <TextField
                                    tabIndex={2}
                                    autoFocus
                                    margin="dense"
                                    id="txtYourPassword"
                                    label="Your Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    value={yourPassword}
                                    onChange={updateForm}
                                    aria-errormessage="Insert Your Password"
                                    error={error_edit_users["txtYourPassword"]}
                                />

                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <FormControlLabel
                                            key="sw1"
                                            control={<Switch checked={editedUserPermissions.users_management} onChange={updateForm} id="swRoleEdit_users_management" />}
                                            label="Edit Users"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            key="sw2"
                                            control={<Switch checked={editedUserPermissions.dataset_management} onChange={updateForm} id="swRoleEdit_dataset_management" />}
                                            label="Edit Dataset"
                                            labelPlacement="start"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            key="sw5"
                                            control={<Switch checked={userEnabled} onChange={updateForm} id="swUserEnabled" />}
                                            label="User Enabled"
                                        />
                                    </Grid>
                                </Grid>
                                <FormControlLabel
                                    control={<Checkbox icon={<VpnKeyOutlinedIcon />} checkedIcon={<VpnKeyIcon />} name="checked" onChange={(e) => setChangePassword(e.target.checked)} />}
                                    label="Change Password"
                                />
                                <TextField
                                    tabIndex={3}
                                    autoFocus
                                    margin="dense"
                                    id="txtNewPassword1_edit"
                                    label="Type New Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    value={newPassword1_edit}
                                    onChange={updateForm}
                                    aria-errormessage="Insert the new Password"
                                    error={error_edit_users["txtNewPassword1_edit"]}
                                    disabled={!changePassword}
                                />
                                <TextField
                                    tabIndex={4}
                                    autoFocus
                                    margin="dense"
                                    id="txtNewPassword2_edit"
                                    label="Type New Password Again"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    value={newPassword2_edit}
                                    onChange={updateForm}
                                    aria-errormessage="New password should be the same"
                                    error={error_edit_users["txtNewPassword2_edit"]}
                                    disabled={!changePassword}
                                />
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button tabIndex={4} variant="contained" color="error" onClick={() => handleClose('delete_user')}>Delete Selected User</Button>
                            <Button tabIndex={4} variant="contained" color="secondary" onClick={() => handleClose('submit_edit')}>Update Selected User</Button>
                            <Button tabIndex={5} autoFocus onClick={() => handleClose('cancel')} variant="contained" color="primary">Close</Button>
                        </DialogActions>
                    </TabPanel>
                </SwipeableViews>
            </Dialog>
        </div>
    );
};