newsList = [];

fetch("/getuser")
    .then((resp) => { resp.text().then((user) => { 
        document.getElementById("un-span").innerText = user + ".";
        if (user != "Ю. Е. Козуб") {
            document.getElementById("new").style.display = "none";
        }
    }) 
});

fetch("/news").
then((resp) => {
    resp.json().then((news) => {
        newsList = news;
        newsList.reverse();  
        fillNews();
    })
});

function logout() {
    fetch("/logout");
    window.location.href = '../login/index.html';
}

function fillNews() {
    let mainNode = document.getElementById("main");

    for (let news of newsList) {
        let newsNode = document.createElement("DIV");
        newsNode.className = "news";
        newsNode.addEventListener("click", onNewsClick);
        mainNode.appendChild(newsNode);
        let creatorNode = document.createElement("DIV");
        creatorNode.className = "creator";
        newsNode.appendChild(creatorNode);
        let contentNode = document.createElement("DIV");
        contentNode.className = "content";
        newsNode.appendChild(contentNode);
        let faceNode = document.createElement("IMG");
        faceNode.src = "../faces/" + news[0] + ".jpg"
        faceNode.className = "face";
        creatorNode.appendChild(faceNode);
        let creatorNameNode = document.createElement("P");
        let textNode = document.createTextNode(news[0]);
        creatorNameNode.appendChild(textNode);
        creatorNameNode.className = "creator-name";
        creatorNode.appendChild(creatorNameNode);
        let newsNameNode = document.createElement("H3");
        let textNode2 = document.createTextNode(news[1]);
        newsNameNode.appendChild(textNode2);
        contentNode.appendChild(newsNameNode);
        let previewTextNode = document.createElement("P");
        let textNode3 = document.createTextNode(news[2]);
        previewTextNode.appendChild(textNode3);
        previewTextNode.className = "preview-text";
        contentNode.appendChild(previewTextNode);
    }
}

function onNewsClick() {
    localStorage.setItem("currentNews", JSON.stringify(newsList[whichChild(this)])); 
    window.location.href = '../news/index.html';
}

function whichChild(elem){
    let i = 0;
    while ((elem=elem.previousElementSibling) != null) ++i;
    return i;
}