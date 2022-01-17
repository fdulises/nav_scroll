//Implementar ejemplos con el efecto scrollto
window.addEventListener('load', function(){

    //Algoritmo para ir la #seccion definida en enlace
    const scrolltoelements = document.querySelectorAll('a.btnscrollto');
    for (let i = 0; i < scrolltoelements.length; i++) {
        scrolltoelements[i].addEventListener('click', function (e) {
            e.preventDefault();
            let destino = document.querySelector(this.getAttribute('href'));
            let posicion = liOffset(destino);
            liScrollTo(posicion.top, 2000, false);
        });
    }

    let horcont = document.querySelector('.scy');
    
    horcont.addEventListener('wheel', transformScroll);

    let verticalitems = horcont.querySelectorAll('li');
    for( let i = 0; i < verticalitems.length; i++){
        verticalitems[i].setAttribute('data-px', verticalitems[i].getBoundingClientRect().x);
        verticalitems[i].addEventListener('click', function (){
            let posicionx = this.getBoundingClientRect().x;
            let ancho = this.offsetWidth;
            let ancho_cont = horcont.offsetWidth;
            let espacio = (ancho_cont - ancho)/2;

            let distancia = (horcont.scrollLeft + posicionx)-espacio;
            horcont.scroll({
                left: distancia,
                behavior: 'smooth'
            });
        }, true);
    }
    
});