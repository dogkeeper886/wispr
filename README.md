#### For Ruckus Cloud 3rd Party Captive Portal (WISPr)
This WEB server is an example as testing purpose. The node.js express will print request or response payload in console. Users connect through a 3rd party captive portal, authenticated by a RADIUS server.
#### Application
Listens on port 8080 amd 8443. Require environment variable such as HTTP_PORT, HTTPS_PORT, TLS_CERT, TLS_KEY, and API_KEY for connection to nbi interface which is called Integration Key in WLAN profile.
#### WLAN profile
The Captive Portal URL should enter http://[YOUR_HOST_NAME]:[HTTP_PORT]/index.html
