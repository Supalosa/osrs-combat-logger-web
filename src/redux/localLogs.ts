import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LocalLogsState {
    currentLog: string | null;
}

const initialState: LocalLogsState = {
    currentLog: null,
}

export const localLogSlice = createSlice({
    name: 'localLogs',
    initialState,
    reducers: {
        setLog: (state, action: PayloadAction<string | null>) => {
            state.currentLog = action.payload;
        }
    }
});

export const { setLog } = localLogSlice.actions;

export default localLogSlice.reducer;
