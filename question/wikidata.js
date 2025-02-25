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
  const offset = Math.floor(Math.random() * 100); // Generar un desplazamiento aleatorio
  const finalQuery = query + `LIMIT 100 OFFSET ${offset}`;
  console.log("Consulta generada:", finalQuery);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      "Accept": "application/json"
    },
    body: finalQuery
  });

  if (!response.ok) {
    throw new Error(`Error en la consulta SPARQL: ${response.statusText}`);
  }

  const data = await response.json();
  const allResults = data.results.bindings;

  const uniqueResults = [];
  const seenValues = new Set();

  for (const result of allResults) {
    const answerKey = "label"; 
    if (result[answerKey]?.value && !seenValues.has(result[answerKey].value)) {
      seenValues.add(result[answerKey].value);
      uniqueResults.push(result);
    }
    // Paramos cuando tengamos 4 respuestas únicas
    if (uniqueResults.length == 4) break; 
  }

  return uniqueResults;
}

async function main(topic) {
  try {
    const templates = loadQuestionTemplatesWithTopic(topic); // Filtramos las plantillas por el tema

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]; // Seleccionamos una plantilla aleatoria
    console.log(`Plantilla seleccionada: ${randomTemplate.question}`);

    const query = randomTemplate.query;  

    const results = await executeQuery(query);

    // Comprobar si results contiene datos antes de imprimir
    if (results.length > 0) {
      results.forEach((item) => {
        console.log(`Datos obtenidos: ${JSON.stringify(item, null, 2)}`);
      });
    }else{
      console.log("nun hay datos")
    }

  } catch (error) {
    console.error("Error ejecutando el script:", error);
  }
}

main("sciencee").catch(console.error);
