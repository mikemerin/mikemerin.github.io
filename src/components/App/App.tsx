import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { Blog, Home, Projects } from '../../containers';
import { actions } from '../../redux/actions';
import { getPosts } from '../../utils';
import { Navbar } from '../Navbar';

import './App.css';

const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const [blogPostsFetched, setBlogPostsFetched] = useState<boolean>(false);

  useEffect(() => {
    try {
      getPosts().then((res) => {
        dispatch(actions.setPosts(res));
        setBlogPostsFetched(true);
      });
    } catch (err) {
      console.log('Error fetching posts:', err);
      setBlogPostsFetched(true);
    }
  }, [dispatch]);

  return (<div className='App'>
    <Navbar />
    {blogPostsFetched ?
      <div className='Main'>
        <Routes>
          <Route index element={<Home />} />
          <Route path='blog/*' element={<Blog />} />
          <Route path='projects/*' element={<Projects />} />
        </Routes>
      </div>
      : <div>Fetching blog posts...</div>
    }
  </div>
  );
}

export { App };
