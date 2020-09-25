var titrePage = document.title;
console.log(titrePage);
var nochan = titrePage.substring(titrePage.length -1);  // rouve le N° de chan dans lequel l'utilisateur se trouve
console.log(nochan);
function stripHtml(html){
    // Création elément temporaire
    var temporalDivElement = document.createElement("div");
    // Init
    temporalDivElement.innerHTML = html;
    // renvoie le bon texte
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}
function bottom() {
    $(document).scrollTop($(document).height()); 
};
var Height=document.documentElement.scrollHeight;
var i=1,j=Height,status=0;

// Début de la partie de Logique d'interaction sockets
var socket = io();
window.onbeforeunload = sendgoodsocket;
function sendgoodsocket() {
    socket.emit('deco',nochan);
}

// submit text message without reload/refresh the page
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    var flagbon = false;
    var maxSizemsg = 300;
    var msg = $('#txt').val();
    if (/\S/.test(msg) && msg.length <= maxSizemsg) { 
                                                                    /* Empêche les messages à corps vide et
                                                                       teste si la chaîne n'est pas trop longue */
        if (/<\/?[a-z][\s\S]*>/i.test(msg)) {
            msg = stripHtml(msg);
            if ( !(/\S/.test(msg)) )
            {
                flagbon = false;
                displayerrorwhitechar();
            }
            else
            {
                flagbon = true;
            }
        }
        else
        {
            flagbon = true;
            hideerrors();
        }
    }
    else if (msg.length > maxSizemsg)
    {
        flagbon = false;
        displayerrortoolong(500);
    }
    else
    {
        flagbon = false;
        displayerrorwhitechar();
    }

    if (flagbon)
    {
        socket.emit('chat_message', msg, nochan);
    }
    $('#txt').val('');
    return false;
    bottom();	//Scroll vers le bas auto
});
// append the chat text message
socket.on('chat_message' + nochan, function(msg){
    $('#messages').append($('<li>').html(msg));
    bottom();	//Scroll vers le bas auto
});

// Reçois le scoket is_online qui indique qu'un user s'est connecté
socket.on('is_online' + nochan, function(username) {
    $('#messages').append($('<li id="connect">').html(username));
    bottom();	//Scroll vers le bas auto
});

// Reçois socket "is_down" ce qui veut dire que quelqu'un s'est déconnecté
socket.on('is_down' + nochan, function(username) {
    $('#messages').append($('<li id="disconnect">').html(username));
    bottom();	//Scroll vers le bas auto
});
// Partie Pseudo
var username = prompt('Quel pseudo souhaitez-vous utiliser ?');
if (username == null) {
    username = "";
}
if (/\S/.test(username) && username.length < 30)	// Teste si le username n'est pas juste un whitechar et n'est pas trop long
{
    if (!(/<\/?[a-z][\s\S]*>/i.test(username))) {		// Teste si le username contient du markup html
        username = "「 " + username + " 」";
    }
    else
    {
        username = "「 " + stripHtml(username) + " 」";
    }
}
else
{
    username = "「      」"
}
socket.emit('username', username,nochan);