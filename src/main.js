// variable global donde se guarda el mapa
window.gMap;
// se inicializa el mapa
function initApp() {
  window.gMap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 19.432769, lng: -99.132925 },
    disableDefaultUI: true,
    zoom: 9,
    gestureHandling: 'coperative'
  });
  console.log('Mapa de google cargado exitosamente');
  // cuando cargue el mapa trae la informacion de los restaurants
  fetch('data.json').then(response => response.json()).then(restaurantList => {
    console.log('Lista de restaurantes obtenidos desde JSON.');
    // guarda el json como string (transforma el objeto en una cadena)
    localStorage.setItem('restaurantList', JSON.stringify(restaurantList));
    return renderRestaurantList(restaurantList);
  });
}
// recibe el arreglo de los restaurantes y con el map empieza a crear los templates uno por uno y los incerta en la lista de restaurantes
const renderRestaurantList = (restaurantList) => {
  const restaurantListHTML = restaurantList.map((restaurant, restaurantId) => {
    return (`
      <li class="restaurant" onclick="createMark(${restaurantId})">
        <p class="name">${restaurant.name}</p>
        <span class="foodType">${restaurant.place}</span>
      </li>
    `);
  }).join(''); // como es un arreglo pone , y con join lo juntas sin ,
  document.getElementById('restaurant-list').innerHTML = restaurantListHTML;
}
// punto rojo en el mapa de google (documentacion)
const createMark = (restaurantId) => {
  // saco el string de localStorage y lo convierto a un arreglo de objetos
  let restaurantList = localStorage.getItem('restaurantList');
  restaurantList = JSON.parse(restaurantList);
  // obtiene el restaurante cuando le da click el usuario en la lista por el Id(posision dentro del arreglo)
  const restaurant = restaurantList[restaurantId];
  // se crea el punto rojo en el mapa, es una funcion dada por google, por latitud y longitud
  let marker = new google.maps.Marker({
    position: {
      lat: restaurant.latitude,
      lng: restaurant.longitude
    }
  });

  marker.setMap(null);
  marker.setMap(window.gMap);
  // se crea el modal por el evento onclick en el punto del mapa(restaurante)
  marker.addListener('click', () => {
    openModal(restaurant);
  });
}
// funcion del modal
const openModal = (restaurant) => {
  const modalHtml = (`
    <img class="image" src="${restaurant.img}" alt="">
    <p class="name">${restaurant.name}</p>
    <p class="address">${restaurant.address}</p>
    <p class="cost">Costo: ${restaurant.costo}</p>
    <p class="foodType">${restaurant.foodType}</p>
  `);
  // lo pintas en el HTML
  document.getElementById('modal').innerHTML = modalHtml;
  // muestras al 'papa' de modal
  document.getElementById('modal-container').style.zIndex = 3;// propiedad de css para cambiar el valor del zindex y se muestre por encima o por debajo de los demas elementos
}
// funcion para cerrar modal al darle click al modal-container
const closeModal = () => {
  document.getElementById('modal-container').style.zIndex = -1;
}
// agregar evento que escucha cuando escribes en el input y filtra los resultados del arreglo original para volver a pintar la lista de restaurantes
document.getElementById('input-search').addEventListener('keyup', (event) => { // keyup es un evento que escucha cuando sueltas una tecla despues de haberla presionado
  let restaurantList = localStorage.getItem('restaurantList');
  restaurantList = JSON.parse(restaurantList);

  const restaurantFiltered = restaurantList.filter((restaurant) => {
    let restaurantUppercase = restaurant.name.toUpperCase();
    let searchUppercase = event.target.value.toUpperCase();
    // busca si existe la palabra que escribio el usuario
    return restaurantUppercase.indexOf(searchUppercase) > -1;
  });

  return renderRestaurantList(restaurantFiltered);
});
