import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import companySlice from './features/company/companySlice';
import projectSlice from './features/project/projectSlice';
import taskSlice from './features/task/taskSlice';
import budgetSlice from './features/budget/budgetSlice';
import expenseSlice from './features/expense/expenseSlice';
import inspectionSlice from './features/inspection/inspectionSlice';
import dailyLogSlice from './features/dailyLog/dailyLogSlice';
import notificationSlice from './features/notification/notificationSlice';
import chatSlice from './features/chat/chatSlice';
import mediaSlice from './features/media/mediaSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    company: companySlice,
    project: projectSlice,
    task: taskSlice,
    budget: budgetSlice,
    expense: expenseSlice,
    inspection: inspectionSlice,
    dailyLog: dailyLogSlice,
    notification: notificationSlice,
    chat: chatSlice,
    media: mediaSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

