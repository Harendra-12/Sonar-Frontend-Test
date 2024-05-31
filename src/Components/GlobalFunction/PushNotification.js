import { initializeApp } from "firebase/app";
import { getMessaging,getToken  } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyA_Hga3Yxr-anFSZ9p41SWUGUQW1cdbxZk",
  authDomain: "notification-demo-92836.firebaseapp.com",
  projectId: "notification-demo-92836",
  storageBucket: "notification-demo-92836.appspot.com",
  messagingSenderId: "1022591965249",
  appId: "1:1022591965249:web:812c22bfa6c2d4ae0d4ec0"
};
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const generateToken = async ()=>{
  const permission = await Notification.requestPermission()
  console.log(permission);
  if(permission==="granted"){
    if(localStorage.getItem("firebaseToken")){
      return null
    }else{
      const token = await getToken(messaging, {vapidKey: "BA4P-MUY5UwMGpr0C-9oJEVQyHFWzfjocm7Ae0k2csoDi4oKNjcLI4RQiUztAlC3s1ehbIS-bnsPMC7JXdKceF4"});
      if(token){
        localStorage.setItem("firebaseToken",token)
        return token
      }
    }
   
  } 
}