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

let krsInput = document.getElementById("krs-pict");

let krsbtn = document.getElementById("krsbtn");

let addKrs = async (evt) => {
    if (evt) {
        evt.preventDefault();
    }
    try {
        let krsUrl = "";
        const krsInput = document.getElementById("krs-pict");

        if (krsInput && krsInput.files.length > 0) {
            const krsFile = krsInput.files[0];
            const storageRefInstance = storageRef(storage, `krs/${userCreds.uid}`);
            
            await uploadBytes(storageRefInstance, krsFile);
            
            krsUrl = await getDownloadURL(storageRefInstance);

            const userRef = ref(database, `UserAuthList/${userCreds.uid}`);
            await update(userRef, { krs: krsUrl });

            alert("Data saved");
            window.location.href = "krs.html";
            await setdata(user);
        } else {
            alert("Please select a file to upload.");
        }
    } catch (error) {
        console.error("Error in addKrs:", error);
        throw error;
    }
}

async function setdata(user) {
    try {
        const snapshot = await get(ref(database, `UserAuthList/${userCreds.uid}`));

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userkrsImage = document.getElementById("user-krs");
            userkrsImage.src = userData.krs;
            document.getElementById("view-image-btn").addEventListener("click", function () {
                if (userkrsImage.src) {
                    window.open(userkrsImage.src, "_blank");
                } else {
                    alert("No image available to view.");
                }
            });
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

let submitbtn = async (evt) => {
    evt.preventDefault();

    try {
        const dataExists = await setdata(user);
        await addKrs();
        await setdata(user);
    } catch (error) {
        console.error("Error in submitbtn:", error);
        alert("Error processing data. Please check the console for more details.");
    }
}

krsbtn.addEventListener("click", submitbtn);