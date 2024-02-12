import { createReducer } from 'typesafe-actions';

import { actions } from './actions';
import { Domain } from '../domain';
import initialState from './state';


const handleSetCurrentPage = (
  state: Domain.AppState,
  { payload }: ReturnType<typeof actions.setCurrentPage>,
): Domain.AppState => ({
  ...state,
  pages: {
    ...state.pages,
    current: payload.currentPage,
  }

});
const handleSetPosts = (
  state: Domain.AppState,
  { payload }: ReturnType<typeof actions.setPosts>,
): Domain.AppState => ({
  ...state,
  posts: payload.posts,
});

const rootReducer = createReducer(initialState)
  .handleAction(actions.setCurrentPage, handleSetCurrentPage)
  .handleAction(actions.setPosts, handleSetPosts);

export default rootReducer;
