function bottom() {
    $(document).scrollTop($(document).height()); 
};
var Height=document.documentElement.scrollHeight;
var i=1,j=Height,status=0;
var socket = io();
// submit text message without reload/refresh the page
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    var flagbon = false;
    if (/\S/.test($('#txt').val()) && $('#txt').val().length < 45) { // Empêche les messages à corps vide et teste si la chaîne n'est pas trop longue
        flagbon = true;
    }
    else
    {
        flagbon = false;
    }
    
    if (flagbon)
    {
        socket.emit('chat_message', $('#txt').val());
    }
    $('#txt').val('');
    return false;
    bottom();
});
// append the chat text message
socket.on('chat_message', function(msg){
    $('#messages').append($('<li>').html(msg));
    bottom();
});
// append text if someone is online
socket.on('is_online', function(username) {
    $('#messages').append($('<li>').html(username));
    bottom();
});
// ask username
var username = prompt('Quel pseudo souhaitez-vous utiliser ?');
if (/\S/.test(username))
{
    username = "「 " + username + " 」";
}
else
{
    username = "「      」"
}
socket.emit('username', username);