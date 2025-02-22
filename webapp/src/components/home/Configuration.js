import React, { useState } from "react";

const Configuration = () => {
  const [questions, setQuestions] = useState(30);
  const [time, setTime] = useState(120);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-80 relative">
        <button className="text-red-500 text-xl absolute top-2 left-4">✖</button>
        <h2 className="text-xl font-bold text-center mt-4">Configuración de la Partida</h2>
        <div className="mt-4">
          <label className="block text-gray-700">Número de Preguntas:</label>
          <select className="w-full p-2 border rounded mt-1" value={questions} onChange={(e) => setQuestions(e.target.value)}>
            <option>10</option>
            <option>20</option>
            <option>30</option>
          </select>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Tiempo:</label>
          <select className="w-full p-2 border rounded mt-1" value={time} onChange={(e) => setTime(e.target.value)}>
            <option>60s</option>
            <option>120s</option>
            <option>180s</option>
          </select>
        </div>
        <div className="mt-4 text-center">
          <div className="space-x-2">
            <span className="px-2 py-1 bg-purple-400 text-white rounded">Historia</span>
            <span className="px-2 py-1 bg-green-400 text-white rounded">Ciencia</span>
            <span className="px-2 py-1 bg-red-400 text-white rounded">Arte</span>
          </div>
          <div className="mt-2 space-x-2">
            <span className="px-2 py-1 bg-yellow-400 text-white rounded">Deportes</span>
            <span className="px-2 py-1 bg-blue-400 text-white rounded">Geografía</span>
          </div>
        </div>
        <button className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">Jugar</button>
      </div>
    </div>
  );
};

export default Configuration;

