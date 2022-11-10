# wispr
For Ruckus Cloud 3rd Party Captive Portal (WISPr). Users connect through a 3rd party captive portal, authenticated by a RADIUS server.
This WEB server example is for testing purpose as user information send by HTTP. The node.js express will print request or response paylod in console.
Application listen on port 8080.
Require environment varible API_KEY for connection to nbi interface which is called Integration Key in WLAN profile.
In the WLAN profile, the Captive Portal URL should enter http://<your-ip>:8080/index.html
