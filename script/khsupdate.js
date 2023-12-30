import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, ref, get, child, set, remove, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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

let hci = document.getElementById("hci");
let ppw = document.getElementById("ppw");
let basdat = document.getElementById("basis-data");
let dpbo = document.getElementById("dpbo");
let metnum = document.getElementById("metode-numerik");
let komas = document.getElementById("komputer-masyarakat");
let datray = document.getElementById("data-raya");
let etprof = document.getElementById("etika-profesi");
let khs = document.getElementById("khs-pict");

let subbtn = document.getElementById("submit-btn");

let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));

let addData = async (evt) => {
    if (evt) {
        evt.preventDefault();
    }
    try {
        const gradeData = {
            hci: hci.value,
            ppw: ppw.value,
            basdat: basdat.value,
            dpbo: dpbo.value,
            metnum: metnum.value,
            komas: komas.value,
            datray: datray.value,
            etprof: etprof.value,
        }
        
        if (khs.files.length > 0) {
            const khsFile = khs.files[0];
            const storageRefInstance = storageRef(storage, `khs/${userCreds.uid}`);
            
            await uploadBytes(storageRefInstance, khsFile);
    
            gradeData.khsURL = await getDownloadURL(storageRefInstance);
        }

        await set(ref(database, `UserAuthList/${userCreds.uid}/courses`), gradeData);

        alert("Data saved");
        window.location.href = "khs.html";
        await setdata(user);
    }
    catch (error) {
        alert(error.message);
        console.error(error.code);
        console.error(error.message);
    }
}

let updateData = async (evt) => {
    if (evt) {
        evt.preventDefault();
    }
    try {
        const gradeData = {
            hci: hci.value,
            ppw: ppw.value,
            basdat: basdat.value,
            dpbo: dpbo.value,
            metnum: metnum.value,
            komas: komas.value,
            datray: datray.value,
            etprof: etprof.value,
        }
        
        if (khs.files.length > 0) {
            const khsFile = khs.files[0];
            const storageRefInstance = storageRef(storage, `khs/${userCreds.uid}`);
            
            await uploadBytes(storageRefInstance, khsFile);
    
            gradeData.khsURL = await getDownloadURL(storageRefInstance);
        }

        await update(ref(database, `UserAuthList/${userCreds.uid}/courses`), gradeData);

        alert("Data updated");
        window.location.href = "khs.html";
        await setdata(user);
    } catch (error) {
        console.error("Error in updateData:", error);
        throw error;
    }
}

function retData() {
    const dbref = ref(database);
    const userCourseRef = child(dbref, `UserAuthList/${userCreds.uid}/courses`);

    get(userCourseRef).then((snapshot) => {
        if (snapshot.exists()) {
            const courseData = snapshot.val();
            document.getElementById("hci").value = courseData.hci || "";
            document.getElementById("ppw").value = courseData.ppw || "";
            document.getElementById("basis-data").value = courseData.basdat || "";
            document.getElementById("dpbo").value = courseData.dpbo || "";
            document.getElementById("metode-numerik").value = courseData.metnum || "";
            document.getElementById("komputer-masyarakat").value = courseData.komas || "";
            document.getElementById("data-raya").value = courseData.datray || "";
            document.getElementById("etika-profesi").value = courseData.etprof || "";
            document.getElementById("khs-pict").src = courseData.khsURL || "";
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

let userRef = ref(database, `UserAuthList/${userCreds.uid}`);

function setdata(user) {
    return new Promise(async (resolve, reject) => {
        const userRef = ref(database, `UserAuthList/${userCreds.uid}/courses`);
        try {
            const snapshot = await get(userRef);
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
                document.getElementById("khs-pict").src = userData.khs;
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

let submitbtn = async (evt) => {
    evt.preventDefault();

    try {
        const dataExists = await setdata(user);
        if (dataExists) {
            await updateData();
        } else {
            await addData();
        }
        await setdata(user);
    } catch (error) {
        console.error("Error in submitbtn:", error);
        alert("Error processing data. Please check the console for more details.");
    }
}

subbtn.addEventListener("click", submitbtn);