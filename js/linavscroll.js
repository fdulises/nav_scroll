/* ----- Navegación Scroll Automática con marcadores ----- */
/*
new liNavScroll({
    root_container: ".linavscroll_root", // El contenedor global del componente y el contenido
    nav_container: "#linavscroll_container", // El contenedor de la navegación
    section_selector: "h2", // Selector de las secciones a navegar
    active_class: "linavscroll_active" // Nombre de clase para el elemento activo
});
*/
class liNavScroll {

    constructor({ nav_container, section_selector, active_class, root_container }) {
        this.nav_container = document.querySelector(nav_container);
        this.section_selector = document.querySelectorAll(section_selector);
        this.active_class = active_class;
        this.root_container = root_container || 'body';
        this.root_container = document.querySelector(root_container);

        this.generateNav();

        new liScrollObserver({
            root_container: root_container,
            section_selector: section_selector,
            callback: (target) => {
                this.updateMarker({
                    target: "#" + target.id,
                    nav_container: this.nav_container,
                    active_class: this.active_class
                });
            }
        });
    }

    generateLink(section) {
        let link = document.createElement("a");
        link.innerHTML = section.innerHTML;
        link.href = "#" + section.id;

        link.addEventListener("click", e => {
            e.preventDefault();

            const destino = liOffset(section, this.root_container);

            liScrollTo({
                to: destino.top,
                root: this.root_container,
                callback: () => {
                    this.updateMarker({
                        target: "#" + section.id,
                        nav_container: this.nav_container,
                        active_class: this.active_class
                    });
                }
            });
        });

        return link;
    }

    generateNav() {
        for (let i = 0; i < this.section_selector.length; i++) {
            const section = this.section_selector[i];

            const newlink = this.generateLink(section);

            this.nav_container.appendChild(newlink);
        }
    }

    updateMarker({ target, nav_container, active_class }) {

        let active = nav_container.querySelector('.' + active_class) || false;
        if (active) active.classList.remove(active_class);

        active = nav_container.querySelector('a[href="' + target + '"]');
        active.classList.add(active_class);
    }
}

/* ----- Implementación de la api IntersectionObserver ----- */
class liScrollObserver{
    constructor({ section_selector, root_container, callback}){
        this.sections = [...document.querySelectorAll(section_selector)];
        this.root_container = document.querySelector(root_container);
        this.callback = callback;

        this.prevYPosition = 0;
        this.direction = 'up';

        this.observer = new IntersectionObserver(this.onIntersect, {
            root: this.root_container,
            rootMargin: '0px 0px',
            threshold: 0.75
        });  

        this.sections.forEach((section) => {
            this.observer.observe(section);
        });
    }

    getTargetSection = (entry) => {
        const index = this.sections.findIndex((section) => section == entry.target)

        if (index >= this.sections.length - 1) {
            return entry.target;
        } else {
            return this.sections[index + 1];
        }
    }
    shouldUpdate = (entry) => {
        if (this.direction === 'down' && entry.intersectionRatio <= 0.75) {
            return true;
        }

        if (this.direction === 'up' && entry.intersectionRatio >= 0.75) {
            return true;
        }

        return false;
    }

    onIntersect = (entries, observer) => {
        entries.forEach((entry) => {
            if (this.root_container.scrollTop > this.prevYPosition) this.direction = 'down';
            else this.direction = 'up';

            this.prevYPosition = this.root_container.scrollTop;

            const target = this.direction === 'down' ? this.getTargetSection(entry) : entry.target;

            if (this.shouldUpdate(entry)) this.callback(target);
        })
    }
}

/* ----- Helpers ----- */

// Helper para crear animaciones fluidas
let liRequestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// Helper para crear animaciones con aceleración/desaceleración
function liMathEaseInOutQuad(t, b, c, d) {
    t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

// Obtener las coordenadas de un elemento con respecto al Viewport
function liOffset(el, root) {
    let rect = el.getBoundingClientRect();
    if (root) {
        let scrollLeft = root.scrollLeft;
        let scrollTop = root.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    } else {
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
}

// Transformar scroll vertical en horizontal
function liTransformScroll(event) {
    if (!event.deltaY) return;
    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
}

// Hacer scroll animado hasta la posición indicada
function liScrollTo({ to, duration = 500, callback, root }) {
    function move(amount) {
        if (root) {
            root.scrollTop = amount;
        } else {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        }
    }
    function position() {
        if (root) return root.scrollTop;
        else return document.documentElement.scrollTop ||
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

