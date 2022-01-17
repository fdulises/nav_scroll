// Helper para crear animaciones fluidas
let requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// Helper para crear animaciones con aceleracion/desaceleración
function mathEaseInOutQuad(t, b, c, d) {
    t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

// Hacer scroll animado hasta la posicion indicada
function liScrollTo(to, duration = 500, callback) {
    function move(amount) {
        document.documentElement.scrollTop = amount;
        document.body.parentNode.scrollTop = amount;
        document.body.scrollTop = amount;
    }
    function position() {
        return document.documentElement.scrollTop ||
            document.body.parentNode.scrollTop ||
            document.body.scrollTop;
    }
    let start = position();
    let change = to - start;
    let currentTime = 0;
    let increment = 20;

    function animateScroll(){
        currentTime += increment;
        move(mathEaseInOutQuad(currentTime, start, change, duration));
        if (currentTime < duration) requestAnimFrame(animateScroll);
        else {
            if (callback && typeof (callback) === 'function') callback();
        }
    }
    animateScroll();
};

//Obtener las cordenadas de un elemento con respecto al Viewport
function liOffset(el) {
    let rect = el.getBoundingClientRect();
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

//Transformar scroll vertical en horizontal
function transformScroll(event) {
    if (!event.deltaY) return;
    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
}