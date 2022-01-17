/* ------------- -------------------- */

// Helper para crear animaciones fluidas
let liRequestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// Helper para crear animaciones con aceleracion/desaceleración
function liMathEaseInOutQuad(t, b, c, d) {
    t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

//Obtener las cordenadas de un elemento con respecto al Viewport
function liOffset(el) {
    let rect = el.getBoundingClientRect();
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

//Transformar scroll vertical en horizontal
function liTransformScroll(event) {
    if (!event.deltaY) return;
    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
}

// Hacer scroll animado hasta la posicion indicada
function liScrollTo({ to, duration = 500, callback }) {
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

    function animateScroll() {
        currentTime += increment;
        move(liMathEaseInOutQuad(currentTime, start, change, duration));
        if (currentTime < duration) liRequestAnimFrame(animateScroll);
        else {
            if (callback && typeof (callback) === 'function') callback();
        }
    }
    animateScroll();
}

/* ------------- -------------------- */

class liScrollObserver{
    constructor(){
        this.header = document.querySelector('#linavscroll_container');
        this.sections = [...document.querySelectorAll('h2')];
        this.scrollRoot = document.querySelector('body');
        this.headerLinks = [...document.querySelectorAll('#linavscroll_container a')];

        this.prevYPosition = 0;
        this.direction = 'up';

        this.observer = new IntersectionObserver(this.onIntersect, {
            root: this.scrollRoot,
            rootMargin: '0px 0px',
            threshold: 0.75
        })

        this.sections.forEach((section) => {
            this.observer.observe(section)
        })
    }

    getTargetSection = (entry) => {
        const index = this.sections.findIndex((section) => section == entry.target)

        if (index >= this.sections.length - 1) {
            return entry.target
        } else {
            return this.sections[index + 1]
        }
    }
    shouldUpdate = (entry) => {
        console.log(entry);
        if (this.direction === 'down' && entry.intersectionRatio <= 0.75) {
            return true
        }

        if (this.direction === 'up' && entry.intersectionRatio >= 0.75) {
            return true
        }

        return false
    }

    onIntersect = (entries, observer) => {
        entries.forEach((entry) => {
            if (this.scrollRoot.scrollTop > this.prevYPosition) this.direction = 'down'
            else this.direction = 'up'

            this.prevYPosition = this.scrollRoot.scrollTop

            const target = this.direction === 'down' ? this.getTargetSection(entry) : entry.target

            if (this.shouldUpdate(entry)) this.updateMarker(target)
        })
    }

    updateMarker = (target) => {

        let active = this.header.querySelector('a.linavscroll_active');
        if (active) active.classList.remove('linavscroll_active');

        active = this.header.querySelector('a[href="#' + target.id + '"]');
        active.classList.add('linavscroll_active');

    }

}


/* ------------- -------------------- */

class liNavScroll{

    constructor({ nav_container, section_headers, active_class}){
        this.nav_container = document.querySelector(nav_container);
        this.section_headers = document.querySelectorAll(section_headers);
        this.active_class = active_class;

        this.generateNav();

        new liScrollObserver;
    }

    generateLink(section){
        let link = document.createElement("a");
        link.innerHTML = section.innerHTML;
        link.href = "#"+section.id;

        link.addEventListener("click", e=>{
            e.preventDefault();

            const destino = liOffset(section);

            liScrollTo({
                to: destino.top,
                callback: this.callback
            });

            const lastActive = this.nav_container.querySelector('.' + this.active_class) || false;
            if (lastActive) lastActive.classList.remove(this.active_class);
            link.classList.add(this.active_class);
        });

        return link;
    }

    generateNav(){
        for (let i = 0; i < this.section_headers.length; i++) {
            const section = this.section_headers[i];

            const newlink = this.generateLink(section);

            this.nav_container.appendChild(newlink);
        }
    }
}