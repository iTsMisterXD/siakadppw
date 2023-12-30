import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

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
const dbref = ref(database);
const storage = getStorage(app);

let email = document.getElementById("email");
let password = document.getElementById("password");
let captchaInput = document.getElementById("captcha-input");
let login = document.getElementById("login-form");
let forgotPassword = document.getElementById("forgot-password");

let num1 = getRandomNumber(1, 10);
let num2 = getRandomNumber(1, 10);
let captchaSum = num1 + num2;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("captcha-num1").textContent = num1;
document.getElementById("captcha-num2").textContent = num2;

auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        if (user) {
          sessionStorage.setItem('user-creds', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }));
        }
        console.log(user);
        window.location.href = "hpage.html";
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
})

let signinuser = (evt) => {
  evt.preventDefault();

  let userSum = parseInt(captchaInput.value, 10);

  if (userSum === captchaSum) {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((credentials) => {
        console.log(credentials.user.uid);
        get(child(dbref, 'UserAuthList/' + credentials.user.uid))
          .then((snapshot) => {
            if (snapshot.exists) {
              sessionStorage.setItem("user-info", JSON.stringify({
                uid: credentials.user.uid,
                username: snapshot.val().username,
                email: snapshot.val().email,
                phone: snapshot.val().phone,
                birthdate: snapshot.val().birthdate,
                NIM: snapshot.val().NIM,
                faculty: snapshot.val().faculty,
                program: snapshot.val().program,
                profilePictureURL: snapshot.val().profilePictureURL,
                birthplace: snapshot.val().birthplace,
                country: snapshot.val().country,
                gender: snapshot.val().gender,
                religion: snapshot.val().religion,
                tahunmasuk: snapshot.val().tahunmasuk,
                address: snapshot.val().address,
                krs: snapshot.val().krs,
              }));
              sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
              window.location.href = "hpage.html";
            } else {
              alert("No data available");
            }
          })
          .catch((error) => {
            alert("Error fetching user data: " + error.message);
            console.error("Error fetching user data:", error);
          });
      })
      .catch((error) => {
        alert("Error signing in: " + error.message);
        console.error("Error signing in:", error);
      });
  } else {
    alert("Incorrect captcha. Please try again.");
    resetCaptcha();
  }
};

let ForgotPassword = () => {
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      alert("Password reset email sent");
    })
    .catch((error) => {
      alert("Error sending password reset email: " + error.message);
      console.error("Error sending password reset email:", error);
    });
}

function resetCaptcha() {
  num1 = getRandomNumber(1, 10);
  num2 = getRandomNumber(1, 10);
  captchaSum = num1 + num2;

  document.getElementById("captcha-num1").textContent = num1;
  document.getElementById("captcha-num2").textContent = num2;
  captchaInput.value = "";
}

login.addEventListener("submit", signinuser);
forgotPassword.addEventListener("click", ForgotPassword);