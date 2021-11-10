
let lowercase_names = {
    "Ю. Е. Козуб": "юлии евгеньевны козуб",
    "Ян Бобрус": "яна бобруса"
};

let rewriting = false;
let news;

if (localStorage.getItem("rewritingNews")) {
    news = JSON.parse(localStorage.getItem("rewritingNews"));
    document.getElementById("news-type").value = news[3];
    document.getElementById("title").value = news[1];
    document.getElementById("text").value = news[2];
    document.getElementById("is_important").checked = !news[4];
    localStorage.setItem("rewritingNews", "");
    rewriting = true;
}

let images = {
    "Ю. Е. Козуб": "kozub",
    "Ян Бобрус": "yanb"
}

fetch("/getuser")
    .then((resp) => { resp.text().then((user) => { 
        if (user == "Ученик 6Н") {
            alert("Только админы и учителя могут добавлять новости.");
            window.location.href = 'https://news-6n.herokuapp.com/pages/main/index.html';
        }
        document.getElementById("c-name").innerText = lowercase_names[user];
        document.getElementById("creator-name").innerText = "-- " + user; 
        document.getElementById("face").src = "../faces/" + images[user] + ".jpg";
    }) 
});

let markedd = document.getElementById("marked")
let unmarked = document.getElementById("text")

function goBack() {
    if(confirm('Выйти?')){
        let newsType = document.getElementById("news-type").value;
        let title = document.getElementById("title").value;
        let text = document.getElementById("text").value;
        let isImportant = document.getElementById("is_important").checked;
        localStorage.setItem("rewritingNews", JSON.stringify([0, title, text, newsType, isImportant]))
        window.location.href = 'https://news-6n.herokuapp.com/pages/main/index.html'
    }
}

function submitNews() {
    let newsType = document.getElementById("news-type").value;
    let title = document.getElementById("title").value;
    let text = document.getElementById("text").value;
    let isImportant = document.getElementById("is_important").checked;
    if(text == ""){
        alert("Вы забыли написать текст новости!");
        return;
    }
    if(title == ""){
        alert("Вы забыли написать название!");
        return;
    }
    if(confirm("Готово?")){
        if(!rewriting){
            fetch("/getuser")
                .then((resp) => { resp.text().then((user) => {        
                    let result = [user, title, text, newsType, isImportant];
                    console.log(result);
                    fetch("/addnews", { 
                        'method': "post", 
                        'headers': {
                            'Content-Type': 'application/json'
                        },      
                        'body': JSON.stringify(result)
                    }).then((resp) => { window.location.href = 'https://news-6n.herokuapp.com/pages/main/index.html'} );
                }) 
            });
        } else {
            fetch("/getuser")
                .then((resp) => { resp.text().then((user) => {  
                    fetch("/updatenews/" + news[4], { 
                        'method': "post", 
                        'headers': {
                            'Content-Type': 'application/json'
                        },      
                        'body': JSON.stringify([user, title, text, newsType, isImportant])
                    }).then((resp) => {
                        resp.json().then((code) => {
                            if (code == "NO RIGHTS") {
                                alert("Это не ваша новость. Вы не можете изменять чужие новости.");
                            } else {
                                window.location.href = 'https://news-6n.herokuapp.com/pages/main/index.html';
                            }
                        });
                    });
                })
            })  
        }
    };
}

function textChanged() {
    markedd.innerHTML = marked.parse(unmarked.value)
}