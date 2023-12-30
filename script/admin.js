import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBh0EbwMk3s8TSVSEm9PlakgGYL7BF0OZs",
    authDomain: "ppw1-2d777.firebaseapp.com",
    databaseURL: "https://ppw1-2d777-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ppw1-2d777",
    storageBucket: "ppw1-2d777.appspot.com",
    messagingSenderId: "264198416929",
    appId: "1:264198416929:web:a866e93a049a6836749160",
    measurementId: "G-T4F1756HQF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
import { getDatabase, ref, get, child, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
const database = getDatabase();
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
const storage = getStorage(app);

let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));

var stdno = 0;
var userList = [];
var tbody = document.getElementById("tbody1");
function addTable(username, email, nim, program, phone) {
    let trow = document.createElement("tr");
    let tdno = document.createElement("td");
    let tdUsername = document.createElement("td");
    let tdEmail = document.createElement("td");
    let tdNim = document.createElement("td");
    let tdProgram = document.createElement("td");
    let tdPhone = document.createElement("td");
    stdno++;
    tdno.innerHTML = stdno;
    tdUsername.innerHTML = username;
    tdEmail.innerHTML = email;
    tdNim.innerHTML = nim;
    tdProgram.innerHTML = program;
    tdPhone.innerHTML = phone;
    trow.appendChild(tdno);
    trow.appendChild(tdUsername);
    trow.appendChild(tdEmail);
    trow.appendChild(tdNim);
    trow.appendChild(tdProgram);
    trow.appendChild(tdPhone);

    var controlDiv = document.createElement("td");
    var editButton = document.createElement("button");

    editButton.type = 'button';
    editButton.className = 'btn btn-primary';
    editButton.setAttribute('data-toggle', 'modal');
    editButton.setAttribute('data-target', '#exampleModalCenter');
    editButton.textContent = 'Edit';

    let currentStdno = stdno;
    editButton.addEventListener('click', function() {
        FillTboxes(currentStdno);
    });
    
    controlDiv.appendChild(editButton);

    trow.appendChild(controlDiv);
    tbody.appendChild(trow);
}

var tUsername = document.getElementById("username");
var tEmail = document.getElementById("email");
var tNim = document.getElementById("nim");
var tProgram = document.getElementById("study-program");
var tPhone = document.getElementById("phone");

function additemtoTable(accounts) {
    stdno = 0;
    tbody.innerHTML = "";
    userList = [];

    accounts.forEach((account, index) => {
        const { uid, data } = account;
        const { username, email, NIM, program, phone } = data;

        userList.push({ uid, data: { username, email, NIM, program, phone } });

        addTable(username, email, NIM, program, phone);
    });
};

function FillTboxes(index) {
    if (index == null) {
        tUsername.value = "";
        tEmail.value = "";
        tNim.value = "";
        tProgram.value = "";
        tPhone.value = "";
        tEmail.disabled = false;
    } else {
        if (index >= 1 && index <= userList.length) {
            --index;
            tUsername.value = userList[index].data.username;
            tEmail.value = userList[index].data.email;
            tNim.value = userList[index].data.NIM;
            tProgram.value = userList[index].data.program;
            tPhone.value = userList[index].data.phone;
            tEmail.disabled = true;
        } else {
            console.error("Invalid index:", index);
        }
    }
}

let updateData = async (evt) => {
    if (evt) {
        evt.preventDefault();
    }
    try {
        const bioData = {
            username: tUsername.value,
            email: tEmail.value,
            NIM: tNim.value,
            program: tProgram.value,
            phone: tPhone.value,
        };

        const currentUser = userList.find(user => user.data.email === tEmail.value);

        if (currentUser) {
            console.log('Found user:', currentUser);

            console.log(currentUser.uid);
            await update(ref(database, `UserAuthList/${currentUser.uid}`), bioData);

            alert("Data saved");
            $('#exampleModalCenter').modal('hide');
        } else {
            console.error('User not found in userList');
        }
    } catch (error) {
        alert(error.message);
        console.error(error.code);
        console.error(error.message);
    }
};

let delData = async (evt) => {
    if (evt) {
        evt.preventDefault();
    }
    try {
        const currentUser = userList.find(user => user.data.email === tEmail.value);

        if (currentUser) {
            console.log('Found user:', currentUser);

            const bioData = {
                email: tEmail.value
            };

            console.log(currentUser.uid);
            await remove(ref(database, `UserAuthList/${currentUser.uid}`));

            alert("Data Deleted");
            $('#exampleModalCenter').modal('hide');
        } else {
            console.error('User not found in userList');
        }
    } catch (error) {
        alert(error.message);
        console.error(error.code);
        console.error(error.message);
    }
};

document.getElementById("DelStd").addEventListener("click", delData);
document.getElementById("UpdStd").addEventListener("click", updateData);

function getAccounts() {
    const dbref = ref(database, "UserAuthList");

    onValue(dbref, (snapshot) => {
        const data = snapshot.val();
        const accounts = [];

        for (let uid in data) {
            const userData = data[uid];
            accounts.push({ uid, data: userData });
        }

        console.log('Fetched accounts:', accounts);

        additemtoTable(accounts);
    });
}

window.onload = getAccounts;

document.getElementById("DelStd").addEventListener("click", delData);
document.getElementById("UpdStd").addEventListener("click", updateData);

function retData(user) {
    const dbref = ref(database);
    const userBio = child(dbref, `UserAuthList/${userCreds.uid}`);
    get(userBio).then((snapshot) => {
        if (snapshot.exists()) {
            const courseBio = snapshot.val();
            document.getElementById("email").value = courseBio.email || userCreds.email || "";
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function setdata(user) {
    return new Promise(async (resolve, reject) => {
        document.getElementById("user-email").textContent = userCreds.email;
        const userRef = ref(database, `UserAuthList/${userCreds.uid}`);
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                document.getElementById("email").textContent = userData.email;
                resolve(true);
            } else {
                console.log("No data available");
                resolve(false);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

const logoutButton = document.getElementById("logout");
    
logoutButton.addEventListener("click", () => {
    auth.signOut().then(() => {
        sessionStorage.removeItem("user-creds");
        sessionStorage.removeItem("user-info");
    alert("Logout successful");
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Logout error", error);
    });
});

logoutButton.addEventListener("click", () => {
    logoutButton.clicked = true;
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        retData();
        setdata(user);
    } else {
        if (!logoutButton.clicked) {
            alert("Please login to continue");
            window.location.href = "login.html";
        }
    }
});