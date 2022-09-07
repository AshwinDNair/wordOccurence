const axios = require('axios');
const apiKey='dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf';
const lookUpApi='https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key='+apiKey+'&lang=en-ru&text=';
const documentApi=' http://norvig.com/big.txt';
async function highestOccurences(arr, num){
    const occurenceMap = {};
    let wordArray = [];
    let result=[];
    for (let i = 0; i < arr.length; i++) {
       if (occurenceMap[arr[i]]) {
        occurenceMap[arr[i]]++;
       } else {
        occurenceMap[arr[i]] = 1;
       }
    }//2a.all unique words are stored in the occurenceMap as key and number of occurence as value
    for (let i in occurenceMap) {
        if(i!='')
        wordArray.push(i);
    }
    wordArray = wordArray.sort((a, b) => {
 
       if (occurenceMap[a] === occurenceMap[b]) {
 
          if (a > b) {
             return 1;
          } else {
             return -1;
          }
       }
       else {
          return occurenceMap[b] - occurenceMap[a];
       }
    })
    .slice(0, num);//2b.wordMap get top 10 words 
    for(let i=0;i<wordArray.length;i++){
        result.push({'word':wordArray[i],'number_of_occurences':occurenceMap[wordArray[i]],'parts_of_speech':[],'synonyms':[]})
    }
    return result;
 };
 async function parseJsonResult(result){
    for(let i=0;i<result.length;i++){

        let dataResponse= await axios.get(lookUpApi+result[i].word);
            for(let j=0;j<dataResponse.data.def.length;j++){
                if(dataResponse.data.def[j].text==result[i].word)
                result[i].parts_of_speech.push(dataResponse.data.def[j].pos);   //2c.part of speech captured 
                for(let k=0;k<dataResponse.data.def[j].tr.length;k++){
                    if(dataResponse.data.def[j].tr[k].syn){
                        for(let l=0;l<dataResponse.data.def[j].tr[k].syn.length;l++){
                            result[i].synonyms.push(dataResponse.data.def[j].tr[k].syn[l].text) //2c.synonyms captured 
                }
                    }
                
        }
    }

            
    }
    return result;
 }
async function fun() {
    let response= await axios.get(documentApi); //1.response retrieved from the document api                   
    console.log(await parseJsonResult(await highestOccurences(response.data.replace(/\n/g, "").split(" "), 10)));//3.display output
    }
 fun();