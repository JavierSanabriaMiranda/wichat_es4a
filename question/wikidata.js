import fetch from 'node-fetch';
import fs from 'fs';  // Requerimos el módulo fs para leer archivos JSON
import path from 'path';

const url = "https://query.wikidata.org/sparql";

// Función para cargar el archivo JSON de plantillas
function loadQuestionTemplates() {
  // Construimos la ruta de manera explícita
  const filePath = path.resolve('question', 'question_template.json');
  
  // Mostramos la ruta para depurar
  console.log("Ruta al archivo JSON:", filePath);

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    throw error;
  }
}

function loadQuestionTemplatesWithTopic(topic) {
  // Construimos la ruta de manera explícita
  const filePath = path.resolve('question', 'question_template.json');

  // Mostramos la ruta para depurar
  console.log("Ruta al archivo JSON:", filePath);

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const templates = JSON.parse(data);

    // Filtrar las plantillas que contienen el topic proporcionado
    const filteredTemplates = templates.filter(template => template.topics.includes(topic));
    return filteredTemplates; 
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    throw error;
  }
}

async function executeQuery(query) {
  const offset = Math.floor(Math.random() * 100);
  query += offset;

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

async function main(topic) {
  try {
    const templates = loadQuestionTemplatesWithTopic(topic) //cogemos solo las plantillas que pasen por el filtrado de topic

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]; //seleccionamos una plantilla aleatoria
    console.log(`Plantilla seleccionada: ${randomTemplate.question}`);

    const query = randomTemplate.query;  //obtenemos la consulta SPARQL de la plantilla seleccionada

    const results = await executeQuery(query);
    results.forEach((item) => {
      console.log(`Datos obtenidos: ${JSON.stringify(item, null, 2)}`);
    });
  } catch (error) {
    console.error("Error ejecutando el script:", error);
  }
}

main("history").catch(console.error);