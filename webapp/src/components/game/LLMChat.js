import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

/**
 * React component that represents a chat with the LLM to ask for clues.
 * @returns 
 */
const LLMChat = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Mensaje enviado:");
    }

    return (
        <div className="llm-chat">
            <Scrollbars
                style={{ width: '100%', height: '100%' }}
                autoHide // Oculta el scroll cuando no se usa
                autoHideTimeout={1000} // Tiempo antes de ocultarlo
                autoHideDuration={200} // Duración de la animación al ocultarlo
                renderThumbVertical={props => (
                    <div {...props} style={{ backgroundColor: 'gray', borderRadius: '4px' }} />
                )}
            >
                <div className="llm-chat-messages" >
                    <img src="/iconoLLM.png" alt="LLM" className='llm-icon' />
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                    <p>¡Hola! Soy el LLM, ¿en qué puedo ayudarte?</p>
                </div>
            </Scrollbars>
            <form className="llm-chat-form" onSubmit={handleSubmit}>
                <input type="text" name='prompt' className="llm-chat-input" placeholder='¡Pídeme una pista!' />
                <button type="submit" className='send-prompt-button'></button>
            </form>
        </div>
    )
}

export default LLMChat;