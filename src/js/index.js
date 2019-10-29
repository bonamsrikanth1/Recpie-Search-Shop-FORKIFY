import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements,renderLoader,clearLoader} from './views/base';

/**  Global state of the app
* -- Search Object
* -- Current recepie Object
* -- Shopping list object
* -- Liked recipies
*/
const state = {};

/** SEARCH CONTROLLER*/
const controlSearch = async () => {
    // 1) Get the query from view

    const query = searchView.getInput(); //to do

    if (query){
        // 2) New Search Object and add it to query
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            //4) Search for recipes
            await state.search.getResult();

            //5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            console.log(state.search.result);

        }
        catch(error){
            alert('something wrong with Search');
            clearLoader();
        }


        

    }
};

elements.searchForm.addEventListener('submit', el => {
    //prevent the page to reload
    el.preventDefault();
    controlSearch();
});

/*  here the pagination buttons are not already available before the page loads so we use event delegation
*/
elements.searchResPages.addEventListener('click', el => {
    const btn = el.target.closest('.btn-inline'); //find the closest element and click operates acc
    if(btn) {
        //dataset refers to where we prefix goto with data attr
        const goToPage = parseInt(btn.dataset.goto , 10); 
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }

});

/**RECIPE CONTROLLER */
const controlRecipe = async () => {
    //get ID from URL
    const id =  window.location.hash.replace('#','');

    if(id) {
        //prepare UI for changes

        // Create new Recipe Object
        state.recipe = new Recipe(id);
        try{
            await state.recipe.getRecipe();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // render recipes
            console.log(state.recipe);

        }
        catch (error) {
            alert('recipe processing went wrong');
        }
        // Get Recipe Data
        

    }

}
//window.addEventListener('hashchange', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));
