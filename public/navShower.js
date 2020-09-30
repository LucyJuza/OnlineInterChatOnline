var showlesstext = document.getElementById('ShowLess');
var showmoretext = document.getElementById('ShowMore');
showlesstext.style.display = "none";
function ShowMore() {
  //TODO: Ajout de salons dans la liste et ammenage du truc à la fin
  var list = document.getElementById('liste');
  
  for (let index = 11; index <= 20; index++) {
    let li = document.createElement('li');
    li.classList.add('nav-item');
    li.innerHTML = "<a class=\"nav-link\" href=\"/chatroom-" + index + "\">Salon de chat " +  index + "</a>";
    list.appendChild(li);
    $('#liste').find('#ShowLess').appendTo('#liste');
  }
  showmoretext.style.display = "none";
  showlesstext.style.display = "block";
}
function ShowLess() {
  var list = document.getElementById('liste');
  $('#liste').find('#ShowLess').appendTo('#ShowMore');
  for (let index = 20; index > 10; index--) {
    let li = list.lastChild;
    list.removeChild(li);
  }
  showlesstext.style.display = "none";
  showmoretext.style.display = "block";
}