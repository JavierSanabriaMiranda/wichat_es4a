import { Game } from '../game/Game';
import { Home } from '../home/Home';
import { UserProfile } from '../userMenu/UserProfile';
import { GameResults } from '../game/GameResults';
import { Login } from '../Login';
import { AddUser } from '../AddUser';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { GameConfigProvider } from '../game/GameConfigProvider';


const gameHistory = [
  {
    "points": 1450,
    "correctAnswers": 18,
    "totalQuestions": 30,
    "date": "1/02/25", //Ojo con el formato de la fecha
    "questions": [
      {
        "topic": "Tecnología",
        "imageUrl": "/logo512.png",
        "answers": [
          { "text": "Respuesta 1", "isCorrect": false },
          { "text": "Respuesta 2", "isCorrect": true },
          { "text": "Respuesta 3", "isCorrect": false },
          { "text": "Respuesta 4", "isCorrect": false }
        ]
      },
      {
        "topic": "Tecnología",
        "imageUrl": "/logo512.png",
        "answers": [
          { "text": "Respuesta A", "isCorrect": false },
          { "text": "Respuesta B", "isCorrect": false },
          { "text": "Respuesta C", "isCorrect": true },
          { "text": "Respuesta D", "isCorrect": false }
        ]
      }
    ]
  },
  {
    "points": 1250,
    "correctAnswers": 14,
    "totalQuestions": 25,
    "date": "12/02/25",
    "questions": [
      {
        "topic": "Tecnología",
        "imageUrl": "/logo512.png",
        "answers": [
          { "text": "Opción 1", "isCorrect": true },
          { "text": "Opción 2", "isCorrect": false },
          { "text": "Opción 3", "isCorrect": false },
          { "text": "Opción 4", "isCorrect": false }
        ]
      }
    ]
  }
];

const questions = [
  {
    "topic": "Tecnología",
    "imageUrl": "/logo512.png",
    "answers": [
      { "text": "Respuesta 1", "isCorrect": false },
      { "text": "Respuesta 2", "isCorrect": true },
      { "text": "Respuesta 3", "isCorrect": false },
      { "text": "Respuesta 4", "isCorrect": false }
    ]
  },
  {
    "topic": "Tecnología",
    "imageUrl": "/logo512.png",
    "answers": [
      { "text": "Respuesta A", "isCorrect": false },
      { "text": "Respuesta B", "isCorrect": false },
      { "text": "Respuesta C", "isCorrect": true },
      { "text": "Respuesta D", "isCorrect": false }
    ]
  }
]

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
    element: <UserProfile userName={"Test"} gameHistory={gameHistory} />
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