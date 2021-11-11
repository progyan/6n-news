let newsList = [];
let unmark = new UnmarkRenderer();

let images = {
    "Ю. Е. Козуб": "kozub",
    "Ян Бобрус": "yanb"
}

fetch("/getuser")
    .then((resp) => { resp.text().then((user) => { 
        if (user == "")
            document.getElementById("logout").innerText = "Войти";
        else
            document.getElementById("un-span").innerText = user + ".";
        if (user != "Ю. Е. Козуб" && user != "Ян Бобрус") 
            document.getElementById("new").style.display = "none";
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
    window.location.href = 'https://news-6n.herokuapp.com/pages/login/index.html';
}

function fillNews() {
    let mainNode = document.getElementById("main");

    for (let news of newsList) {
        let newsNode = document.createElement("DIV");
        newsNode.className = "news";
        if(news[5])
            newsNode.className += " important";
        newsNode.addEventListener("click", onNewsClick);
        mainNode.appendChild(newsNode);
        let creatorNode = document.createElement("DIV");
        creatorNode.className = "creator";
        newsNode.appendChild(creatorNode);
        let contentNode = document.createElement("DIV");
        contentNode.className = "content";
        newsNode.appendChild(contentNode);
        let faceNode = document.createElement("IMG");
        faceNode.src = "../faces/" + images[news[0]] + ".jpg"
        faceNode.className = "face";
        creatorNode.appendChild(faceNode);
        let creatorNameNode = document.createElement("P");
        let textNode = document.createTextNode(news[0] + ", " + news[6]);
        creatorNameNode.appendChild(textNode);
        creatorNameNode.className = "creator-name";
        creatorNode.appendChild(creatorNameNode);
        let newsNameNode = document.createElement("H3");
        let textNode2 = document.createTextNode(news[1]);
        newsNameNode.appendChild(textNode2);
        contentNode.appendChild(newsNameNode);
        let previewTextNode = document.createElement("P");
        let textNode3 = document.createTextNode(marked.parse(news[2], {"renderer": unmark}));
        previewTextNode.appendChild(textNode3);
        previewTextNode.className = "preview-text";
        contentNode.appendChild(previewTextNode);
    }
}

function onNewsClick() {
    localStorage.setItem("currentNews", JSON.stringify(newsList[whichChild(this)])); 
    window.location.href = 'https://news-6n.herokuapp.com/pages/news/index.html';
}

function whichChild(elem){
    let i = 0;
    while ((elem=elem.previousElementSibling) != null) ++i;
    return i;
}

////// SUBSCRIPTION TO NOTIFICATIONS //////

function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });
  
        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
    .then(function(permissionResult) {
        if (permissionResult !== 'granted') {
            throw new Error('We weren\'t granted permission.');
        }
    });
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function subscribeUserToPush() {
    return navigator.serviceWorker.register('./service-worker.js')
    .then(function(registration) {
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                'BDB8FsvNOgbQfK7bl2G4rnLOkvPLZRnFd0f_pc66-BsWxUHp7EKMSJ4rzFIel2KhkIfp-5yJGJMO31LUH3ghaxc'
            )
        };
  
        return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
    });
}

function sendSubscriptionToBackEnd(subscription) {
    return fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Bad status code from server.');
        }
  
        return response.json();
    })
    .then(function(responseData) {
        if (!(responseData.data && responseData.data.success)) {
            throw new Error('Bad response from server.');
        } else {
            alert("Отлично! Теперь Вы будете получать новости.");
        }
    });
}

navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription()
    .then((sub) => { 
        if(sub) {
            document.getElementById("subscribe").style.display = "none";
        }
    });
});