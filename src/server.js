// Import
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const https = require('https')
require('dotenv').config()

// global varible
const api_key = process.env.API_KEY
const http_port = process.env.HTTP_PORT
const https_port = process.env.HTTPS_PORT
const tls_cert = process.env.TLS_CERT
const tls_key = process.env.TLS_KEY

// Run express
const app = express()
// Listen on port
app.listen(http_port, () => console.info('Listen on port', http_port))
// Log
app.use(morgan('dev'))
// Read json data
app.use(express.json())
// Read body and url
app.use(bodyParser.urlencoded({ extended: true }))
// Setup template engine
app.set('view engine', 'ejs')
app.use(expressLayouts)
// Setup TLS
https
    .createServer({
        key: tls_key,
        cert: tls_cert
    }, app)
    .listen(https_port, () => {
        console.info('Listen on port', https_port)
    })

// Static file
app.use(express.static('public'))
// Render
app.get('/index.html', (req, res) => {
    res.render('index')
})
function collectQuery(req, res, next) {
    //console.info('POST request headers referer:', req.headers.referer)
    console.info('POST request body:', req.body)

    // Read varible from request body
    const queryString = new URL(req.headers.referer)
    const params = queryString.searchParams
    const ue_ip = params.get('uip')
    const ue_mac = params.get('client_mac')
    const user_name = req.body.user_name
    const user_password = req.body.user_password

    // Get value from params
    const nbi = params.get('nbiIP')
    if (nbi) {
        console.info('nbiIP detected')
        req.nbi = nbi
    } else {
        const message = 'No nbiIP detected in query string'
        //res.render('message', { message: message })
        res.send(message)
        return next('collectQuery: ' + message)
    }
    const requestURL = 'https://' + nbi + ':443/portalintf'
    req.requestURL = requestURL

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
    console.info('Client authentication body:', JSON.stringify(clientAuthenticationBody, null, 4))
    req.clientAuthenticationBody = clientAuthenticationBody

    next()
}

// API login
app.post('/login', collectQuery, async (req, res) => {
    console.info('Start to post nbi')

    // Request authentication
    await fetch(req.requestURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.clientAuthenticationBody),
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




