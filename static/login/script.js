function toggleVisibility() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function loginChanged() {
    let login = document.getElementById("login").value;
    if (login == "Ю. Е. Козуб" || login == "Ян Бобрус") {
        document.getElementById("getpass").style.display = "block";
    } else {
        document.getElementById("getpass").style.display = "none";
    }
}

function submitLogin() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    console.log(login, password);
    fetch("/login", { 
        'method': "post", 
        'headers': {
            'Content-Type': 'application/json'
        },      
        'body': JSON.stringify([
            login, password
        ])
    }).then((resp) => {
        console.log(resp) 
        resp.json().then((t) => {
            if(t == "OK") {
                window.location.href = 'https://news-6n.herokuapp.com/pages/main/index.html';
            } else {
                alert("Неправильный логин/пароль.");
            }
        })
    })
}

document.getElementById("getpass").style.display = "none";