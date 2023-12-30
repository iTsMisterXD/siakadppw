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

let username = document.getElementById("username");
let faculty = document.getElementById("faculty");
let program = document.getElementById("program-study");
let NIM = document.getElementById("nim");
let tahunmasuk = document.getElementById("tahun-masuk");
let phone = document.getElementById("phone");
let address = document.getElementById("address");
let birthplace = document.getElementById("birthplace");
let birthdate = document.getElementById("birthdate");
let religion = document.getElementById("religion");
let country = document.getElementById("country");
let gender = document.getElementById("gender");
let profile = document.getElementById("formProfile");

let subbtn = document.getElementById("submit-btn");

let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));

let addData = async (evt) => {
    if (evt) {
        evt.preventDefault();
    }
    try {
        const bioData = {
            username: username.value,
            faculty: faculty.value,
            program: program.value,
            NIM: NIM.value,
            tahunmasuk: tahunmasuk.value,
            phone: phone.value,
            address: address.value,
            email: email.value,
            birthplace: birthplace.value,
            birthdate: birthdate.value,
            religion: religion.value,
            country: country.value,
            gender: gender.value,
        }
        
        if (profile.files.length > 0) {
            const profilePictureFile = profile.files[0];
            const storageRefInstance = storageRef(storage, `profilePictures/${userCreds.uid}`);
            
            await uploadBytes(storageRefInstance, profilePictureFile);
      
            bioData.profilePictureURL = await getDownloadURL(storageRefInstance);
          }

        await set(ref(database, `UserAuthList/${userCreds.uid}`), bioData);

        alert("Data saved");
        window.location.href = "hpage.html";
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
        const bioData = {
            username: username.value,
            faculty: faculty.value,
            program: program.value,
            NIM: NIM.value,
            tahunmasuk: tahunmasuk.value,
            phone: phone.value,
            email: email.value,
            address: address.value,
            birthplace: birthplace.value,
            birthdate: birthdate.value,
            religion: religion.value,
            country: country.value,
            gender: gender.value,
        }
        
        if (profile.files.length > 0) {
            const profilePictureFile = profile.files[0];
            const storageRefInstance = storageRef(storage, `profilePictures/${userCreds.uid}`);
            
            await uploadBytes(storageRefInstance, profilePictureFile);
      
            bioData.profilePictureURL = await getDownloadURL(storageRefInstance);
          }

        await update(ref(database, `UserAuthList/${userCreds.uid}`), bioData);

        alert("Data saved");
        window.location.href = "hpage.html";
        await setdata(user);

    }
    catch (error) {
        alert(error.message);
        console.error(error.code);
        console.error(error.message);
    }
}

function retData(user) {
    const dbref = ref(database);
    const userBio = child(dbref, `UserAuthList/${userCreds.uid}`);
    get(userBio).then((snapshot) => {
        if (snapshot.exists()) {
            const courseBio = snapshot.val();
            document.getElementById("username").value = courseBio.username || "";
            document.getElementById("faculty").value = courseBio.faculty || "";
            document.getElementById("program-study").value = courseBio.program || "";
            document.getElementById("nim").value = courseBio.NIM || "";
            document.getElementById("email").value = courseBio.email || userCreds.email;
            document.getElementById("tahun-masuk").value = courseBio.tahunmasuk || "";
            document.getElementById("phone").value = courseBio.phone || "";
            document.getElementById("address").value = courseBio.address || "";
            document.getElementById("birthplace").value = courseBio.birthplace || "";
            document.getElementById("birthdate").value = courseBio.birthdate || "";
            document.getElementById("religion").value = courseBio.religion || "";
            document.getElementById("country").value = courseBio.country || "";
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
        document.getElementById("user-email").textContent = userCreds.email;
        const userRef = ref(database, `UserAuthList/${userCreds.uid}`);
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                document.getElementById("username").textContent = userData.username;
                document.getElementById("faculty").textContent = userData.faculty;
                document.getElementById("program-study").textContent = userData.program;
                document.getElementById("nim").textContent = userData.NIM;
                document.getElementById("email").textContent = userData.email;
                document.getElementById("tahun-masuk").textContent = userData.tahunmasuk;
                document.getElementById("phone").textContent = userData.phone;
                document.getElementById("address").textContent = userData.address;
                document.getElementById("birthplace").textContent = userData.birthplace;
                document.getElementById("birthdate").textContent = userData.birthdate;
                document.getElementById("religion").textContent = userData.religion;
                document.getElementById("country").textContent = userData.country;
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
        updateUserProfile(auth.currentUser);
    } catch (error) {
        console.error("Error in submitbtn:", error);
        alert("Error processing data. Please check the console for more details.");
    }
}

subbtn.addEventListener("click", submitbtn);