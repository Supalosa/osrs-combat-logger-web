
import { configureStore } from '@reduxjs/toolkit';
import localLogsReducer from './redux/localLogs';

export const store = configureStore({
  reducer: {
    logs: localLogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
