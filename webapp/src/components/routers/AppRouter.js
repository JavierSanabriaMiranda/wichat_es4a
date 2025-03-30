import { Game } from '../game/Game';
import { Home } from '../home/Home';
import { UserProfile } from '../userMenu/UserProfile';
import { GameResults } from '../game/GameResults';
import { Login } from '../Login';
import { AddUser } from '../AddUser';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { GameConfigProvider } from '../contextProviders/GameConfigProvider';


const gameHistory = [
  {
    "points": 1450,
    "correctAnswers": 18,
    "totalQuestions": 30,
    "date": "01/02/25",
    "questions": [
      {
        "text": "¿Cuál es el cuadro más famoso de Leonardo Da Vinci?",
        "imageUrl": "/logo512.png",
        "wasUserCorrect": true,
        "selectedAnswer": "Respuesta 2",
        "answers": [
          { "text": "Respuesta 1", "isCorrect": false },
          { "text": "Respuesta 2", "isCorrect": true },
          { "text": "Respuesta 3", "isCorrect": false },
          { "text": "Respuesta 4", "isCorrect": false }
        ]
      },
      {
        "text": "¿Cuál es el lenguaje de programación más popular en 2025?",
        "imageUrl": "/logo512.png",
        "wasUserCorrect": false,
        "selectedAnswer": "Respuesta D",
        "answers": [
          { "text": "Respuesta A", "isCorrect": false },
          { "text": "Respuesta B", "isCorrect": false },
          { "text": "Respuesta C", "isCorrect": true },
          { "text": "Respuesta D", "isCorrect": false }
        ]
      },
      {
        "text": "¿En qué año se descubrió América?",
        "imageUrl": "/logo512.png",
        "wasUserCorrect": false,
        "selectedAnswer": null,  // Pregunta saltada
        "answers": [
          { "text": "Opción 1", "isCorrect": false },
          { "text": "Opción 2", "isCorrect": false },
          { "text": "Opción 3", "isCorrect": true },
          { "text": "Opción 4", "isCorrect": false }
        ]
      }
    ]
  }
];


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