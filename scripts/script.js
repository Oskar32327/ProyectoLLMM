const formulario = document.getElementById("contenedor_buscador");
const buscador = document.getElementById("palabra");


formulario.addEventListener("submit", (event) => {
	event.preventDefault();
	const palabra = buscador.value;
	localStorage.setItem("nombre_juego", palabra);  
	console.log(palabra)
	location.href='./Principal/html.html';
});
