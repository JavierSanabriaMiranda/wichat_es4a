import fetch from 'node-fetch';  // Usar import para módulos ES6
import Template from './question_template';  // Mantener importación si usas ES6

const url = "https://query.wikidata.org/sparql";

// Función para obtener preguntas por topic
function getQuestionsByTopic(topic) {
  return Template.filter((q) => q.topics.includes(topic));
}

// Función para ejecutar una consulta SPARQL
async function fetchSPARQL(query) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/sparql-query",
            "Accept": "application/json"
        },
        body: query
    });

    if (!response.ok) {
        throw new Error(`Error en la consulta SPARQL: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.bindings;
}

// Función principal
async function main(topic) {
  const filteredQuestions = getQuestionsByTopic(topic);

  if (filteredQuestions.length === 0) {
    console.log(`No hay preguntas para el tema: ${topic}`);
    return;
  }

  for (const question of filteredQuestions) {
    console.log(`Plantilla: ${question.question}`);

    try {
      const results = await fetchSPARQL(question.query);
      results.forEach((item) => {
        console.log(`Datos obtenidos: ${JSON.stringify(item, null, 2)}`);
      });
    } catch (error) {
      console.error("Error ejecutando SPARQL:", error);
    }
  }
}

// Ejecutar para el topic "geography"
main("geography").catch(console.error);
