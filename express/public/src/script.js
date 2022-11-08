// Handle login button event
function login_button() {
    console.info('Click Login button')

    const data = {
        user_name: document.getElementById('user_name').value,
        user_password: document.getElementById('user_password').value,
        user_url: queryString
    }

    fetch('/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.info('Success:', data)
            document.getElementById('result').innerHTML = data.ReplyMessage
            if (data.ReplyMessage == 'Login succeeded') {
                document.getElementById('login').disabled = true
                document.getElementById('logout').disabled = false
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })

}

// Handle logout button event
function logout_button () {
    console.info('Click Logout button')

}

// Get URL
const queryString = new URL(document.URL)
console.info(queryString)

// Listen to click event
document.getElementById('login').addEventListener('click', login_button)
document.getElementById('logout').addEventListener('click', logout_button)
