function login_authentication(params) {
    // Request client authentication body
    let clientAuthenticationBody = {
        Vendor: 'Ruckus',
        RequestUserName: 'api',
        RequestPassword: 'lv0rfS3k8G7DfEan',
        APIVersion: '1.0',
        RequestCategory: 'UserOnlineControl',
        RequestType: 'Login',
        'UE-IP': params.get('uip'),
        'UE-MAC': params.get('client_mac'),
        'UE-Username': 'jack',
        'UE-Password': 'jack1234',
    };

    // Get value from params
    const nbi = params.get('nbiIP');
    const requestURL = 'https://' + nbi + ':443/portalintf';
    // Display result
    console.log(clientAuthenticationBody);

    fetch(requestURL, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientAuthenticationBody),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

var http = require('http');

//create a server object:
http.createServer(function (req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Request-Method', 'POST');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    if (req.method === 'OPTIONS') {
        console.log('Response OPTION')
    }

    //write a response to the client
    if (req.method === 'POST') {
        console.log('Response POST')
        res.write('Hello World!');
    }

    //end the response
    res.end();

    // Log request
    const req_log = {
        req_url: req.url,
        method: req.method,
        body: req.body.json()
    }
    console.log(req_log)

    // Get parameters
    //const queryString = new URL('http://localhost' + req.url);
    //const params = queryString.searchParams;

    //login_authentication(params);


}).listen(8080); //the server object listens on port 8080
