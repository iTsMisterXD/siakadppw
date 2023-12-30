import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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

let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let register = document.getElementById("register-form");
let confirmPassword = document.getElementById("confirm-password");
let passwordMatchError = document.getElementById("password-match-error");

let registeruser = async (evt) => {
    evt.preventDefault();

    if (password.value !== confirmPassword.value) {
      passwordMatchError.textContent = "Passwords must match";
      return;
    }

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const uid = credentials.user.uid;

      const userData = {
          username: username.value,
          email: email.value,
      };

      await set(ref(database, 'UserAuthList/' + uid), userData);

      alert("Register Success");
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
      console.error(error.code);
      console.error(error.message);
    }
  };

  password.addEventListener("input", () => {
    passwordMatchError.textContent = "";
});
  
  register.addEventListener("submit", registeruser);
