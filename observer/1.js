const header = document.querySelector('#stickybar');
const sections = [...document.querySelectorAll('.innernavsec')];
const scrollRoot = document.querySelector('#contenedorraiz');
const headerLinks = [...document.querySelectorAll('#stickybar a')]

let prevYPosition = 0
let direction = 'up'

const getTargetSection = (entry) => {
    const index = sections.findIndex((section) => section == entry.target)

    if (index >= sections.length - 1) {
        return entry.target
    } else {
        return sections[index + 1]
    }
}
const shouldUpdate = (entry) => {
    if (direction === 'down' && !entry.isIntersecting) {
        return true
    }

    if (direction === 'up' && entry.isIntersecting) {
        return true
    }

    return false
}

const onIntersect = (entries, observer) => {
    entries.forEach((entry) => {
        if (scrollRoot.scrollTop > prevYPosition) direction = 'down'
        else direction = 'up'

        prevYPosition = scrollRoot.scrollTop

        const target = direction === 'down' ? getTargetSection(entry) : entry.target

        if (shouldUpdate(entry)) updateMarker(target)
    })
}

const updateMarker = (target) => {

    let active = header.querySelector('a.active');
    if (active) active.classList.remove('active');

    active = header.querySelector('a[href="#' + target.id + '"]');
    active.classList.add('active');

}

const observer = new IntersectionObserver(onIntersect, {
    root: scrollRoot,
    rootMargin: '0px 0px',
    threshold: 0
})

sections.forEach((section) => {
    observer.observe(section)
})
