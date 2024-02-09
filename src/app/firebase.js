// En tu archivo de inicialización de Firebase
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GithubAuthProvider,
} from 'firebase/auth'
import { collection, getFirestore } from 'firebase/firestore'
import { getPerformance } from 'firebase/performance'
const firebaseConfig = {
  apiKey: 'AIzaSyDHfPcbbo2zg-Hqc-rDp3qgHJ9kj9EtaT8',
  authDomain: 'animesz-f90c0.firebaseapp.com',
  databaseURL: 'https://animesz-f90c0-default-rtdb.firebaseio.com',
  projectId: 'animesz-f90c0',
  storageBucket: 'animesz-f90c0.appspot.com',
  messagingSenderId: '117785365870',
  appId: '1:117785365870:web:7792cb19488a8af169857f',
  measurementId: 'G-0TWKC9L8XQ',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const database = getDatabase(app)
const auth = getAuth(app)
let perf

if (typeof window !== 'undefined') {
  perf = getPerformance(app) // Inicializar perf solo si window está presente
}

setPersistence(auth, browserLocalPersistence)

export { auth, db, perf, database }
