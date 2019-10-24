import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

/**  Global state of the app
* -- Search Object
* -- Current recepie Object
* -- Shopping list object
* -- Liked recipies
*/
const state = {};

const controlSearch = async () => {
    // 1) Get the query from view

    const query = searchView.getInput(); //to do

    if (query){
        // 2) New Search Object and add it to query
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();


        //4) Search for recipes
        await state.search.getResult();

        //5) render results on UI
        searchView.renderResults(state.search.result);
        console.log(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', el =>{
    //prevent the page to reload
    el.preventDefault();
    controlSearch();
});

