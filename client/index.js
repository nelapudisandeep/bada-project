// hero section scripts!
const bibleVerse = document.querySelector("#bibleVerse");
const bibleReference = document.querySelector("#bibleReference");
const heroImage = document.querySelector("#heroImage");
const gallery_images = document.querySelectorAll(".gallery_images");
// getting a bible verse upon refreshing the page!
let url = "/getBibleVerse";
let imagesUrl = "/getPhotos";
let images = [];
fetch(url)
  .then(response=>response.json())
  .then(data=>{
    bibleVerse.textContent = data.bibleVerse;
    bibleReference.textContent = data.reference;
});

fetch(imagesUrl)
  .then(response=>response.json())
  .then(data=>{
    images = data.urls;
    let randomIndex = Math.floor(Math.random()*(images.length));
    heroImageUrl = images[randomIndex] + `?auto=compress&cs=tinysrgb&h=600&w=720`;
    heroImage.src = heroImageUrl;
    console.log(randomIndex);
    let randomIndices = getListofRandomPhotos(randomIndex);
    console.log(randomIndices);
    gallery_images[0].src = images[randomIndices[0]] + `?auto=compress&cs=tinysrgb&h=300&w=500`;
    gallery_images[1].src = images[randomIndices[1]] + `?auto=compress&cs=tinysrgb&h=301&w=501`;
    gallery_images[2].src = images[randomIndices[2]] + `?auto=compress&&fit=crop&h=360&w=600`;
    gallery_images[3].src = images[randomIndices[3]] + `?auto=compress&&fit=crop&h=361&w=601`;
    gallery_images[4].src = images[randomIndices[4]] + `?auto=compress&cs=tinysrgb&h=302&w=502`;
    gallery_images[5].src = images[randomIndices[5]] + `?auto=compress&cs=tinysrgb&h=303&w=503`;

});

function getListofRandomPhotos(randomIndex){
  let indices = [];
  const total = 6;
  if(randomIndex==0){
    indices = getLists(1,14,6);
  }else if(randomIndex==14){
    indices = getLists(0,13,6);
  }else{
    indices = getUnrepeatedIndices(randomIndex,total);
  }
  return indices;
}

function getLists(min,max,lengthRequired){
  let indices = [];
    for(let i = 0;i<lengthRequired;i++){
      indices[i] = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return indices;
}


function find_duplicate_in_array(arra1) {
        var object = {};
        var result = [];
        arra1.forEach(function (item) {
          if(!object[item])
              object[item] = 0;
            object[item] += 1;
        })
        for (var prop in object) {
           if(object[prop] >= 2) {
               result.push(prop);
           }
        }
        return result;
}

function getUnrepeatedIndices(randomIndex,total){
  let temp;
  if(randomIndex<6){
    let temp1 = getLists(0,randomIndex-1,randomIndex);
    let temp2 = getLists(randomIndex+2,14,total-randomIndex);
     temp = [...temp1,...temp2];
  }else{
     temp = getLists(0,randomIndex-1,randomIndex);
  }
  let count = 0;
  while(find_duplicate_in_array(temp).length !== 0 && count<=5){
    temp1 = getLists(0,randomIndex-1,randomIndex);
    temp2 = getLists(randomIndex+2,14,total-randomIndex);
    temp = [...temp1,...temp2];
    count += 1;
  }
  console.log(temp);

  return temp;
}
