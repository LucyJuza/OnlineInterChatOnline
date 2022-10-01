// NoeJuza - OnlineInerChat 2020-2021 - index.js
// Contient le fonctionnement du backend
// ainsi que les logiques d'interactions
// du routage et des sockets
//-----------------------------------------------------------------------------------------------------------------
// Déclaration variables / constantes
const express = require("express");       // Utilisation du module "Express"
const ejs = require('ejs');
const app = express();                    // Le serveur utilise express
var favicon = require('serve-favicon');   // Déclaration de la favicon.
let port = process.env.PORT;              // Détermination du port utilisé (Heroku définit un port par défaut)
if (port == null || port == "") {
  port = 9001;                            // Si projet local -> pas de port définit par heroku, donc initialiser un port
}
var server = app.listen(port);                  // Définition de l'écoute du serveur sur le bon port
const io = require("socket.io").listen(server);   // Intégration du module Socket.io
var path = require("path");                       // Intégration du module "Path
app.use(express.static("public"));              // Définition du répertoire dans lequel trouver les fichiers a envoyer à l'utilisateur
app.use(favicon(path.join(__dirname + "/public/favicon.ico"))); // Utilisation d'une icone pour le site
//-----------------------------------------------------------------------------------------------------------------
//Fonctions et logique d'interaction de routage

/*Fonction qui permets l'optimisation du code et qui évite les copiés-collés*/
function renderchatnox(req,res,nodechat) { // permets d'éviter du copier collé de code sur le render des chats et le log des connexion
  let a = ejs.renderFile(path.join(__dirname + "/public/chatroom.ejs"),{'title' : 'OnlineInterChat - Salon ' + nodechat})
  a.then(result =>{
    res.send(result); // envoi de l'interface web à l'utilisateur
  })
}

// Actions effectuées quand l'utilisateur essaie d'atteindre une page
app.get("/", function(req,res) {
  let a = ejs.renderFile(path.join(__dirname + "/public/index.ejs"))
  a.then(result =>{
    res.send(result); // Envoi de l'interface à l'utilisateur
  })
  
})

// Gestion dynamique des chats
app.get('/chatroom-:id([0-9]+)', function(req, res) {  
  var url = req.url;                  // Url à laquelle l'ulisateur essaie de se connecter
  var chatroomid = url.substring(10); // Récupération du "n° de channel"
  renderchatnox(req,res,chatroomid);  //Appel de la fonction précédement définie pour permettre l'affichage de l'interface
});

//-----------------------------------------------------------------------------------------------------------------
// Partie de gestion des logs
console.log(`L'aplication es démarrée sur le port: ${ port }`); // écriture dans les logs CLI que l'application tourne sur le port "x"
//-----------------------------------------------------------------------------------------------------------------
// Partie de gestion des sockets

io.sockets.on('connection', function(socket) { // quand le socket est crée
    // Sockets de, connexion,changement de pseudo, déconnection et d'envoi de message

    socket.on('username', function(username,nochan) { // quand l'utilisateur a défini son pseudo
        socket.username = username;
        io.emit('is_online' + nochan, '🔵 <i>' + socket.username + ' a rejoint le salon</i>');
    });

    socket.on('usernameChanged', function(username,nochan) { // quand l'utilisateur change son pseudo
        io.emit('chat_message' + nochan, socket.username, "rennomage en \"" + username + "\"");
        socket.username = username;
    });

    socket.on('deco', function(nochan) {  // quand un utilisateur se déconnecte.
        io.emit('is_down' + nochan, '🔴 <i>' + socket.username + ' a quitté le salon</i>');
    })

    socket.on('chat_message', function(message,nochan) { // quand le serveur reçoit un message
        io.emit('chat_message' + nochan, socket.username , message );
    });
  });
//-----------------------------------------------------------------------------------------------------------------