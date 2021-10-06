let lowercase_names = {
    "Ю. Е. Козуб": "юлии евгеньевны",
    "Ян Бобрус": "яна бобруса"
};

let images = {
    "Ю. Е. Козуб": "kozub",
    "Ян Бобрус": "yanb"
}

let news = JSON.parse(localStorage.getItem("currentNews"));

fetch("/getuser")
    .then((resp) => { resp.text().then((user) => { 
        if (user != news[0]) {
            document.getElementById("delete").style.display = "none";
            document.getElementById("rewrite").style.display = "none";
        }
    }) 
});

document.getElementById("title").innerText = news[1].toUpperCase();
document.getElementById("description").innerText = news[3] + " новость от " + lowercase_names[news[0]] + ", " + news[6];
document.getElementById("text").innerHTML = marked(news[2]);
document.getElementById("creator-name").innerText = "-- " + news[0];
document.getElementById("face").src = "../faces/" + images[news[0]] + ".jpg";

function deleteNews() {
    if(confirm("Вы точно хотите удалить эту новость?")){
        fetch("/deletenews/" + news[4], {"mode": "no-cors"}).then((resp) => {
            resp.json().then((code) => {
                if (code == "NO RIGHTS") {
                    alert("Это не ваша новость. Вы не можете удалять чужие новости.");
                } else {
                    window.location.href = 'https://news-6n.herokuapp.com/pages/main/index.html';
                }
            });
        });
    }
}

function rewriteNews() {
    if(confirm("Изменить эту новость?")){
        localStorage.setItem("rewritingNews", localStorage.getItem("currentNews"));
        window.location.href = 'https://news-6n.herokuapp.com/pages/creator/index.html';
    }
}