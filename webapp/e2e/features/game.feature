Feature: Game functionality

Scenario: The user completes a normal game with 10 geography questions, 60 seconds each
  Given The user has configured a game with:
    | numberOfQuestions | timePerQuestion | topic     |
    | 10                | 60              | geography |
  When The user answers all questions
  Then The user is redirected to the game results page
  And The results show 10 questions answered