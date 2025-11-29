import { createSlice } from '@reduxjs/toolkit'

export interface PageState {
    pageId: string,
}

const initialState: PageState = {
    pageId: 'client-add',
}

export const PageSlice = createSlice({
    name: 'page',
    initialState: initialState,
    reducers: {
        setPageId(state, action) {
            state.pageId = action.payload
        },
    }
})

export const {setPageId} = PageSlice.actions;
export default PageSlice.reducer;