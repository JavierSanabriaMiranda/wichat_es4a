import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18next.js';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';

/** 
 * This component represents each of the questions displayed in the history or summary of a game.
 * Each question has a topic, an image, and a list of answers.
 */
export const QuestionAccordion = ({ questions}) => {
    return (
        <Accordion>
            {questions.map((question, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{index+1}. {question.topic}</Accordion.Header>
                    <Accordion.Body>
                        <Image 
                            src={question.imageUrl} 
                            rounded 
                            className="img-fluid"
                            style={{ maxWidth: '200px', height: 'auto' }} 
                        />
                        {question.answers.map((answer, i) => (
                            <p key={i} style={{ color: answer.isCorrect ? 'green' : 'red' }}>
                                {answer.text} {answer.isCorrect ? '✔' : '❌'}
                            </p>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};
