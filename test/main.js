

function createList({title, list}){
    const campo1 = document.querySelector('#campo1');
    let html = '';
    list.forEach((el) => {
        html += `<li class="btnb-hotel-info-list__list-item">
        <span>${el}</span>
    </li>`
    });

    let htmlhead2 = title;

    let tpl = `<div id="hotel-info-list">
        <div class="content">

            <div class="btnb-hotel-info-list__container">
                <div class="btnb-hotel-info-list__wrapp">

                    <ul class="btnb-hotel-info-list__list">
                        <div class="btnb-hotel-info-list__list-title">
                            <div class="icon hotel"></div>
                            <h2 class="btnb-hotel-info-list__text">
                                ${htmlhead2}
                            </h2>
                        </div>
                        ${html}
                    </ul>
                </div>
            </div>

        </div>
    </div>`;
    return tpl;
}

document.querySelector('#cont-paso').innerHTML += `<div class="btnb-hotel-info-list__head-title">
    <div class="icon left close white"></div>
    <h1 class="title-head">TITULO PRINCIPAL</h1>
    <div class="icon right"></div>
</div>`;
for (elemento in databack) {
    document.querySelector('#cont-paso').innerHTML += createList(databack[elemento]);
}

const listalis = document.querySelectorAll('.btnb-hotel-info-list__list-item');
for( let i = 0; i < listalis.length; i++){
    listalis[i].addEventListener('click', ()=>{
        alert('hola');
    });
}