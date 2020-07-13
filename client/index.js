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
    // setting up the hero image!
    heroImageUrl = images[randomIndex] + `?auto=compress&cs=tinysrgb&h=600&w=720`;
    heroImage.src = heroImageUrl;
    // console.log(randomIndex);
    let randomIndices = getListofRandomPhotos(randomIndex);
    // console.log(randomIndices);

    // dealing with images in Gallery!
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
  // console.log(temp);
  return temp;
}


//dealing with todos.
// deleting the todos!
const todoContainer = document.querySelector(".todoWrapper");

function createAtodo(todoContent,state,todo_id){
  // let div1 = document.createElement("div");
  // div1.setAttribute("class","flex flex-wrap -m-2");
   let hiddenSpan = document.createElement("span");
   hiddenSpan.setAttribute("class","hiddenId");
   hiddenSpan.textContent = todo_id;
   let div1 = document.createElement("div");
   div1.setAttribute("class","p-2 lg:w-1/3 md:w-1/2 w-full todoItem");
   div1.appendChild(hiddenSpan);
   hiddenSpan.style.display = "none";

   let div2 = document.createElement("div");
   div2.setAttribute("class","h-full flex items-center border-gray-200 border p-4 rounded");


   let div3 = document.createElement("div");
   div3.setAttribute("class","flex flex-wrap justify-between flex-grow");

   let p1 = document.createElement("p");
   p1.setAttribute("class","text-gray-900");
   p1.textContent = todoContent;
   if(state === "done"){
     p1.style.textDecoration = "line-through";
   }else{
     p1.style.textDecoration = "none";
   }

   let p2 = document.createElement("p");
   p2.setAttribute("class","statusGrp flex flex-wrap align-center justify-center");

   let span1 = document.createElement("span");
   span1.setAttribute("class","todoDone task");
   let icon1 = document.createElement("i");
   icon1.setAttribute("class","material-icons");
   icon1.textContent = "check";
   span1.appendChild(icon1);

   let span2 = document.createElement("span");
   span2.setAttribute("class","todoDelete task");
   let icon2 = document.createElement("i");
   icon2.setAttribute("class","material-icons");
   icon2.textContent = "close";
   span2.appendChild(icon2);

   p2.append(span1,span2);
   div3.append(p1,p2);

   div2.appendChild(div3);
   div1.appendChild(div2);

   todoContainer.appendChild(div1);
}

function addTodosFromtheDatabase(todos){
// todos should come from database!
  // let todos = todos;
  // console.log(todos);
  if(todos && todos.length!==0){
    todos.forEach((item, i) => {
      // console.log(item);
      createAtodo(item.data,item.state,item._id);
    });
  }else{
    let p = document.createElement("p");
    p.textContent = "Sorry No todos found!";
    todoContainer.appendChild(p);
  }

}

// adding new todos To the server!
const addBtn = document.querySelector("#addTodotodatabase");
const inputBox = document.querySelector("#todoInputBox");
const inputValueBox = document.querySelector("#todoContentValueBox");
addBtn.addEventListener("click",e=>{
  e.preventDefault();
  if(inputBox.style.display === "none"){
    inputBox.style.display = "block";
  }else if(inputBox.style.display === "block"){
    inputBox.style.display = "none";
    // here we should take the data from the user!
    let todoData = inputValueBox.value;
    // console.log(todoData);
    // sending this data to the server!
    addnewTodosTothedatabase(todoData);
    todoContainer.innerHTML = "";
    loadAllTodos();
  }else{
    inputBox.style.display = "none";
  }
});

function addnewTodosTothedatabase(todoData){
  if(todoData.length !== 0){
    let data = {
      'data':todoData,
      'state':"undone"
    };
    let options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
    // talking to the server!
    fetch("/addNewTodo",options)
    .then(response=>response.json())
    .then(data=>{
      inputValueBox.value = "";
      // console.log(data);
    });
  }
}

function updateMe(id,iconpath){
  let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id:id})
    };
  fetch("/updateTodoItem",options)
  .then(response=>response.json())
  .then(data=>{
    // console.log(data);
    let textContentOfElement = iconpath.parentElement.children[1].children[0].children[0];
    if(data.state === "done"){
      textContentOfElement.style.textDecoration = "line-through";
    }else if(data.state === "undone"){
      textContentOfElement.style.textDecoration = "none";
    }else{
      textContentOfElement.style.textDecoration = "none";
    }
  });
}

function deleteMe(id){
  let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id:id})
  };

  fetch('/deleteTodoItem',options)
  .then(response=>response.json())
  .then(data=>{
    if(data.message === "deleted!"){
      todoContainer.innerHTML = "";
      loadAllTodos();
    }else{
      // error handling!
    }
  });

}

function loadAllTodos(){
  fetch("/getAllTodos")
    .then(response=>response.json())
    .then(data=>{
      addTodosFromtheDatabase(data);
      // activating updating and deleting operations!
      const todoItems = document.querySelectorAll('.todoItem');
      const updateIcons = document.querySelectorAll('.todoDone');

      // updating!
      updateIcons.forEach((icon, i) => {
        icon.addEventListener('click',e=>{
        e.preventDefault();
        let iconpath=icon.parentElement.parentElement.parentElement.parentElement.children[0];

            updateMe(iconpath.textContent,iconpath);
        });
      });

      // deleting!
      const deleteIcons = document.querySelectorAll('.todoDelete');
      deleteIcons.forEach((icon, i) => {
        icon.addEventListener('click',e=>{
            e.preventDefault();
            let iconpath_delete_id = icon.parentElement.parentElement.parentElement.parentElement.children[0].textContent;
            // talking to the server about deleting the required item!
            deleteMe(iconpath_delete_id);

        });
      });


    });
}

// loading all the todos from the database!
loadAllTodos();
