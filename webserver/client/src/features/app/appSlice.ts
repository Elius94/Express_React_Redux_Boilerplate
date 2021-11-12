import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';

interface AppState {
  username: string;
  apiKey: string;
  isLoading: boolean;
  guest: boolean;
  navbarSelectionPath: string;
  userProfilePic: string;
  userSettingsDialogOpen: boolean;
  email: string;
  permissions: any;
  manageUsers: boolean;
  selectedUser: string;
  isDrawerOpen: boolean;
}

const initialState: AppState = {
  username: "",
  apiKey: "",
  isLoading: false,
  guest: true,
  navbarSelectionPath: "",
  userProfilePic: "",
  userSettingsDialogOpen: false,
  email: "",
  permissions: {},
  manageUsers: false,
  selectedUser: "new",
  isDrawerOpen: true
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGuest: (state, action: PayloadAction<boolean>) => {
      state.guest = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUserSettingsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.userSettingsDialogOpen = action.payload;
    },
    setUserProfilePic: (state, action: PayloadAction<string>) => {
      state.userProfilePic = action.payload;
    },
    setNavbarSelectionPath: (state, action: PayloadAction<string>) => {
      state.navbarSelectionPath = action.payload;
    },
    setPermissions: (state, action: PayloadAction<any>) => {
      state.permissions = action.payload;
    },
    setManageUsers: (state, action: PayloadAction<boolean>) => {
      state.manageUsers = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUser = action.payload;
    },
    setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const { 
  setUsername, 
  setApiKey, 
  setIsLoading,
  setGuest,
  setEmail, 
  setNavbarSelectionPath,
  setPermissions,
  setUserProfilePic,
  setUserSettingsDialogOpen,
  setManageUsers,
  setSelectedUser,
  setIsDrawerOpen
} = appSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = (amount: number): AppThunk => dispatch => {
  setTimeout(() => {
    
  }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.app.value)`
export const selectUsername = (state: RootState) => state.app.username;
export const selectApiKey = (state: RootState) => state.app.apiKey;
export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectGuest = (state: RootState) => state.app.guest;
export const selectNavbarSelectionPath = (state: RootState) => state.app.navbarSelectionPath;
export const selectUserProfilePic = (state: RootState) => state.app.userProfilePic;
export const selectUserSettingsDialogOpen = (state: RootState) => state.app.userSettingsDialogOpen;
export const selectEmail = (state: RootState) => state.app.email;
export const selectPermissions = (state: RootState) => state.app.permissions;
export const selectManageUsers = (state: RootState) => state.app.manageUsers;
export const selectSelectedUser = (state: RootState) => state.app.selectedUser;
export const selectIsDrawerOpen = (state: RootState) => state.app.isDrawerOpen;


export default appSlice.reducer;
