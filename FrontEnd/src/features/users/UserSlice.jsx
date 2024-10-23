import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: null,
    email: null,
    isVerified: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.isVerified = action.payload.isVerified;
        },
        logoutUser(state) {
            state.username = null;
            state.email = null;
            state.isVerified = false;
        }
    },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;