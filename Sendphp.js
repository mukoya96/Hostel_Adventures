const axios = require('axios');

const sendDataToPHP = async () => {
    try {
        const data = {
            name: 'John Doe',
            email: 'john@example.com'
        };

        // Sending POST request to the PHP script
        const response = await axios.post('http://localhost/mywebsite/Node_js/php/Send.php', data);

        console.log(response.data); // Output the response from PHP
    } catch (error) {
        console.error('Error sending data:', error);
    }
};


