import { Domain } from '../domain';

const getPages = ({ pages }: Domain.AppState): Domain.AppState['pages'] => pages;
const getPosts = ({ posts }: Domain.AppState): Domain.AppState['posts'] => posts;
const getState = (state: Domain.AppState): Domain.AppState => state;

const selectors = { getPages, getPosts, getState };

export { selectors };
