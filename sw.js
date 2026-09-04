// ========================================
// configuracao do cache (se nao me engano e armazenamento)
// ========================================

const CACHE_NAME = "clima-no-mapa-v1";


// ========================================
// arquivos que estaos salvos no bagulho
// ========================================

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// ========================================
// instalacao do service worker (quase morri pra fazer esse nao sei explicar pra que serve nao)
// ========================================

self.addEventListener("install", function (evento) {

    evento.waitUntil(

        caches.open(CACHE_NAME)
            .then(function (cache) {

                console.log("Salvando arquivos no cache...");

                return cache.addAll(ARQUIVOS);

            })

    );

    
    self.skipWaiting();

});


// ========================================
// ativacao do service worker (aqui ce ativa o bagulho)
// ========================================

self.addEventListener("activate", function (evento) {

    evento.waitUntil(

        caches.keys()
            .then(function (cachesExistentes) {

                return Promise.all(

                    cachesExistentes.map(function (cache) {

                        // Apaga caches antigos
                        if (cache !== CACHE_NAME) {

                            return caches.delete(cache);

                        }

                    })

                );

            })

    );

    
    self.clients.claim();

});


// ========================================
// requisicoes (nao sei explicar mas consegui pelo menos entender o bagulho um pouco)
// ========================================

self.addEventListener("fetch", function (evento) {

    
    if (evento.request.method !== "GET") {
        return;
    }

    evento.respondWith(

        caches.match(evento.request)
            .then(function (respostaCache) {

               
                if (respostaCache) {
                    return respostaCache;
                }

               
                return fetch(evento.request)

                    .then(function (resposta) {

                      
                        const copiaResposta = resposta.clone();

                       
                        caches.open(CACHE_NAME)
                            .then(function (cache) {

                                cache.put(
                                    evento.request,
                                    copiaResposta
                                );

                            });

                        return resposta;

                    })

                    .catch(function () {

                        // Se estiver sem internet,
                        // abre o index.html salvo no cache. (ache mt foda cara)
                        return caches.match("./index.html");

                    });

            })

    );

});
