// Handle login button event
function login_button() {
    console.info('Click Login button')

    // Prepare user information
    const data = {
        user_name: document.getElementById('user_name').value,
        user_password: document.getElementById('user_password').value,
        user_url: queryString
    }

    // POST to backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.info('Success:', data)

            // Read backend response
            document.getElementById('result').innerHTML = data.ReplyMessage

            // Check login status
            if (data.ReplyMessage == 'Login succeeded') {
                document.getElementById('login').disabled = true
                setTimeout(() => {
                    location.reload(true)
                }, 3 * 1000)
                //location.reload(true)
                //document.getElementById('redirect').innerHTML = 'Redirect'
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })

}




// Get URL
const queryString = new URL(document.URL)
console.info(queryString)

// Listen to click event
document.getElementById('login').addEventListener('click', login_button)
