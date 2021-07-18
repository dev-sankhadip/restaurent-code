import firebase from 'firebase';
import { environment } from '../../environments/environment';

firebase.initializeApp(environment.firebaseConfig);

export const auth = firebase.auth();
export default firebase;