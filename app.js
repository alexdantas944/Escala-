// Inicializa o mapa com Leaflet
const map = L.map('map').setView([-3.717, -38.542], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const control = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true
}).addTo(map);

// Inicializa IndexedDB
const dbName = "RouteDB";
let db;

const request = indexedDB.open(dbName, 1);
request.onupgradeneeded = event => {
    db = event.target.result;
    db.createObjectStore("routes", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = event => {
    db = event.target.result;
    loadRoutes(); // Carrega rotas salvas ao iniciar
};

// Salvar rota no IndexedDB
function saveRoute(route) {
    if (!db) return;
    
    const transaction = db.transaction(["routes"], "readwrite");
    const store = transaction.objectStore("routes");
    
    store.add(route);
    console.log("Rota salva:", route);
}

// Carregar rotas do IndexedDB
function loadRoutes() {
    if (!db) return;

    const transaction = db.transaction(["routes"], "readonly");
    const store = transaction.objectStore("routes");
    const request = store.getAll();

    request.onsuccess = () => {
        console.log("Rotas carregadas:", request.result);
    };
}

// Adicionar um ponto de origem e destino manualmente
function addRoute(start, end) {
    control.setWaypoints([L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)]);
    
    saveRoute({ start, end });
}

// Exemplo de rota otimizada
addRoute({ lat: -3.717, lng: -38.542 }, { lat: -3.730, lng: -38.525 });
