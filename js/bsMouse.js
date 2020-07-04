
    document.onmousemove = function(ev){
        //let oDiv = document.getElementById('divMouseTxt');
        let oDiv = document.querySelectorAll('.mouseTxt');
        let oEvent = ev||event;
        var pos = getPos(oEvent);
        //第一個div跟著滑鼠走
        oDiv[0].style.left = pos.x+'px';
        oDiv[0].style.top = pos.y+'px';
        //後面的div跟這前面的div走
        for(var i = oDiv.length-1; i>0;i--){
        	oDiv[i].style.left = oDiv[i-1].offsetLeft+'px';
        	oDiv[i].style.top = oDiv[i-1].offsetTop+'px';
        }
        // let pos = (oEvent) => {
        //     let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //     let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        //     return {x:ev.clientX+scrollLeft+15,y:ev.clientY+scrollTop+20}
        // }
        // oDiv.style.left = pos.x+'px';
        // oDiv.style.top = pos.y+'px';
    }
function getPos(ev){
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
	return {x:ev.clientX+scrollLeft+10,y:ev.clientY+scrollTop+16}
}