import { elements } from "./base";

export const getInput = () => elements.searchInput.value;
// clearing input fields

export const clearInput = () => {
    elements.searchInput.value = '';
};
//to clear the list of recipes displayed on UI
export const clearResults = () => {
    elements.searchResList.innerHTML= '';
    elements.searchResPages.innerHTML= '';

};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

//to cutshort the title of recipe if they are too lengthy and place... at the end
// eg: pasta with tomato and spinach --> pasta with tomato and...
const limitRecipeTitle = (title, limit = 17) =>{
    const newTitle = [];
    if (title.length>limit){
        title.split(' ').reduce((acc,curr) =>{
            if(acc + curr.length <= 17){
                newTitle.push(curr);
            }
            return acc + curr.length;
        },0); 
        return `${newTitle.join(' ')}...`;
    }
    return title;
}  

// to return all of our recepies 
const renderRecipe = recipe =>{
    //here is where actual rendering happen
    /*we need to display each recipe on LHS and for this in ES5 we inserted an html
      in one line. where as in ES6 instead we can simply copy html inside an template string
      as shown below  
    */
   const getID = (uri) => uri.split('#')[1];
   const markup = `
   <li>
        <a class="results__link" href="#${getID(recipe.recipe.uri)}">
            <figure class="results__fig">
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.recipe.label)}</h4>
                <p class="results__author">${recipe.recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//displaying page buttons required

const createButton = ( page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    //1. we need to display next button on first page and page1 & page 2 navigation on 2nd page and prev page on the last one
    // For this we need know the total number of pages present => no.of results/resPerPage ;
    const pages = Math.ceil(numResults / resPerPage);


    let button;
    if(page === 1 && pages > 1) {
        //only button to goto next page
        button = createButton(page, 'next');
    }else if(page < pages){
        // buttons to prev and next pages
        button =  `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    else if(page === pages && pages > 1){
        // only button to goto prev page
        button = createButton(page, 'prev');
    }
        
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};



/**Creating pages with 10 recipes per each
   used slice method to cut down the list with start and end as shown */
export const renderResults = (recipes,page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    
    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

