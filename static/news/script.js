let lowercase_names = {
    "Пельмень": "пельменя",
    "Бойстул": "бойстула",
    "Ян": "яна"
};

let news = JSON.parse(localStorage.getItem("currentNews"));

document.getElementById("title").innerText = news[1].toUpperCase();
document.getElementById("description").innerText = news[3] + " новость от " + lowercase_names[news[0]];
document.getElementById("text").innerText = news[2];
document.getElementById("creator-name").innerText = "-- " + news[0];
document.getElementById("face").src = "../faces/" + news[0] + ".jpg";

function deleteNews() {
    confirm("Вы точно хотите порвать эту пельменовость на куски и сжечь?");
    fetch("/deletenews/" + news[4], {"mode": "no-cors"}).then((resp) => {
        resp.json().then((code) => {
            if (code == "NO RIGHTS") {
                alert("Это не твоя новость. Ты не можешь рвать чужое имущество. УК РФ Статья 167: Умышленное уничтожение или повреждение имущества.");
            } else {
                window.location.href = '../main/index.html';
            }
        });
    });
}