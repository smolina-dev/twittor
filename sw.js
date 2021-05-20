importScripts ('js/sw-utils.js');

const STATIC_CACHE    = 'static-v3';
const DYNAMIC_CACHE   = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v2';


const APP_SHELL=[
    // '/',  comento para publicar en produccion
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'js/app.js',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/sw-utils.js'
    

];


const APP_SHELL_INMUTABLE=[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
    
];


self.addEventListener('install', e =>{

    const cacheStatic= caches.open( STATIC_CACHE). then( cache => {

         cache.addAll(APP_SHELL);
    });

    const cacheDynamic= caches.open( DYNAMIC_CACHE). then( cache => {

         cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil( Promise.all([ cacheStatic, cacheDynamic]) );  //

});

self.addEventListener('activate', e=> {

    //para borrar los cache viejos qiue no utilio
    // En este ejemplo es para el static
    // sesuele manejar los cache por versiones
    const respuesta= caches.keys().then (keys => {

            keys.forEach( key =>{

                    if (key !== STATIC_CACHE && key.includes('static') ) {
                        return caches.delete( key);
                    }

                    
                    if (key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                        return caches.delete( key);
                    }
            });

        });
    
        e.waitUntil(respuesta);
    });



    self.addEventListener('fetch', e =>{

        const respuesta = caches.match( e.request ). then( resp =>{

            if (resp) {
                //encuentro la respuesta en el cache y la devuelco
                return resp;

            } else {
                //no encuentr ala respuesta la busco en la internet y almaceno en cache
                return fetch(e.request). then ( newResp =>{
                    return actualizaDynamicCache(DYNAMIC_CACHE, e.request, newResp );
                });
            }     

        });


        e.respondWith( respuesta);
    });