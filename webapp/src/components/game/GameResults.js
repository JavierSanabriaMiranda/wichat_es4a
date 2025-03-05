import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";

import { ResultSectorChart } from './ResultSectorChart';
import { QuestionAccordion } from "../gameHistory/QuestionAccordion";

export const GameResults = ({ questions, points, numOfCorrectAnswers, numOfWrongAnswers, numOfNotAnswered }) => {

    const { t } = useTranslation();

    return (
        <Container fluid >
            <Row className="justify-content-md-center text-center">
                <Col lg={1} xs={1} className="d-flex justify-content-center">
                    <h2 className="finalPoints">{points}pts</h2>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg={2}>
                    <ResultSectorChart
                        correctAnswers={numOfCorrectAnswers}
                        wrongAnswers={numOfWrongAnswers}
                        notAnswered={numOfNotAnswered}
                    />
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg={6}>
                <h2 className="game-details-title">{t("game-details-text")}</h2>
                <div className="game-details">
                    <QuestionAccordion questions={questions} />
                </div>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg={2} xs={4} className="d-flex gap-2">
                    <Button className="game-results-button" variant="primary">{t('play-again-button-text')}</Button>
                    <Button className="game-results-button" variant="primary">{t('go-back-to-menu')}</Button>
                </Col>
            </Row>
        </Container>
    );
}