const CACHE_NAME = 'dino-procedural-v1';

// Lista de arquivos vitais que o app depende para funcionar offline
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// Evento de Instalação: Salva os arquivos no cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Arquivos em cache com sucesso.');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Evento Fetch: Intercepta os pedidos e serve do cache se estiver offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Retorna o arquivo do cache se encontrar, senão baixa da rede
            return cachedResponse || fetch(event.request);
        })
    );
});

// Evento de Ativação: Limpa caches antigos caso você atualize a versão
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Limpando cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
