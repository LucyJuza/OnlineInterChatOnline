var socket = io();
window.onbeforeunload = sendgoodsocket;
function sendgoodsocket() {
    socket.emit('disconnect2');
}
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
// submit text message without reload/refresh the page
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    var flagbon = false;
    var msg = $('#txt').val();
    if (/\S/.test(msg) && msg.length < 50) { 
                                                                    /* Empêche les messages à corps vide et
                                                                       teste si la chaîne n'est pas trop longue */
        if (/<\/?[a-z][\s\S]*>/i.test(msg)) {
            msg = stripHtml(msg);
        }
        flagbon = true;
    }
    else
    {
        flagbon = false;
    }

    if (flagbon)
    {
        socket.emit('chat_message2', msg);
    }
    $('#txt').val('');
    return false;
    bottom();	//Scroll vers le bas auto
});
// append the chat text message
socket.on('chat_message2', function(msg){
    $('#messages').append($('<li>').html(msg));
    bottom();	//Scroll vers le bas auto
});

// Reçois le scoket is_online qui indique qu'un user s'est connecté ou déconnecté
socket.on('is_online2', function(username) {
    $('#messages').append($('<li>').html(username));
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
socket.emit('username2', username);