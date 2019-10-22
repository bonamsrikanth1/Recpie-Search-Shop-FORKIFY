import axios from 'axios';

async function getResult(query){
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const YOUR_APP_ID = '1e169500'
    const key = '244bac5627ac84acc1bdb2b1509a479d';
    const res = await axios(`${proxy}https://api.edamam.com/search?q=${query}&app_id=${YOUR_APP_ID}&app_key=${key}`);
    console.log(res);
}

getResult('bread');