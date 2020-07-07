document.onmousemove = function(ev){
    let oDiv = document.getElementById('divMouseTxt');
    let oEvent = ev||event;
    let pos = getPos(oEvent);
    oDiv.style.left = pos.x+'px';
    oDiv.style.top = pos.y+'px';
}
function getPos(ev){
	let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
	return {x:ev.clientX+scrollLeft+10,y:ev.clientY+scrollTop+16}
}
// document.onmousemove = function(ev){
//     let oDiv = document.querySelectorAll('.mouseTxt');
//     let oEvent = ev||event;
//     var pos = getPos(oEvent);
//     後面的div跟這前面的div走
//     for(var i = oDiv.length-1; i>0;i--){
//     	oDiv[i].style.left = oDiv[i-1].offsetLeft+'px';
//     	oDiv[i].style.top = oDiv[i-1].offsetTop+'px';
//     }
//     第一個div跟著滑鼠走
//     oDiv[0].style.left = pos.x+'px';
//     oDiv[0].style.top = pos.y+'px';
// }