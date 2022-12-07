// Import
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

// global varible
const api_key = process.env.API_KEY

// Setup express
const app = express()
const port = process.env.EXPRESS_PORT
app.listen(port, () => console.info('Listen on port', port))
app.set('view engine', 'ejs') // Set template engine
app.use(expressLayouts)
app.use(morgan('combined')) // Log
app.use(express.json()) // Read json data
app.use(bodyParser.urlencoded({ extended: true }))

// Static file
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Route
app.get('/', (req, res) => {
    res.render('index', { user: '' })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    console.info('POST request headers referer:', req.headers.referer)
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
    } else {
        console.info('Skip fetch')
    }
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
    console.info('Client authentication body:', JSON.stringify(clientAuthenticationBody, null, 4))

    try {
        // Check the nbiIP before fetch
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
                //res.send(JSON.stringify(data))
                res.render('submit', { result: JSON.stringify(data) })
            })
            .catch((error) => {
                console.error('Error:', error)
            })

    } catch (error) {

    }
})

app.post('/submit', (req, res) => {
    console.info('POST request headers referer:', req.headers.referer)
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
    } else {
        console.info('Skip fetch')
    }
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
    console.info('Client authentication body:', JSON.stringify(clientAuthenticationBody, null, 4))

    // Check the nbiIP before fetch
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
            //res.send(JSON.stringify(data))
            res.render('submit', { result: JSON.stringify(data) })
        })
        .catch((error) => {
            console.error('Error:', error)
        })
})
