import { Domain } from '../domain';

const stateVersion: number = 1;

const defaultState = (): Domain.AppState => ({
  pages: {
    current: Domain.pageList.find(({ url }) =>
      url === window.location.pathname)?.text || Domain.pages.Home.text,
    list: Domain.pageList,
  },
  posts: {
    info: {},
    projectMap: {},
    segments: Object.keys(Domain.Enums.BlogPageKey).reduce((acc, key) => (
      { ...acc, [key]: {} }
    ), {} as Domain.AppState['posts']['segments'])
  },
  version: stateVersion
});


const initialState: Domain.AppState = {
  ...defaultState(),
};

export default initialState;
export { defaultState };
