import { createAction } from 'typesafe-actions';

import { Domain } from '../domain';

const setCurrentPage = createAction(
  '[Pages] Set Current Page',
  (currentPage: Domain.AppState['pages']['current']) => ({ currentPage })
)();

const setPosts = createAction(
  '[Posts] Set Posts',
  (posts: Domain.AppState['posts']) => ({ posts })
)();

const actions = { setCurrentPage, setPosts };

export { actions };