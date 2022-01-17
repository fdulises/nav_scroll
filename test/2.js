function createList({id, title, list}){
    let html = '';
    for( item in list ){
        html += `<li class="btnb-hotel-info-list__list-item">
            <label>
                <input data-parent="${id}" class="btnb-filteroption check_${id}_${list[item]}" type="checkbox" name="${id}[${item}]" value="${item}">
                <span>${list[item]}</span>
            </label>
        </li>`
    }

    let htmlhead2 = title;

    let tpl = `<div id="hotel-info-list">
        <div class="content">

            <div class="btnb-hotel-info-list__container">
                <div class="btnb-hotel-info-list__wrapp">

                <div class="btnb-hotel-info-list__list-title">
                    <div class="icon hotel"></div>
                    <h2 class="btnb-hotel-info-list__text">
                        ${htmlhead2}
                    </h2>
                </div>
                    <ul id="${id}" class="btnb-hotel-info-list__list">
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

let campo1 = document.querySelector('#campo1');
let tagContainer = document.querySelector('#filterTagContainer');

//Preparar valores para componentes
function setDefault() {
    let defaultValue = {};

    for (elemento in databack) {
        defaultValue[elemento] = {};
    }

    
    campo1.value = JSON.stringify(defaultValue);
    tagContainer.innerHTML = '';

    for (let i = 0; i < listalis.length; i++) {
        listalis[i].checked = false;
        //listalis[i].removeAttribute('checked');
    }
}

//Crear listas dinamicas en base al codigo que vendra de drupal settings
for (elemento in databack) {
    document.querySelector('#cont-paso').innerHTML += createList(databack[elemento]);
}

//Añadir funcionalidad a elementos check
const listalis = document.querySelectorAll('.btnb-filteroption');

for( let i = 0; i < listalis.length; i++){
    listalis[i].addEventListener('click', function(){
        let filtros = JSON.parse(campo1.value);

        const parent = this.getAttribute('data-parent');
        if (!filtros[parent]) filtros[parent] = {};

        if (!filtros[parent][this.value]) filtros[parent][this.value] = this.value;
        else delete filtros[parent][this.value];

        campo1.value = JSON.stringify(filtros);

        actualizarComponenteTags(filtros);
    });
}

//Funcionalidad componente mostrar tags de filtros
function actualizarComponenteTags(filtros){
    let html = '';
    for( item in filtros){
        for (itemc in filtros[item] ){
            html += `<span data-target="check_${item}_${databack[item].list[itemc]}">${databack[item].list[itemc]}</span>`;
        }
    }
    tagContainer.innerHTML = html;
};


setDefault();
