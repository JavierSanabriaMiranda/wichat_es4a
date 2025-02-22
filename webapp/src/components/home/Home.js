import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold">Bienvenido a <span className="text-black">WiChat</span></h1>
      <p className="text-gray-600 mt-2">Saludos</p>
      <div className="mt-6 flex flex-col space-y-4">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Partida Rápida
        </button>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Modo Caos
        </button>
      </div>
    </div>
  );
};

export default Home;
