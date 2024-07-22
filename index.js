import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://we-are-the-champions-beb2d-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const inputFieldEl = document.getElementById("input-field")
const publishButtonEl = document.getElementById("publish-button")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el") 
const endorsementListEl = document.getElementById("endorsement-list")

publishButtonEl.addEventListener("click", function(){
     let inputValue = inputFieldEl.value
     let fromData = fromEl.value
     let toData = toEl.value
     
    if (inputValue && fromData && toData) {
        clearendorsementsInputEl();
        pushData(inputValue, fromData, toData);
        inputFieldEl.style.border = "none";
        fromEl.style.border = "none";
        toEl.style.border = "none";
      } else {
        clearendorsementsInputEl();
        inputFieldEl.style.border = "2px solid #008080";
        fromEl.style.border = "2px solid #008080";
        toEl.style.border = "2px solid #008080";
     }    
})

onValue(endorsementListInDB, function (snapshot) {
  endorsementListEl.innerHTML = "";
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    for (let i = 0; i < itemsArray.length; i++) {
      let currentReview = itemsArray[i];
      appendItemToListEl(currentReview);
    }
    } else {
        endorsementListEl.innerHTML= "No items here yet...."
    }
})

function clearendorsementsInputEl() {
    inputFieldEl.value = ""
    toEl.value = ""
    fromEl.value = ""
}

function pushData(review, sender, to) {
  let arr = [review, sender, to, 0];
  push(endorsementListInDB, arr);
}

function appendItemToListEl(review){
  let reviewId = review[0];
  let reviewData = review[1];
  let reviewText = reviewData[0];
  let reviewFrom = reviewData[1];
  let reviewTo = reviewData[2];
  let reviewLikes = reviewData[3];

  let newEl = document.createElement("li");
  let mainConEl = document.createElement("div");
  let toEl = document.createElement("h3");
  let reviewEl = document.createElement("p");
  let flexEl = document.createElement("div");
  let fromEl = document.createElement("h3");
  let likesEl = document.createElement("button");
  toEl.textContent = `To ${reviewTo}`;
  reviewEl.textContent = reviewText;
  fromEl.textContent = `From ${reviewFrom}`;
  likesEl.textContent = `♥ ${reviewLikes}`;
  newEl.appendChild(mainConEl);
  mainConEl.appendChild(toEl);
  mainConEl.appendChild(reviewEl);
  mainConEl.appendChild(flexEl);
  flexEl.appendChild(fromEl);
  flexEl.appendChild(likesEl);

  reviewEl.classList = "review-text";
  flexEl.classList = "flex-container";
  likesEl.classList = "like-btn";

  newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${reviewId}`)
        
        remove(exactLocationOfItemInDB)
    })

  likesEl.addEventListener("click", function () {
    reviewLikes += 1;
    let exactLocationDB = ref(database, `endorsementList/${reviewId}`);
    update(exactLocationDB, {
      3: reviewLikes,
    });
  });
  endorsementListEl.append(newEl);
}

