
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

async function getClue(name, userQuestion) {
    try {

        let question = "Un usuario debe adivinar " + name + ". Para ello pregunta: " + userQuestion + ". ¿Qué le responderías? De forma corta y concisa, sin decir explícitamente " + name + ".";
        let model = "empathy"
        let message = await axios.post(`${apiEndpoint}/askllm`, { question, model })
      
        return message;

    } catch (error) {
      console.log(error.response.data);
    }
}

export default getClue;

getClue("España", "Es un país de Europa").then((res) => {
    console.log(res.data);
  });