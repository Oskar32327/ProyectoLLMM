let APIkey="61C714C002B0A8E9C153533B5BE53381";
let urlAllGames = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/?key='+APIkey;
let urlGame='https://store.steampowered.com/api/appdetails?appids=';
let urlSteamLink='https://store.steampowered.com/app/';
let urlNews='https://api.steampowered.com/ISteamNews/GetNewsForApp/v1?appid=';


const nombre_juego = localStorage.getItem("nombre_juego");  

let appid =0;

const imagenHeader = document.getElementById('imagenHeader');
const nombreJuego = document.getElementById('nombreJuego');
const descripcion = document.getElementById('descripcion');
const genero = document.getElementById('genero');
const idiomas = document.getElementById('idiomas');
const desarrolladores = document.getElementById('desarrolladores');
const so = document.getElementById('so');
const enlace = document.getElementById('enlace');
const video = document.getElementById('video');
const imagen1 = document.getElementById('imagen1');
const imagen2 = document.getElementById('imagen2');
const imagen3 = document.getElementById('imagen3');
const imagen4 = document.getElementById('imagen4');


const tituloNoticia1 = document.getElementById('tituloNoticia1');
const tituloNoticia2 = document.getElementById('tituloNoticia2');
const tituloNoticia3 = document.getElementById('tituloNoticia3');

const noticia1 = document.getElementById('noticia1');
const noticia2 = document.getElementById('noticia2');
const noticia3 = document.getElementById('noticia3');

async function obtenerJSON(url){
  const respuesta = await fetch(url);
  const json = await respuesta.json();
  return json;
}


obtenerJSON(urlAllGames).then(json => { 
	let re = new RegExp(nombre_juego.toLowerCase());
	let arrayResultados=[];
	for(var i=0; i<json.applist.apps.length; i++){
		var valor = json.applist.apps[i].name.toLowerCase();
		if (valor.search(re)!=-1) {
			arrayResultados.push(json.applist.apps[i].appid)
		}
	}
	appid=arrayResultados.sort(function(a, b) { return a - b; })[0];

	console.log(appid)
	volverMenu(appid);
	obtenerInformacionJuego(appid);
});


function volverMenu(appid){
	let Undefined='undefined';
	if (typeof appid === Undefined) {
		location.href='../index.html';
		alert("El nombre del juego no es valido, por favor introduzca uno nuevo")
	}
}

function obtenerInformacionJuego(appid){
	obtenerJSON(urlGame+appid).then(json => { 
		let myJsonStr=JSON.stringify(json);
		let re = new RegExp(appid);

		myJsonStr = myJsonStr.replace(re, "gameInfo");
		let myJson= JSON.parse(myJsonStr);

		rellenarInformacion(myJson);
	});

	obtenerJSON(urlNews+appid).then(json => { 

		rellenarNoticias(json);

	});
	
}

function rellenarNoticias(json){
	let re = new RegExp(/\[[img].*?\/img]|\[[list].*?\/list]|\[[url].*?\/url]|\\n|\[.*?\]|\<.*?\>/gi);
	for (var i = 1; i<=3; i++) {
		this['tituloNoticia'+i].innerHTML=`<p><a target="_blank" href="${json.appnews.newsitems.newsitem[i].url}">${json.appnews.newsitems.newsitem[i].title}"</a></p>`;
		this['noticia'+i].innerHTML=`<p>${json.appnews.newsitems.newsitem[i].contents.replace(re,"")}<p>`;
	}
}


function rellenarInformacion(json){
	document.body.style.background = `url(${json.gameInfo.data.background}) no-repeat center center fixed`;
	document.body.style.backgroundSize = `cover`;
	imagenHeader.innerHTML=`<img src=${json.gameInfo.data.header_image}></img>`;
	nombreJuego.innerHTML=`<p>${json.gameInfo.data.name}</p>`;

	descripcion.innerHTML=`<p><b>Descripción</b>: ${json.gameInfo.data.short_description}</p>`;
	let generos="<b>Géneros</b>: ";
	for (var i = json.gameInfo.data.genres.length - 1; i >= 0; i--) {
		generos+=json.gameInfo.data.genres[i].description+" ";
	}
	genero.innerHTML=`<p>${generos}</p>`;
	idiomas.innerHTML=`<p><b>Idiomas</b>: ${json.gameInfo.data.supported_languages}</p>`;
	desarrolladores.innerHTML=`<p><b>Desarrolladores</b>: ${json.gameInfo.data.developers}</p>`;
	let sis_oper="<b>SO</b>: ";

	if (json.gameInfo.data.platforms.windows) {
		sis_oper+="Windows "
	}
	if (json.gameInfo.data.platforms.mac) {
		sis_oper+="Mac "
	}
	if (json.gameInfo.data.platforms.linux) {
		sis_oper+="Linux"
	}

	so.innerHTML=`<p>${sis_oper}</p>`;

	enlace.innerHTML=`<p><a target="_blank" href="${urlSteamLink+appid}">Enlace Steam</a></p>`;


	video.innerHTML=`<video src="${json.gameInfo.data.movies[0].mp4.max}" width="100%" controls></video>`;

	for (var i = 1; i<=4; i++) {

	this['imagen'+i].innerHTML=`<img src="${json.gameInfo.data.screenshots[i].path_full}">`;

	}
	

}