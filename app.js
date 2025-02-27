const express = require('express');
const app = express();

/*
Copy the following session code
This code takes the username if the session is not set and sets the session
After that, username should be accessed using req.sess.username variable
or using socket.request.sess.username inside sockets
Do not change the value of req.sess.username anywhere in your code
The following code is required to integrate the game on the teknack servers
Use http://localhost:3000/unsetSession to unset session and reset username
Change the environment variable during deployment
*/

//********************Session Code Start*******************************//
//Copy from here
const environment = "production";  ///change it to "production" when the game is deployed on the teknack servers

const sessions = require("client-sessions");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionMiddleware = sessions({
    cookieName: 'sess',
    secret: 'dws9iu3r42mx1zvh6k5m',
    duration: 2 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 60
})

app.use(sessionMiddleware);

app.post("/setSession", function (req, res) {
    req.sess.username = req.body.username;    // username is stored in sess variable
    console.log(req.sess.username + " logged in");  // username can be accessed using req.sess.username
    res.sendStatus(200);
});

app.get("/unsetSession", function (req, res) {
    if (environment == "development") {
        req.sess.username = null;
        res.sendStatus(200);
    } else if (environment == "production") {
        res.sendStatus(400);
    }
});


app.use(function (req, res, next) {
    if (!req.sess.username) {
        let login = `<script>
        var username = prompt("Enter username");
        if (username) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    window.location = "/";
                }
            };
            xhttp.open("POST", "/setSession", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("username=" + username);
    
        }
    </script>`;
        if (environment == "development") {
            res.send(login);
        } else if (environment == "production") {
            res.redirect('https://teknack.in');
        }
    } else {
        next();
    }
});
//Copy till here
//********************Session Code End*******************************//

// Your code starts from here 

app.use(express.static(__dirname + '/public'));


app.listen(3014, function () {
  console.log('App listening on port 3014')
})