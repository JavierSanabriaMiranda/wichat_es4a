import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { askClue } from '../../services/LLMService';

/**
 * React component that represents a chat with the LLM to ask for clues.
 * @returns a chat with the LLM to ask for clues.
 */
const LLMChat = ({ name }) => {
    const { t, i18n } = useTranslation();

    const [messages, setMessages] = useState([
        <p className="llm-message" key="welcome">{t('llm-chat-welcome-msg')}</p>
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * This function handles the submit of a message, sending it to the chat.
     * 
     * @param {Event} e - The event of the form submission. 
     */
    /**
     * Handles the form submission event, sending the user's message to the server
     * and updating the chat with the response.
     *
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>} - A promise that resolves when the message handling is complete.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Adding the new message to the chat
        if (!inputValue.trim()) return;

        // Agrega el mensaje del usuario al chat
        const userMsg = <p className="user-message" key={`user-${messages.length}`}>{inputValue}</p>;
        setMessages(prevMessages => [...prevMessages, userMsg]);

        // Activa estado de carga para deshabilitar la entrada mientras se espera la respuesta
        setLoading(true);
        
        try {
            console.log("El idioma es: " + i18n.language);
            const response = await askClue({ 
                name: name, 
                userQuestion: inputValue, 
                language: i18n.language 
            });
            const llmMsg = <p className="llm-message" key={`llm-${messages.length}`}>{response.data.answer}</p>;
            setMessages(prevMessages => [...prevMessages, llmMsg]);
        } catch (error) {
            console.error("Error enviando mensaje:", error);
            const errorMsg = (
                <p className="llm-message error" key={`error-${messages.length}`}>
                    {t('llm-chat-error-msg')}
                </p>
            );
            setMessages(prevMessages => [...prevMessages, errorMsg]);
        } finally {
            setLoading(false);
        }
        
        setInputValue(''); // Cleaning the input field
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="llm-chat">
            <img src="/iconoLLM.png" alt="LLM" className='llm-icon' />
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
                    {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                    {loading && <p className="llm-message loading">Cargando respuesta...</p>}
                </div>
            </Scrollbars>
            <form className="llm-chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="prompt"
                    className="llm-chat-input"
                    placeholder={t('llm-chat-placeholder')}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={loading}
                />
                <button type="submit" className="send-prompt-button" disabled={loading}>
                    <img src="/send-message.png" alt="Enviar" />
                </button>
            </form>
        </div>
    );
};

export default LLMChat;
