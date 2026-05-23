import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { MoviePage } from './pages/MoviePage';
import { SearchPage } from './pages/SearchPage';
import { Trends } from './pages/Trends';
import { Favorites } from './pages/Favorites';

const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: '/movie/:id', Component: MoviePage },
      { path: '/search', Component: SearchPage },
      { path: '/trends', Component: Trends },
      { path: '/trends/:page', Component: Trends },
      { path: '/favorites', Component: Favorites },
    ],
  },
];

export const router = createBrowserRouter(routes);