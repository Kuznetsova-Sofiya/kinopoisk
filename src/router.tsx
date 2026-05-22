import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { MoviePage } from './pages/MoviePage';
import { SearchPage } from './pages/SearchPage';

const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: '/movie/:id', Component: MoviePage },
      { path: '/search', Component: SearchPage },
    ],
  },
];

export const router = createBrowserRouter(routes);