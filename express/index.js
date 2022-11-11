// Import
const express = require('express')
const morgan = require('morgan')
const fs = require('fs');

// Read key from file
function read_integration_key(file_name) {
    try {
        const data = fs.readFileSync(file_name, 'utf8');
        console.info('Read key from file');
        return data;
    } catch (err) {
        console.error(err);
    }
}

// global varible
const port = 8080
const integration_file_name = 'integration.key'
//const api_key = read_integration_key(integration_file_name)
const api_key = process.env.API_KEY

// Run express
const app = express()

// Log
app.use(morgan('combined'))

// Static file
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'p'))

// Read json data
app.use(express.json())

// API login
app.post('/login', (req, res) => {
    console.info(req.body)

    // Read varible from request body
    const queryString = new URL(req.body.user_url)
    const params = queryString.searchParams
    const ue_ip = params.get('uip')
    const ue_mac = params.get('client_mac')
    const user_name = req.body.user_name
    const user_password = req.body.user_password

    // Get value from params
    const nbi = params.get('nbiIP')
    const requestURL = 'https://' + nbi + ':443/portalintf'

    // Prepare client authentication body
    let clientAuthenticationBody = {
        Vendor: 'Ruckus',
        RequestUserName: 'api',
        RequestPassword: api_key,
        APIVersion: '1.0',
        RequestCategory: 'UserOnlineControl',
        RequestType: 'Login',
        'UE-IP': ue_ip,
        'UE-MAC': ue_mac,
        'UE-Username': user_name,
        'UE-Password': user_password,
    }

    // Debug
    console.info(clientAuthenticationBody)


    // Check the nbiIP before fetch
    if (nbi) {
        console.info('Start to fetch')

        // Request authentication
        fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientAuthenticationBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.info('Success:', data)

                // Send result to frontend
                res.send(JSON.stringify(data))
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    } else {
        console.info('Skip fetch')

        // Send result to frontend
        res.send(JSON.stringify(
            { status: 'Skip fetch' }
        ))
    }
})

// API decrypt IP
app.post('/decrypt_ip', (req, res) => {
    console.info(req.body)

    // Read varible from request body
    const queryString = new URL(req.body.user_url)
    const params = queryString.searchParams
    const ue_ip = params.get('uip')

    // Get value from params
    const nbi = params.get('nbiIP')
    const requestURL = 'https://' + nbi + ':443/portalintf'

    // Prepare request body
    let request_body = {
        Vendor: 'Ruckus',
        RequestUserName: 'api',
        RequestPassword: api_key,
        APIVersion: '1.0',
        RequestCategory: 'GetConfig',
        RequestType: 'DecryptIP',
        'UE-IP': ue_ip,
    }

    // Debug
    console.info(request_body)


    // Check the nbiIP before fetch
    if (nbi) {
        console.info('Start to fetch')

        // Request authentication
        fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request_body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.info('Success:', data)

                // Send result to frontend
                res.send(JSON.stringify(data))
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    } else {
        console.info('Skip fetch')

        // Send result to frontend
        res.send(JSON.stringify(
            { status: 'Skip fetch' }
        ))
    }
})


// Listen on port
app.listen(port, () => console.info('Listen on port', port))

