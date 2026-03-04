---
layout: post
title: "Git Redux: Understanding Redux in TypeScript Projects"
date: 2025-01-22 11:20:00 -0400
tags: Redux, TypeScript
summary: Structure Redux with namespaces for cleaner state management
---

Redux state management can become unwieldy as your application grows. Using TypeScript namespaces and proper organization prevents Redux from becoming a tangled mess. This guide shows modern Redux patterns with TypeScript.

## The Redux Pattern Recap

Redux manages application state through:
- **State:** Immutable app data
- **Actions:** Events that describe what happened
- **Reducers:** Functions that return new state based on actions
- **Selectors:** Functions that extract data from state

## Organizing with Namespaces

For large Redux applications, organize actions, reducers, and types in a namespace:

```ts
namespace Blog {
  // State shape
  export type State = {
    posts: Post[];
    selectedPostId: string | null;
    loading: boolean;
    error: string | null;
  };

  // Actions
  export enum ActionTypes {
    FETCH_POSTS = 'BLOG/FETCH_POSTS',
    FETCH_SUCCESS = 'BLOG/FETCH_SUCCESS',
    FETCH_ERROR = 'BLOG/FETCH_ERROR',
    SELECT_POST = 'BLOG/SELECT_POST'
  }

  // Action creators
  export const fetchPosts = () => ({
    type: ActionTypes.FETCH_POSTS
  });

  export const fetchSuccess = (posts: Post[]) => ({
    type: ActionTypes.FETCH_SUCCESS,
    payload: posts
  });

  export const selectPost = (postId: string) => ({
    type: ActionTypes.SELECT_POST,
    payload: postId
  });

  // Reducer
  export const reducer = (
    state: State = initialState,
    action: any
  ): State => {
    switch (action.type) {
      case ActionTypes.FETCH_POSTS:
        return { ...state, loading: true };
      case ActionTypes.FETCH_SUCCESS:
        return { ...state, posts: action.payload, loading: false };
      case ActionTypes.FETCH_ERROR:
        return { ...state, error: action.payload, loading: false };
      case ActionTypes.SELECT_POST:
        return { ...state, selectedPostId: action.payload };
      default:
        return state;
    }
  };

  // Selectors
  export const selectAllPosts = (state: any) => state.blog.posts;
  export const selectSelectedPost = (state: any) => 
    state.blog.posts.find(p => p.id === state.blog.selectedPostId);
  export const selectLoading = (state: any) => state.blog.loading;
}
```

## Usage in Components

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { Blog } from './redux/blog';

const BlogList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(Blog.selectAllPosts);
  const loading = useSelector(Blog.selectLoading);

  const handleSelectPost = (postId: string) => {
    dispatch(Blog.selectPost(postId));
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} onClick={() => handleSelectPost(post.id)}>
          {post.title}
        </div>
      ))}
    </div>
  );
};
```

## Multiple Namespaced Slices

Organize different parts of your state in separate namespaces:

```ts
namespace Blog {
  // Blog state management
}

namespace User {
  export type State = {
    currentUser: User | null;
    isAuthenticated: boolean;
  };

  export enum ActionTypes {
    LOGIN = 'USER/LOGIN',
    LOGIN_SUCCESS = 'USER/LOGIN_SUCCESS',
    LOGOUT = 'USER/LOGOUT'
  }

  export const login = (credentials: LoginRequest) => ({
    type: ActionTypes.LOGIN,
    payload: credentials
  });

  export const reducer = (state: State = initialState, action: any): State => {
    switch (action.type) {
      case ActionTypes.LOGIN_SUCCESS:
        return {
          currentUser: action.payload,
          isAuthenticated: true
        };
      case ActionTypes.LOGOUT:
        return {
          currentUser: null,
          isAuthenticated: false
        };
      default:
        return state;
    }
  };

  export const selectCurrentUser = (state: any) => state.user.currentUser;
  export const selectIsAuthenticated = (state: any) => state.user.isAuthenticated;
}

namespace UI {
  export type State = {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
  };

  export enum ActionTypes {
    TOGGLE_SIDEBAR = 'UI/TOGGLE_SIDEBAR',
    SET_THEME = 'UI/SET_THEME',
    ADD_NOTIFICATION = 'UI/ADD_NOTIFICATION'
  }

  export const toggleSidebar = () => ({
    type: ActionTypes.TOGGLE_SIDEBAR
  });

  export const setTheme = (theme: 'light' | 'dark') => ({
    type: ActionTypes.SET_THEME,
    payload: theme
  });

  export const reducer = (state: State = initialState, action: any): State => {
    switch (action.type) {
      case ActionTypes.TOGGLE_SIDEBAR:
        return { ...state, sidebarOpen: !state.sidebarOpen };
      case ActionTypes.SET_THEME:
        return { ...state, theme: action.payload };
      default:
        return state;
    }
  };

  export const selectSidebarOpen = (state: any) => state.ui.sidebarOpen;
  export const selectTheme = (state: any) => state.ui.theme;
}
```

## Root State and Reducer Combination

```ts
interface RootState {
  blog: Blog.State;
  user: User.State;
  ui: UI.State;
}

type RootAction = 
  | ReturnType<typeof Blog.fetchPosts>
  | ReturnType<typeof User.login>
  | ReturnType<typeof UI.toggleSidebar>;

const rootReducer = (state: RootState = initialState, action: RootAction): RootState => ({
  blog: Blog.reducer(state.blog, action),
  user: User.reducer(state.user, action),
  ui: UI.reducer(state.ui, action)
});

export const store = createStore(rootReducer);
```

## Async Actions (Redux-Thunk Style)

```ts
namespace Blog {
  export const fetchPostsAsync = () => async (dispatch: any) => {
    dispatch(fetchPosts());
    try {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      dispatch(fetchSuccess(posts));
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };

  export const fetchError = (message: string) => ({
    type: ActionTypes.FETCH_ERROR,
    payload: message
  });
}
```

Usage:

```tsx
const BlogList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Blog.fetchPostsAsync());
  }, [dispatch]);
};
```

## File Organization

Organize your Redux code by feature:

```
redux/
  ├── blog/
  │   ├── actions.ts
  │   ├── reducer.ts
  │   ├── selectors.ts
  │   └── types.ts
  ├── user/
  │   ├── actions.ts
  │   ├── reducer.ts
  │   └── selectors.ts
  ├── ui/
  │   └── index.ts
  └── store.ts
```

Or use namespaces in a single file for smaller parts:

```
redux/
  ├── blog.ts      (namespace Blog with everything)
  ├── user.ts      (namespace User with everything)
  └── store.ts
```

## Best Practices

1. **Use consistent naming** for action types
2. **Type everything** - leverage TypeScript's benefits
3. **Namespace each slice** to prevent conflicts
4. **Selectors for accessing state** - don't access state directly
5. **Keep reducers pure** - no side effects
6. **Use middleware** for async operations
7. **Organize by feature** not by type

## Summary

- Namespaces prevent Redux naming collisions
- Organize state, actions, reducers, and selectors together
- TypeScript provides strong type safety
- Selectors create single sources of truth
- Each namespace represents a feature or domain
- Use Redux middleware for async operations
- Keep your Redux consistently structured as the app grows

Properly organizing Redux with TypeScript prevents the common pattern of Redux becoming a mess of files. By using namespaces and keeping things together, you'll have a Redux setup that's easy to navigate and maintain, even as your application scales.

Code on.

-Mike Merin
