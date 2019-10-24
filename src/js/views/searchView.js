import { elements } from "./base";

export const getInput = () => elements.searchInput.value;
// clearing input fields

export const clearInput = () => {
    elements.searchInput.value = '';
};
//to clear the list of recipes displayed on UI
export const clearResults = () => {
    elements.searchResList.innerHTML= '';
};

//to cutshort the title of recipe if they are too lengthy and place... at the end
// pasta with tomato and spinach
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
    /*we need to display each recipe in the left side and for this in ES5 we inserted an html
      in one line. where as in ES6 instead of tha we can simply write an inside an template string
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

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};