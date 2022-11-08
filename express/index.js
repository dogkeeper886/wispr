// Import
const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 8080

// Log
app.use(morgan('combined'))

// Static file
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'p'))

// Read json data
app.use(express.json())

// API
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
        RequestPassword: 'tYZI2TPMpVdT6kSl',
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
                console.log('Success:', data)
                res.send(JSON.stringify(data))
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    } else {
        console.info('Skip fetch')
        res.send(JSON.stringify(
            { status: 'Skip fetch' }
        ))
    }

    //res.send('Login')
})


// Listen on port
app.listen(port, () => console.info('Listen on port', port))

