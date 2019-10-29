import axios from 'axios';
import {apiAppID, apiKey} from '../config'

export default class Search{
    constructor(query){
        this.query =query;
    }
    async getResult(){
        const baseURL = 'http://cors-anywhere.herokuapp.com/https://api.edamam.com';
        //const proxy = 'https://cors-anywhere.herokuapp.com/';

        try{
            const results = await axios(`${baseURL}/search?q=${this.query}&from=0&to=50&app_id=${apiAppID}&app_key=${apiKey}`);
            this.result = results.data.hits;
            
        }
        catch(error){
            alert(error);
        }
    }

}





