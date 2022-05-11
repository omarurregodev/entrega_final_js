//DECLARO EL ARRAY QUE VOY A USAR
let userArray = [];

let BTC_price = 0;

let btnAdd = document.getElementById("btnUserAdd");
let btnFilter = document.getElementById("btnFilter");
let busquedaField = document.getElementById("busqueda");
let btnDeleteUserModal = document.getElementById("btnDeleteUserModal");

//let graphicArray = [];


// API PARA MOSTRAR EL PRECIO DEL BTC EN TIEMPO REAL

$(function() {
	fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
	.then((response) => response.json())
	.then((data) => {
		BTC_price = data.bpi.USD.rate;
		console.log('esto es data: '+BTC_price)
		document.getElementById("BTC_current_price").innerHTML = "<span>US$ </span>" + BTC_price;
		})

});

// AGREGO LOS LISTENERS DE LOS BOTONES
$(btnAdd).on("click",function(){
	newUser();
});
$(btnFilter).on("click",function(){
	filterAZ();
});
//btnAdd.addEventListener("click", newUser);
//btnFilter.addEventListener("click", filterAZ);

// LISTENER PARA LA TECLA ENTER EN EL CAMPO DE BUSQUEDA DE PERFIL, O CUANDO SU VALUE CAMBIE
busquedaField.addEventListener("keypress", (event)=> {
	if (event.keyCode === 13) {
		buscar();
	}
});
$(busquedaField).on("change", function(){
	buscar();
});
//busquedaField.addEventListener("change", buscar);

//AQUI TENGO EL LISTENER PARA VALIDAR LA CONFIRMACION DE DELETE USER MODAL
$(btnDeleteUserModal).on("click",function(){
	deleteUserConfirm();
});
//btnDeleteUserModal.addEventListener("click", deleteUserConfirm);

// AQUI ESTOY CARGANDO LA INFORMACION DEL LOCALSTORAGE EN EL ARRAY, DEBO DE HACER ESTO EN EL INICIO SIEMPRE

$(function(){
    //código jQuery adicional
	onloadLocalstorage();
});
//window.addEventListener('DOMContentLoaded', onloadLocalstorage, false);

function onloadLocalstorage() {
	//alert('cargo');

	// OPERADOR TERNARIO DEL CICLO IF DE LA FUNCION
	localStorage.getItem('usuarios') == null 
		? userArray = [] 
		: userArray = localStorage.getItem('usuarios'),userArray = JSON.parse(userArray),graficar(userArray);
	
	
	//if (localStorage.getItem('usuarios') == null) {
	//	userArray = [];
	//} else {
	//	userArray = localStorage.getItem('usuarios');
	//	userArray = JSON.parse(userArray);
	//	graficar(userArray);
	//}

}

function newUser() {
		
	if (document.getElementById("name").value == '' || document.getElementById("age").value == '' || document.getElementById("career").value == '' || document.getElementById("about").value == '') {
		alert('Todos los campos deben de estar llenos');
	} else if(userArray.length == 0){
		let user = {
			name: document.getElementById("name").value,
			age: document.getElementById("age").value,
			career: document.getElementById("career").value,
			about: document.getElementById("about").value
		}
		userArray.push(user);
		//graficar(userArray);


		// AQUI TENGO QUE EXPORTAR LA INFO AL LOCAL STORAGE - Y DEBO DE ENVIAR ESE ARRAY A GRAFICAR
		localStorage.setItem('usuarios', JSON.stringify(userArray));
		//userArray = localStorage.getItem('usuarios');  ESTO ES INNECESARIO
		//userArray = JSON.parse(userArray);  ESTO ES INNECESARIO

		graficar(userArray);
		//console.log(userArray);

	} else {
		nameInput = document.getElementById("name").value;
		filtro = userArray.filter(user => user.name == nameInput); //AQUI ESTOY HACIENDO EL FILTRO PARA VER SI EL USUARIO QUE SE ESTA DIGITANDO YA ESTA CREADO
		if (filtro.length == 0) {
			let user = {
				name: document.getElementById("name").value,
				age: document.getElementById("age").value,
				career: document.getElementById("career").value,
				about: document.getElementById("about").value
			}
			userArray.push(user);
			//graficar(userArray);
	
	
			// AQUI TENGO QUE EXPORTAR LA INFO AL LOCAL STORAGE - Y DEBO DE ENVIAR ESE ARRAY A GRAFICAR
			localStorage.setItem('usuarios', JSON.stringify(userArray));
			//userArray = localStorage.getItem('usuarios');  ESTO ES INNECESARIO
			//userArray = JSON.parse(userArray);  ESTO ES INNECESARIO
	
			graficar(userArray);
			//console.log(userArray);
		} else {
			alert('El usuario ya se encuentra creado');
		}
	}
}

function graficar(usuarios){

	let html_perfil = document.getElementById("perfiles");
			
	//variable que guarda todo el html que quiero renderizar
	perfil='';

	for (let i = 0; i < usuarios.length; i++) {
		perfil = perfil + "<div class='card mx-2 p-2' style='width: 18rem;'> <div class='card-body'> <h5 class='card-title'>"+usuarios[i].name+"</h5> <p class='card-text'>"+usuarios[i].age+"</p> <p class='card-text'>"+usuarios[i].career+"</p> <p class='card-text'>"+usuarios[i].about+"</p> </div> <div class='card-body'> <button class='btn m-2 btn-danger' onClick='deleteUser("+i+");' data-bs-toggle='modal' data-bs-target='#deleteModal'><i class='fa-solid fa-user-xmark'></i>  Eliminar</button></button><button class='btn m-2 btn-primary' onClick='modifyUser("+i+");' data-bs-toggle='modal' data-bs-target='#modifyModal'><i class='fa-solid fa-user-xmark'></i>  Modificar</button></button></div> </div>";
	} 
	//Renderizo todo apenas acabe
	html_perfil.innerHTML = perfil;
	//console.log(perfil)
	//console.log(graphicArray);
}

function filterAZ() {

	userArray.sort( function filtro(a, b) {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		
		return result = 0;
	});
	
	graficar(userArray);
}

function buscar() {
	busqueda = document.getElementById("busqueda").value;
	resultado = [];
	for (let i = 0; i < userArray.length; i++) {
		console.log(userArray[i].name);
		console.log(busqueda);
		if((userArray[i].name).indexOf(busqueda) != -1){
			resultado.push(userArray[i]);
		}
	}
	graficar(resultado);
}

function deleteUser(id){
 	let modalBody = document.getElementById("modalBody");
 	let modalParrafo = "<p class='p'>Estas seguro que deseas eliminar al usuario: "+userArray[id].name+" </p>";
	localStorage.setItem('id_eliminar', id);
	modalBody.innerHTML = modalParrafo;
}

function deleteUserConfirm() {
	id = localStorage.getItem('id_eliminar'); // OBTENGO EL ID DEL SOTRAGE
	if(id != -1){  // VALIDO EL ID QUE ESTA EN EL STORAGE. AL SER POSICION DE ARRAY, TENGO QUE CONTEMPLAR QUE SEAN DIFERENTES DE -1
		userArray.splice(id,1);
		localStorage.setItem('usuarios', JSON.stringify(userArray));  //MODIFICO EL ARRAY DE CARDS
		localStorage.setItem('id_eliminar', -1); // TENGO QUE SETEAR NUEVAMENTE EL VALOR DE ID_ELIMINAR EN -1 PARA QUE LA VALIDACION SEA CORRECTA
		graficar(userArray);
	}

}
