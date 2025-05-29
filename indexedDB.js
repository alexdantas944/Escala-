if ('indexedDB' in window) {
    let db;
    const request = indexedDB.open('EscalaDB', 1);

    request.onupgradeneeded = event => {
        db = event.target.result;
        db.createObjectStore('usuarios', { keyPath: 'id' });
    };

    request.onsuccess = event => {
        db = event.target.result;
    };
}
