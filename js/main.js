//DECLARO EL ARRAY QUE VOY A USAR
let userArray = [];

let BTC_price = 0;

let btnAdd = document.getElementById("btnUserAdd");
let btnFilter = document.getElementById("btnFilter");
let busquedaField = document.getElementById("busqueda");
let btnDeleteUserModal = document.getElementById("btnDeleteUserModal");
let btnModifyUserModal = document.getElementById("btnModifyUserModal");

//let graphicArray = [];

// API PARA MOSTRAR EL PRECIO DE LAS CRYPTOS PRINCIPALES

$(function () {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Host': 'coingecko.p.rapidapi.com',
			'X-RapidAPI-Key': 'f53d130201msh51c2bcdc7b28436p126b7bjsne4b54f265fdb'
		}
	};
	
	fetch('https://coingecko.p.rapidapi.com/coins/bitcoin?localization=true&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=false', options)
	.then(response => response.json())
	.then(data => {
		//console.log(data);
		BTC_price = data.market_data.current_price.usd;
		BTC_price_change_24h = data.market_data.price_change_24h;
		if (BTC_price_change_24h > 0) {
			document.getElementById("BTC_current_price").innerHTML = "<span style='color:green'> <i class='fa-solid fa-sort-up'></i> US$ "+ BTC_price +"</span>";
		} else {
			document.getElementById("BTC_current_price").innerHTML = "<span style='color:red'> <i class='fa-solid fa-sort-down'></i> US$ "+ BTC_price +"</span>";
		}
	});
	fetch('https://coingecko.p.rapidapi.com/coins/ethereum?localization=true&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=false', options)
	.then(response => response.json())
	.then(data => {
		//console.log(data);
		ETH_price = data.market_data.current_price.usd;
		ETH_price_change_24h = data.market_data.price_change_24h;
		if (ETH_price_change_24h > 0) {
			document.getElementById("ETH_current_price").innerHTML = "<span style='color:green'> <i class='fa-solid fa-sort-up'></i> US$ "+ ETH_price +"</span>";
		} else {
			document.getElementById("ETH_current_price").innerHTML = "<span style='color:red'> <i class='fa-solid fa-sort-down'></i> US$ "+ ETH_price +"</span>";
		}
	});
	fetch('https://coingecko.p.rapidapi.com/coins/solana?localization=true&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=false', options)
	.then(response => response.json())
	.then(data => {
		//console.log(data);
		SOL_price = data.market_data.current_price.usd;
		SOL_price_change_24h = data.market_data.price_change_24h;
		if (SOL_price_change_24h > 0) {
			document.getElementById("SOL_current_price").innerHTML = "<span style='color:green'> <i class='fa-solid fa-sort-up'></i> US$ "+ SOL_price +"</span>";
		} else {
			document.getElementById("SOL_current_price").innerHTML = "<span style='color:red'> <i class='fa-solid fa-sort-down'></i> US$ "+ SOL_price +"</span>";
		}
	});
});

// API PARA MOSTRAR DATOS DEL CLIMA EN BOGOTA D.C

$(function () {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com',
			'X-RapidAPI-Key': 'f53d130201msh51c2bcdc7b28436p126b7bjsne4b54f265fdb'
		}
	};
	
	fetch('https://open-weather13.p.rapidapi.com/city/bogota', options)
	.then(response => response.json())
	.then(data => {
		temp_data_f = data.main.temp;
		//console.log(temp_data_f);
		temp_data_c = ((temp_data_f - 32) * 5) / 9;
		//console.log(Math.round(temp_data_c));
		document.getElementById("temp_data").innerHTML = "<span>"+ Math.round(temp_data_c) +" °C</span>";
	});
	
	fetch('https://open-weather13.p.rapidapi.com/city/bogota', options)
	.then(response => response.json())
	.then(data => {
		//console.log(data);
		humidity_data = data.main.humidity;
		document.getElementById("humidity_data").innerHTML = "<span>"+ humidity_data +" %</span>";
	});
	
});


// AGREGO LOS LISTENERS DE LOS BOTONES
$(btnAdd).on("click", function () {
  newUser();
});
$(btnFilter).on("click", function () {
  filterAZ();
});
//btnAdd.addEventListener("click", newUser);
//btnFilter.addEventListener("click", filterAZ);

// LISTENER PARA LA TECLA ENTER EN EL CAMPO DE BUSQUEDA DE PERFIL, O CUANDO SU VALUE CAMBIE
busquedaField.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    buscar();
  }
});
$(busquedaField).on("change", function () {
  buscar();
});
//busquedaField.addEventListener("change", buscar);

//AQUI TENGO EL LISTENER PARA VALIDAR LA CONFIRMACION DE DELETE USER MODAL
$(btnDeleteUserModal).on("click", function () {
  deleteUserConfirm();
});
//btnDeleteUserModal.addEventListener("click", deleteUserConfirm);

//AQUI TENGO EL LISTENER PARA VALIDAR LA CONFIRMACION DE MODIFY USER MODAL
$(btnModifyUserModal).on("click", function () {
	modifyUserConfirm();
  });

// AQUI ESTOY CARGANDO LA INFORMACION DEL LOCALSTORAGE EN EL ARRAY, DEBO DE HACER ESTO EN EL INICIO SIEMPRE

$(function () {
  //código jQuery adicional
  onloadLocalstorage();
});
//window.addEventListener('DOMContentLoaded', onloadLocalstorage, false);

function onloadLocalstorage() {
  //alert('cargo');

  // OPERADOR TERNARIO DEL CICLO IF DE LA FUNCION
  localStorage.getItem("usuarios") == null
    ? (userArray = [])
    : (userArray = localStorage.getItem("usuarios")),
    (userArray = JSON.parse(userArray)),
    graficar(userArray);

  //if (localStorage.getItem('usuarios') == null) {
  //	userArray = [];
  //} else {
  //	userArray = localStorage.getItem('usuarios');
  //	userArray = JSON.parse(userArray);
  //	graficar(userArray);
  //}
}

function newUser() {
	// EN ESTE CONDICIONAL EVALUO SI EL EMAIL INGRESADO ES VALIDO O NO... ESTOY CONFIRMANDO EL FORMATO DE ESTE
	re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	if (!re.exec(document.getElementById("email").value)) {
		swal("Error!","Se ha ingresado un email no valido.","error");
	} else if (
		document.getElementById("name").value == "" ||
		document.getElementById("age").value == "" ||
		document.getElementById("phone").value == "" ||
		document.getElementById("email").value == "" 
	) {
		swal("Error!","Todos los campos deben de estar llenos.","error");
	} else if (userArray.length == 0) {
		swal("Hecho!","El contacto se ha registrado con exito!","success");
		let user = {
		name: document.getElementById("name").value,
		age: document.getElementById("age").value,
		phone: document.getElementById("phone").value,
		email: document.getElementById("email").value,
		};
		userArray.push(user);
		//graficar(userArray);

		// AQUI TENGO QUE EXPORTAR LA INFO AL LOCAL STORAGE - Y DEBO DE ENVIAR ESE ARRAY A GRAFICAR
		localStorage.setItem("usuarios", JSON.stringify(userArray));
		//userArray = localStorage.getItem('usuarios');  ESTO ES INNECESARIO
		//userArray = JSON.parse(userArray);  ESTO ES INNECESARIO

		graficar(userArray);
		//console.log(userArray);
	} else {
		nameInput = document.getElementById("name").value;
		filtro = userArray.filter((user) => user.name == nameInput); //AQUI ESTOY HACIENDO EL FILTRO PARA VER SI EL USUARIO QUE SE ESTA DIGITANDO YA ESTA CREADO
		if (filtro.length == 0) {
			swal("Hecho!","El contacto se ha registrado con exito!","success");
			let user = {
				name: document.getElementById("name").value,
				age: document.getElementById("age").value,
				phone: document.getElementById("phone").value,
				email: document.getElementById("email").value,
			};
			userArray.push(user);
			//graficar(userArray);

			// AQUI TENGO QUE EXPORTAR LA INFO AL LOCAL STORAGE - Y DEBO DE ENVIAR ESE ARRAY A GRAFICAR
			localStorage.setItem("usuarios", JSON.stringify(userArray));
			//userArray = localStorage.getItem('usuarios');  ESTO ES INNECESARIO
			//userArray = JSON.parse(userArray);  ESTO ES INNECESARIO

			graficar(userArray);
			//console.log(userArray);
		} else {
			swal("Oops!","El contacto ya se encuentra creado.","warning");
		}
	}
}

function graficar(usuarios) {
  let html_perfil = document.getElementById("perfiles");

  //variable que guarda todo el html que quiero renderizar
  perfil = "";

  for (let i = 0; i < usuarios.length; i++) {
    perfil =
      perfil +
      "<div class='card mx-2 col-md-4 col-lg-4 col-sm-12' style='width: 18rem;'><img src='./img/avatar_profile.png' class='card-img-top rounded-circle' alt='Imagen de contacto'> <div class='card-body'> <h5 class='card-title'>" +
      usuarios[i].name +
      "</h5> <p class='card-text'>Edad: " +
      usuarios[i].age +
      "</p> <p class='card-text'>Telefono: " +
      usuarios[i].phone +
      "</p> <p class='card-text'>Email: " +
      usuarios[i].email +
      "</p> </div> <div class='card-body'> <button class='btn btn-danger' onClick='deleteUser(" +
      i +
      ");' data-bs-toggle='modal' data-bs-target='#deleteModal'><i class='fa-solid fa-user-xmark'></i>  Eliminar</button><button class='btn ms-1 btn-primary' onClick='modifyUser(" +
      i +
      ");' data-bs-toggle='modal' data-bs-target='#modifyModal'><i class='fa-solid fa-user-xmark'></i>  Modificar</button></div> </div>";
  }
  //Renderizo todo apenas acabe
  html_perfil.innerHTML = perfil;
  //console.log(perfil)
  //console.log(graphicArray);
}

function filterAZ() {
  userArray.sort(function filtro(a, b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;

    return (result = 0);
  });

  graficar(userArray);
}

function buscar() {
  busqueda = document.getElementById("busqueda").value;
  resultado = [];
  for (let i = 0; i < userArray.length; i++) {
    console.log(userArray[i].name);
    console.log(busqueda);
    if (userArray[i].name.indexOf(busqueda) != -1) {
      resultado.push(userArray[i]);
    }
  }
  graficar(resultado);
}

function deleteUser(id) {
  let modalBody = document.getElementById("modalBody");
  let modalParrafo =
    "<p class='p'>Estas seguro que deseas eliminar al usuario: " +
    userArray[id].name +
    " </p>";
  localStorage.setItem("id_eliminar", id);
  modalBody.innerHTML = modalParrafo;
}

function deleteUserConfirm() {
  id = localStorage.getItem("id_eliminar"); // OBTENGO EL ID DEL SOTRAGE PARA ELIMINAR CONTACTO
  if (id != -1) {
    // VALIDO EL ID QUE ESTA EN EL STORAGE. AL SER POSICION DE ARRAY, TENGO QUE CONTEMPLAR QUE SEAN DIFERENTES DE -1
    userArray.splice(id, 1);
    localStorage.setItem("usuarios", JSON.stringify(userArray)); //MODIFICO EL ARRAY DE CARDS
    localStorage.setItem("id_eliminar", -1); // TENGO QUE SETEAR NUEVAMENTE EL VALOR DE ID_ELIMINAR EN -1 PARA QUE LA VALIDACION SEA CORRECTA
    graficar(userArray);
	swal("Hecho!","El contacto se ha eliminado exitosamente.","success");
  }
}

function modifyUser(id) {
  let modifymodalBody = document.getElementById("modifymodalBody");
  console.log(userArray[id].phone);
  let modifymodalParrafo =
    "<div class='border p-4'><div class='mb-3 px-5'><label class='form-label'>Nombre completo:</label><input class='form-control' type='text' name='' id='nameModify' value='" +
    userArray[id].name +
    "'></div><div class='mb-3 px-5'><label class='form-label'>Edad:</label><input class='form-control' type='number' name='' id='ageModify' value='" +
    userArray[id].age +
    "'></div><div class='mb-3 px-5'><label class='form-label'>Telefono:</label><input class='form-control' type='text' name='' id='phoneModify' value='" +
    userArray[id].phone +
    "'></div><div class='mb-3 px-5'><label class='orm-label'>Email:</label><input class='form-control' type='email' name='' id='emailModify' value='" +
    userArray[id].email +
    "'></div><div class='text-center'></div></div>";
  localStorage.setItem("id_modificar", id);
  modifymodalBody.innerHTML = modifymodalParrafo;
}

function modifyUserConfirm() {
	id = localStorage.getItem("id_modificar"); // OBTENGO EL ID DEL SOTRAGE PARA MODIFICAR CONTACTO
	
	if (
		document.getElementById("nameModify").value == "" ||
		document.getElementById("ageModify").value == "" ||
		document.getElementById("phoneModify").value == "" ||
		document.getElementById("emailModify").value == ""
	  ) {
		swal("Error!","Todos los campos deben de estar llenos.","error");
	  } else if(userArray[id].name != document.getElementById("nameModify").value ||
	  userArray[id].age != document.getElementById("ageModify").value ||
	  userArray[id].phone != document.getElementById("phoneModify").value ||
	  userArray[id].email != document.getElementById("emailModify").value
	  ) {
		userArray[id].name = document.getElementById("nameModify").value;
		userArray[id].age = document.getElementById("ageModify").value;
		userArray[id].phone = document.getElementById("phoneModify").value;
		userArray[id].email = document.getElementById("emailModify").value;
	
		localStorage.setItem("usuarios", JSON.stringify(userArray)); //MODIFICO EL ARRAY DE CARDS
		localStorage.setItem("id_modificar", -1); // TENGO QUE SETEAR NUEVAMENTE EL VALOR DE ID_MODIFICAR EN -1 PARA QUE LA VALIDACION SEA CORRECTA
		graficar(userArray);
		swal("Hecho!","Contacto modificado con exito!","success");
	  } else {
		swal("Oops!","Los datos son iguales a los existentes.","warning");
	  }	
}
