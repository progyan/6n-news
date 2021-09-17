let lowercase_names = {
    "Ю. Е. Козуб": "юлии евгеньевны козуб"
};

let news = JSON.parse(localStorage.getItem("currentNews"));

document.getElementById("title").innerText = news[1].toUpperCase();
document.getElementById("description").innerText = news[3] + " новость от " + lowercase_names[news[0]];
document.getElementById("text").innerHTML = marked(news[2]);
document.getElementById("creator-name").innerText = "-- " + news[0];
document.getElementById("face").src = "../faces/" + news[0] + ".jpg";

function deleteNews() {
    confirm("Вы точно хотите удалить эту новость?");
    fetch("/deletenews/" + news[4], {"mode": "no-cors"}).then((resp) => {
        resp.json().then((code) => {
            if (code == "NO RIGHTS") {
                alert("Это не ваша новость. Вы не можете удалять чужие новости.");
            } else {
                window.location.href = '../main/index.html';
            }
        });
    });
}