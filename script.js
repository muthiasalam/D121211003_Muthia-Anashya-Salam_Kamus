

const wrapper = document.querySelector(".wrapper");
const searchInput = wrapper.querySelector("input");
const infoText = wrapper.querySelector(".menus .info-text");
const volume = wrapper.querySelector(".word .details-bottom i");
const removeIcon = wrapper.querySelector(".search span");

const content = {
    type: wrapper.querySelector(".content .Type p"),
    meaning: wrapper.querySelector(".content .meaning span"),
    example: wrapper.querySelector(".content .example span"),
    synonyms: wrapper.querySelector(".synonyms .list"),
    antonyms: wrapper.querySelector(".antonyms .list"),
};

const content2 = {
    type: wrapper.querySelector(".content2 .Type2 p"),
    meaning: wrapper.querySelector(".content2 .meaning2 span"),
    example: wrapper.querySelector(".content2 .example2 span"),
    synonyms: wrapper.querySelector(".synonyms2 .list2"),
    antonyms: wrapper.querySelector(".antonyms2 .list2"),
};

const content3 = {
    type: wrapper.querySelector(".content3 .Type3 p"),
    meaning: wrapper.querySelector(".content3 .meaning3 span"),
    example: wrapper.querySelector(".content3 .example3 span"),
    synonyms: wrapper.querySelector(".synonyms3 .list3"),
    antonyms: wrapper.querySelector(".antonyms3 .list3"),
};

let audio;

function resetContent(contentElement) {
    contentElement.type.innerText = "";
    contentElement.meaning.innerText = "";
    contentElement.example.innerText = "";
    contentElement.synonyms.innerHTML = "";
    contentElement.antonyms.innerHTML = "";
    contentElement.synonyms.parentElement.style.display = "none";
    contentElement.antonyms.parentElement.style.display = "none";
}

function showHideContentElements(result) {
    const content1Elements = document.querySelectorAll(".content1");
    const content2Elements = document.querySelectorAll(".content2");
    const content3Elements = document.querySelectorAll(".content3");

    if (result && result[0] && result[0].meanings) {
        if (result[0].meanings[1]) {
            content2Elements.forEach(element => element.style.display = "block");
        } else {
            content2Elements.forEach(element => element.style.display = "none");
        }

        if (result[0].meanings[2]) {
            content3Elements.forEach(element => element.style.display = "block");
        } else {
            content3Elements.forEach(element => element.style.display = "none");
        }

        content1Elements.forEach(element => element.style.display = "block");
    } else {
        content1Elements.forEach(element => element.style.display = "none");
        content2Elements.forEach(element => element.style.display = "none");
        content3Elements.forEach(element => element.style.display = "none");
    }
}

function data(result, word) {
    if (result.title) {
        showHideContentElements(false);
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    } else {
        showHideContentElements(result);

        

        console.log(result);
        wrapper.classList.add("active");

        for (let i = 0; i < result[0].meanings.length; i++) {
            const currentContent = i === 0 ? content : i === 1 ? content2 : content3;

            let meanings = result[0].meanings[i];
            let definitions = meanings.definitions[0];
            let partOfSpeech = meanings.partOfSpeech;
            let foundText = null;
            let foundAudio = null;
            

            for (let j = 0; j < result[0].phonetics.length; j++) {
                if (result[0].phonetics[j].text) {
                    foundText = `/${result[0].phonetics[j].text}/`;
                    break; 
                }
            }

            for (let j = 0; j < result[0].phonetics.length; j++) {
                if (result[0].phonetics[j].audio) {
                    foundAudio = result[0].phonetics[j].audio;
                    break; 
                }
            }

            
            

            document.querySelector(".word p").innerText = result[0].word;
            document.querySelector(".word span").innerText = foundText || '';
            currentContent.type.innerText = partOfSpeech;
            currentContent.meaning.innerText = definitions.definition;
            currentContent.example.innerText = definitions.example;

            audio = new Audio(foundAudio);

            if (definitions.example) {
                currentContent.example.innerText = definitions.example;
                currentContent.example.parentElement.parentElement.style.display = "block";
            } else {
    
                currentContent.example.parentElement.parentElement.style.display = "none";
            }

            if (meanings.synonyms[0] !== undefined) {
                currentContent.synonyms.parentElement.style.display = "block";
                currentContent.synonyms.innerHTML = "";
                for (let j = 0; j < meanings.synonyms.length; j++) {
                    let tag = `<span>${meanings.synonyms[j]}`;
                    
                    
                    if (j < meanings.synonyms.length - 1) {
                        tag += ', ';
                    }
                    
                    tag += '</span>';
                    
                    currentContent.synonyms.insertAdjacentHTML("beforeend", tag);
                }
            }

            if (meanings.antonyms[0] !== undefined) {
                currentContent.antonyms.parentElement.style.display = "block";
                currentContent.antonyms.innerHTML = "";
                for (let j = 0; j < meanings.antonyms.length; j++) {
                    let tag = `<span>${meanings.antonyms[j]}`;
                    
                    
                    if (j < meanings.antonyms.length - 1) {
                        tag += ', ';
                    }
                    
                    tag += '</span>';
                    
                    currentContent.antonyms.insertAdjacentHTML("beforeend", tag);
                }
                
            }
        }

        
    }
}

function fetchApi(word) {
    resetContent(content);
    resetContent(content2);
    resetContent(content3);
    wrapper.classList.remove("active");

    infoText.style.color = "#ffff";
    infoText.innerHTML = `Scroll down to see the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then((res) => res.json())
        .then((result) => {
            if (result[0] && result[0].meanings) {
                showHideContentElements(result);
                data(result, word);
            } else {
                showHideContentElements(false);
                infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
            }
        })
        .catch(() => {
            showHideContentElements(false);
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        });
}

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value) {
        
        fetchApi(e.target.value);
        addToHistory(e.target.value);

        
    }
});

volume.addEventListener("click", () => {
    audio.play();
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#ffffff";
    infoText.innerHTML = "Type the word you want to search and press enter.";
});



const bookmarkButton = document.getElementById("bookmark-button");
const bookmarkCloseButton = document.getElementById("bookmark-close");
const bookmarkList = document.getElementById("bookmark-list");



bookmarkButton.addEventListener("click", () => {
    if (bookmarkList.style.display === "block") {
        bookmarkList.style.display = "none";
    } else {
        bookmarkList.style.display = "block";
    }
});

bookmarkCloseButton.addEventListener("click", () => {
    bookmarkList.style.display = "none";
});




function addToBookmark(iconElement) {
    const word = document.querySelector(".word p").innerText;
    const bookmarks = getBookmarksFromLocalStorage();

    if (!bookmarks.includes(word)) {
        bookmarks.push(word);
        saveBookmarksToLocalStorage(bookmarks);
        updateBookmarkList(bookmarks);
        alert("Successfully added item to bookmark")
    } else{
        alert("item is already in bookmarks")
    }
}




function removeFromBookmark(word) {
    const bookmarks = getBookmarksFromLocalStorage();
    const index = bookmarks.indexOf(word);

    if (index !== -1) {
        bookmarks.splice(index, 1);
        saveBookmarksToLocalStorage(bookmarks);
        updateBookmarkList(bookmarks);
    }
}


function getBookmarksFromLocalStorage() {
    const storedBookmarks = localStorage.getItem('bookmarks');
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
}


function saveBookmarksToLocalStorage(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}


function updateBookmarkList(bookmarks) {
    const bookmarkList = document.querySelector(".bookmark-list");
    bookmarkList.innerHTML = "";

    bookmarks.forEach(word => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span class="bookmark-word">${word}</span>
            <div class="bookmark-icon">
                <i class="fas fa-trash" onclick="removeFromBookmark('${word}')"></i>
                <i class="fas fa-arrow-right" onclick="fillSearchInput('${word}')"></i>
            </div>
        `;
        bookmarkList.appendChild(listItem);
    });
}


updateBookmarkList(getBookmarksFromLocalStorage());



const historyButton = document.getElementById("history-button");
const historyList = document.getElementById("history-list");

const maxHistorySize = 10;
let history = getHistoryFromLocalStorage();


function addToHistory(word) {
    if (history.length >= maxHistorySize) {
        history.shift(); 
    }
    history.push(word);
    saveHistoryToLocalStorage(history);
    updateHistoryList(history);
}


function clearHistory() {
    history = [];
    saveHistoryToLocalStorage(history);
    updateHistoryList(history);
}


function getHistoryFromLocalStorage() {
    const storedHistory = localStorage.getItem('history');
    return storedHistory ? JSON.parse(storedHistory) : [];
}


function saveHistoryToLocalStorage(history) {
    localStorage.setItem('history', JSON.stringify(history));
}


function updateHistoryList(history) {
    historyList.innerHTML = "";

    const historyTop = document.createElement("div");
    historyTop.classList.add("history-top");

    const historyPageName = document.createElement("span");
    
    historyPageName.id = "history-pagename";
    historyPageName.textContent = "History";
    historyList.appendChild(historyPageName);

    const historyCloseButton = document.createElement("span");
    historyCloseButton.classList.add("material-icons");
    historyCloseButton.textContent = "close"; 

    
    historyTop.appendChild(historyPageName);
    historyTop.appendChild(historyCloseButton);
    
    historyList.appendChild(historyTop);

    

    const historyHr = document.createElement("hr");
    historyList.appendChild(historyHr);

    history.forEach(word => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${word}</span>
            <div class="history-icon">
                <i class="fas fa-trash" onclick="removeFromHistory('${word}')"></i>
                <i class="fas fa-arrow-right" onclick="fillSearchInput('${word}')"></i>
            </div>
            
        `;
        historyList.appendChild(listItem);
    });

    historyCloseButton.addEventListener("click", closeHistoryList);

    function closeHistoryList() {
    
    historyList.style.display = "none"; // Misalnya, mengatur elemen menjadi tidak terlihat
    }
}


updateHistoryList(history);





historyButton.addEventListener("click", () => {
    
    if (historyList.style.display === "block") {
        historyList.style.display = "none";
    } else {
        historyList.style.display = "block";
            
    }
     
});





function removeFromHistory(word) {
    const index = history.indexOf(word);

    if (index !== -1) {
        history.splice(index, 1);
        saveHistoryToLocalStorage(history);
        updateHistoryList(history);
    }
}

function fillSearchInput(word) {
    searchInput.value = word;
    fetchApi(word);
    addToHistory(word);
}










