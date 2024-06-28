import { Injectable } from "@angular/core";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  CollectionReference,
  DocumentData,
  collection,
  doc,
  getDocs,
  deleteDoc,
  getFirestore,
  setDoc,
  Firestore,
} from "firebase/firestore";
import { Subject } from "rxjs";
import { firebaseConfig } from "../environment";
import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: "root",
})
export class DbService {
  cardData: CollectionReference<DocumentData>;
  userCards: DocumentData[] = [];
  private cardDataSubject = new Subject<DocumentData[]>();
  cardData$ = this.cardDataSubject.asObservable();
  response: any;
  private auth: Auth;
  loggedIn: boolean = false;
  private username: string = "";
  private db: Firestore;
  private app: FirebaseApp;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  public async onFormSubmit(
    playerName: string,
    cardNumber: string,
    cardCompany: string,
    psaCert: any,
    imageURL?: string,
  ): Promise<void> {
    if (!this.cardData) {
      console.error("Card data collection is not initialized.");
      return;
    }

    await setDoc(doc(this.cardData, playerName), {
      playerName: playerName,
      cardNumber: cardNumber,
      cardCompany: cardCompany,
      psaCert: psaCert,
      imageURL: imageURL ?? "",
    });

    await this.loadCardData(); // Reload data after submitting
  }

  public async loadCardData(): Promise<void> {
    this.cardData = collection(this.db, this.username);
    if (!this.cardData) {
      console.error("Card data collection is not initialized.");
      return;
    }

    const querySnapshot = await getDocs(this.cardData);
    this.userCards = [];
    querySnapshot.forEach((doc) => {
      if (this.userCards.indexOf(doc.data()) === -1) {
        this.userCards.push(doc.data());
      } else {
        console.log("This item already exists");
      }
    });

    this.cardDataSubject.next(this.userCards); // Notify subscribers
  }

  public async deleteCard(playerName: string): Promise<void> {
    if (!this.cardData) {
      console.error("Card data collection is not initialized.");
      return;
    }

    await deleteDoc(doc(this.cardData, playerName));
    await this.loadCardData(); // Reload data after deletion
  }

  public async signIn(username: string, password: string): Promise<boolean> {
    return signInWithEmailAndPassword(this.auth, username, password)
      .then((userCredential) => {
        // Successful sign-in
        return true;
      })
      .catch((error) => {
        // Failed sign-in
        console.error(error);
        return false;
      });
  }
}
