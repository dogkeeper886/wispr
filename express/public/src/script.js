// Handle login button event
function login_button() {

    const data = {
        user_name: document.getElementById('user_name').value,
        user_password: document.getElementById('user_password').value,
        user_url: queryString
    };

    fetch('/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            document.getElementById('result').innerHTML = data;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

// Get URL
const queryString = new URL(document.URL);
console.log(queryString);

// Listen to click event
document.getElementById('login').addEventListener('click', login_button);
