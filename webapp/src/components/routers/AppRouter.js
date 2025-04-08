import { Game } from '../game/Game';
import { Home } from '../home/Home';
import { UserProfile } from '../userMenu/UserProfile';
import { GameResults } from '../game/GameResults';
import { Login } from '../Login';
import { AddUser } from '../AddUser';
import { Navigate, createBrowserRouter } from 'react-router';
import { AuthRoute } from './AuthRoute';
import { GameConfigProvider } from '../contextProviders/GameConfigProvider';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/game',
    element: <GameConfigProvider><Game /></GameConfigProvider>
  },
  {
    path: '/user',
    element: <UserProfile/>
  },
  {
    path: '/game/results',
    element: <GameResults />
  },
  {
    path: '/login',
    element: <AuthRoute><Login /></AuthRoute>
  },
  {
    path: '/addUser',
    element: <AuthRoute><AddUser /></AuthRoute>
  }
]);

export default router;