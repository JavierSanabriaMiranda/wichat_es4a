import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18next.js';


/** 
 * This component represents the button with the game info that appears on the user's profile.
 * Clicking on it will show the history of the game it describes.
 */
export const GameHistoryButton = ( {points, correctAnswers, date, onClick}  ) => {

    return (
        <Button 
            variant="outline-primary" 
            className="w-100 my-2"
            onClick={onClick} 
        >
            {points} pts - {correctAnswers}  - {date}
        </Button>
    );
}