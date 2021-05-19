


//la funcion tiene que devilver una promesa

const actualizaDynamicCache = ( cacheDynamicName, req, resp ) =>{

    if (resp .ok){

        return caches.open(cacheDynamicName). then( cache => {
            cache.put(req,resp.clone())
            return resp.clone();
        });
        
    }else {
        return resp;
    }
    //retorno losres.clone() para evitar errores

};