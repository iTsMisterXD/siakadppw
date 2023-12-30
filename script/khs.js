import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, ref, get, onValue, child, set, remove, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
const storage = getStorage(app);

const user = auth.currentUser;

let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let userInfo = JSON.parse(sessionStorage.getItem("user-info"));

async function setdata(user) {
    try {
        const snapshot = await get(ref(database, `UserAuthList/${userCreds.uid}/courses`));

        if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById("hci").textContent = userData.hci;
            document.getElementById("ppw").textContent = userData.ppw;
            document.getElementById("basis-data").textContent = userData.basdat;
            document.getElementById("dpbo").textContent = userData.dpbo;
            document.getElementById("metode-numerik").textContent = userData.metnum;
            document.getElementById("komputer-masyarakat").textContent = userData.komas;
            document.getElementById("data-raya").textContent = userData.datray;
            document.getElementById("etika-profesi").textContent = userData.etprof;
            const userKhsImage = document.getElementById("user-khs");
            userKhsImage.src = userData.khsURL;
            document.getElementById("view-image-btn").addEventListener("click", function () {
                if (userKhsImage.src) {
                    window.open(userKhsImage.src, "_blank");
                } else {
                    alert("No image available to view.");
                }
            });
        } else {
            document.getElementById("hci").textContent = "Grade not inputted";
            document.getElementById("ppw").textContent = "Grade not inputted";
            document.getElementById("basis-data").textContent = "Grade not inputted";
            document.getElementById("dpbo").textContent = "Grade not inputted";
            document.getElementById("metode-numerik").textContent = "Grade not inputted";
            document.getElementById("komputer-masyarakat").textContent = "Grade not inputted";
            document.getElementById("data-raya").textContent = "Grade not inputted";
            document.getElementById("etika-profesi").textContent = "Grade not inputted";
        }
    } catch (error) {
        console.error("Error in setdata:", error);
    }
}

async function updateUserProfile(user) {
    const userName = user.displayName || userInfo.username;
    const userEmail = user.email;
    document.getElementById("user-email").textContent = userEmail;
    document.getElementById("user-name").textContent = userName;
    document.getElementById("program-study").textContent = userInfo.program;
    document.getElementById("faculty").textContent = userInfo.faculty;
    document.getElementById("NIM").textContent = userInfo.NIM;
    document.getElementById("tahun-masuk").textContent = userInfo.tahunmasuk;
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        setdata(user);
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