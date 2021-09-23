let lowercase_names = {
    "Ю. Е. Козуб": "юлии евгеньевны козуб"
};

let images = {"Ю. Е. Козуб": "kozub"}
fetch("/getuser")
    .then((resp) => { resp.text().then((user) => { 
        if (user == "Ученик 6Н") {
            alert("Ученики не могут добавлять новости.");
            window.location.href = '../main/index.html';
        }
        document.getElementById("c-name").innerText = lowercase_names[user];
        document.getElementById("creator-name").innerText = "-- " + user; 
        document.getElementById("face").src = "../faces/" + images[user] + ".jpg";
    }) 
});

let markedd = document.getElementById("marked")
let unmarked = document.getElementById("text")

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
                }).then((resp) => { window.location.href = '../main/index.html'} );
            }) 
        });
    };
}

function textChanged() {
    markedd.innerHTML = marked(unmarked.value)
}