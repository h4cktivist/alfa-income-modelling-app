import { configureStore } from '@reduxjs/toolkit'
// @ts-ignore
import PageSlice from "./slices/PageSlice.tsx";


export const store = configureStore({
    reducer: {
        page: PageSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

console.log(store)