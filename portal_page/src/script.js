function addElement(my_text) {
  // create a new div element
  const newDiv = document.createElement('div');

  // and give it some content
  const newContent = document.createTextNode(my_text);

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById('div1');
  document.body.insertBefore(newDiv, currentDiv);
}

function login_button() {
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
    'UE-Username': document.getElementById('user_name').value,
    'UE-Password': document.getElementById('user_password').value,
  };

  // Get value from params
  const nbi = params.get('nbiIP');
  const requestURL = 'https://' + nbi + ':443/portalintf';
  // Display result
  console.log(clientAuthenticationBody);
  addElement(JSON.stringify(clientAuthenticationBody));

  // Using XMLHttpRequest
  function reqListener() {
    console.log(this.responseText);
  }
  const req = new XMLHttpRequest();
  req.addEventListener('load', reqListener);
  req.open('POST', requestURL);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(clientAuthenticationBody));
}

// Get URL
const queryString = new URL(document.URL);
addElement('URL: ' + queryString);
console.log(queryString);

// Get parameters
const params = queryString.searchParams;

//
document.getElementById('login').addEventListener('click', login_button);
