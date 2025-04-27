import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const donate = async () => {

    const res = await axios.post(apiEndpoint + '/create-payment');
    const data = await res.data;

    if (data.approvalUrl) {
        return {
            success: true,
            approvalUrl: data.approvalUrl
        }
    } else {
        return {
            error: "Error al generar el enlace de PayPal"
        }
    }

}

export { donate };