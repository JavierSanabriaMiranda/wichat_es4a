import fetch from 'node-fetch';
import fs from 'fs';  // Requerimos el módulo fs para leer archivos JSON
import path from 'path';

const url = "https://query.wikidata.org/sparql";

// Función para cargar el archivo JSON de plantillas
function loadQuestionTemplates() {
  // Construimos la ruta de manera explícita
  const filePath = path.resolve('questions', 'question_template.json');
  
  // Mostramos la ruta para depurar
  console.log("Ruta al archivo JSON:", filePath);

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data); // Parseamos el JSON
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    throw error;
  }
}

// Función para ejecutar la consulta SPARQL
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
async function main() {
  try {
    const templates = loadQuestionTemplates();  // Cargamos las plantillas desde el archivo

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]; // Seleccionamos una plantilla aleatoria
    console.log(`Plantilla seleccionada: ${randomTemplate.question}`);

    const query = randomTemplate.query;  // Obtenemos la consulta SPARQL de la plantilla seleccionada

    const results = await fetchSPARQL(query);
    results.forEach((item) => {
      console.log(`Datos obtenidos: ${JSON.stringify(item, null, 2)}`);
    });
  } catch (error) {
    console.error("Error ejecutando el script:", error);
  }
}

main().catch(console.error);
