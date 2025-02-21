import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

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
            <div className="llm-chat-messages" >
                <img src="/iconoLLM.png" alt="LLM" className='llm-icon'/>
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
            <form className="llm-chat-form" onSubmit={handleSubmit}>
                <input type="text" name='prompt' className="llm-chat-input" placeholder='¡Pídeme una pista!' />
                <button type="submit" className='send-prompt-button'></button>
            </form>
        </div>
    )
}

export default LLMChat;