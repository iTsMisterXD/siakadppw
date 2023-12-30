import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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
const database = getDatabase();
import { getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
const storage = getStorage(app);
    
const user = auth.currentUser;

let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let userInfo = JSON.parse(sessionStorage.getItem("user-info"));

async function updateUserProfile(user) {
    const userName = user.displayName || userInfo.username;
    const userEmail = user.email || userCreds.email;
    const userPhoto = user.photoURL || userInfo.profilePictureURL;
    document.getElementById("user-name").textContent = userName;
    document.getElementById("user-email").textContent = userEmail;
    document.getElementById("user-photo").src = userPhoto;
    document.getElementById("program-study").textContent = userInfo.program;
    document.getElementById("faculty").textContent = userInfo.faculty;
    document.getElementById("phone").textContent = userInfo.phone;
    document.getElementById("address").textContent = userInfo.address;
    document.getElementById("birthdate").textContent = userInfo.birthdate;
    document.getElementById("NIM").textContent = userInfo.NIM;
    document.getElementById("tahun-masuk").textContent = userInfo.tahunmasuk;
    document.getElementById("birthplace").textContent = userInfo.birthplace;
    document.getElementById("religion").textContent = userInfo.religion;
    document.getElementById("gender").textContent = userInfo.gender,
    document.getElementById("country").textContent = userInfo.country;
    document.getElementById("email").textContent = userInfo.email;
}
    
onAuthStateChanged(auth, async (user) => {
    if (user) {
        updateUserProfile(user);
        const userRef = ref(database, `UserAuthList/${user.uid}`);
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const updatedUserInfo = snapshot.val();
                sessionStorage.setItem("user-info", JSON.stringify(updatedUserInfo));
                updateUserProfile(user);
            }
        });
    } else {
        if (!logoutButton.clicked) {
            alert("Please login to continue");
            window.location.href = "login.html";
        }
    }
});
    
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