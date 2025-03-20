import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * React component that represents a chat with the LLM to ask for clues.
 * @returns a chat with the LLM to ask for clues.
 */
const LLMChat = () => {

    const { t } = useTranslation();

    const [llmMessages, setLlmMessages] = useState([
        <p className="llm-message">{t('llm-chat-welcome-msg')}</p>
    ]);
    const [userMessages, setUserMessages] = useState([]);

    const [inputValue, setInputValue] = useState('');

    /**
     * This function handles the submit of a message, sending it to the chat.
     * 
     * @param {Event} e - The event of the form submission. 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        // Adding the new message to the chat
        if (inputValue.trim()) {
            setUserMessages(prevMessages => [
                ...prevMessages,
                <p className="user-message">{inputValue}</p> // Mensaje del usuario
            ]);
            setInputValue(''); // Cleaning the input field

        }
        console.log("Mensaje enviado:", inputValue);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <Card className="llm-chat">
            <Scrollbars
                style={{ width: '100%', height: '100%' }}
                autoHide // Oculta el scroll cuando no se usa
                autoHideTimeout={1000} // Tiempo antes de ocultarlo
                autoHideDuration={200} // Duración de la animación al ocultarlo
                renderThumbVertical={props => (
                    <div {...props} style={{ backgroundColor: 'gray', borderRadius: '4px' }} />
                )}
                renderThumbHorizontal={props => (
                    <div {...props} style={{ display: 'none' }} /> // Hide horizontal scrollbar
                )}
            >
                <div className="llm-chat-messages">
                    <div className="llm-chat-llm-messages">
                        {llmMessages.map((msg, index) => (
                            <Row>
                                <Col md={2}>
                                    <img src="/iconoLLM.png" alt="LLM" className='llm-icon' />
                                </Col>
                                <Col md={8}>
                                    {msg}
                                </Col>
                            </Row>
                        ))}
                    </div>
                    <div className="llm-chat-user-messages">
                        {userMessages.map((msg, index) => (
                            <Row>
                            <Col md={4}>
                            </Col>
                            <Col md={8}>
                                {msg}
                            </Col>
                        </Row>
                        ))}
                    </div>
                </div>
            </Scrollbars>
            <form className="llm-chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name='prompt'
                    className="llm-chat-input"
                    placeholder={t('llm-chat-placeholder')}
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button type="submit" className='send-prompt-button'><img src="/send-message.png"></img></button>
            </form>
        </Card>
    )
}

export default LLMChat;