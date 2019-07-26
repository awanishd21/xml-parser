
var curr =  parseInt(document.getElementById('load-btn').getAttribute('data-page'));
var limit = parseInt(document.getElementById('load-btn').getAttribute('data-limit'));
var titles = [];
var data = [];
var aPlayers = ''; 
getFeed(curr);
function getFeed(page){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            parseXml(this,page);
        }
    };
    xhttp.open("GET", "https://peakperformers.libsyn.com/rss", true);
    xhttp.send();
    document.getElementById('loading').style="display:block";
}


function parseXml(xml,page) {
    var limit = parseInt(document.getElementById('load-btn').getAttribute('data-limit'));
    var xmlDoc = xml.responseXML; 
    var details = xmlDoc.getElementsByTagName("enclosure");
    if(details.length < limit){
       document.getElementById('load-btn').style="display:none";
       return false; 
    }
    titles = xmlDoc.getElementsByTagName("item");
    for(i=0;i<details.length;i++){
      data.push(details[i].attributes);   
    }
   embedPlayers(page);
}

function embedPlayers(page){
    var indexedArr = [];
    var details1 = [];
    for(i=0;i<data.length;i++){ 
        var details = {};
        details.url = data[i][2].nodeValue; 
        details.title=titles[i].childNodes[1].innerHTML;
        details1.push(details);
        details={};   
        if(i%limit == 0 && i!=0){
            indexedArr.push([i/limit,details1]);
            details1=[];
        } 
    }
    if(curr > indexedArr.length){
      return false;  
    }
    for(i=0;i<indexedArr[page][1].length;i++){
        aPlayers +='<div class="p-container"><div class="details">';
        aPlayers +='<span>'+indexedArr[page][1][i].title+'</span></div>';
        aPlayers +='<div class="player">'; 
        aPlayers += '<audio controls="controls" id="audio_player">';
        aPlayers += '<source src="'+indexedArr[page][1][i].url+'" type="audio/mpeg" />';
        aPlayers += 'Your browser does not support the audio element.</audio></div></div>';
    }
    document.getElementById("wrapper").insertAdjacentHTML('beforeend',aPlayers);
    document.getElementById('loading').style="display:none";
}


var btn = document.getElementById('load-btn');
btn.addEventListener('click',function(){
    curr = curr + 1;
    btn.setAttribute("data-page",curr);
    embedPlayers(curr);
});

