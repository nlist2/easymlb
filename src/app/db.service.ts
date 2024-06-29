import { Injectable } from "@angular/core";
import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
  getFirestore,
  collectionGroup,
  query,
  where,
} from "firebase/firestore";
import { Observable, Observer } from "rxjs";
import { firebaseConfig } from "../environment";

@Injectable({
  providedIn: "root",
})
export class DbService {
  private db: Firestore;
  private app: FirebaseApp;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  public loadYears(): Observable<string[]> {
    return new Observable<string[]>((observer: Observer<string[]>) => {
      const cardData = collection(this.db, "years");

      getDocs(cardData)
        .then((querySnapshot) => {
          const userYears: string[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            userYears.push(doc.id);
          });
          observer.next(userYears);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  public loadTeams(year: string): Observable<string[]> {
    return new Observable<string[]>((observer: Observer<string[]>) => {
      const teamsRef = collection(this.db, `years/${year}/teams`);

      getDocs(teamsRef)
        .then((querySnapshot) => {
          const userTeams: string[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            userTeams.push(doc.id);
          });
          observer.next(userTeams);
          observer.complete();
        })
        .catch((error: FirebaseError) => {
          observer.error(error); // Handle error
        });
    });
  }

  public loadGames(year: string, team: string): Observable<any[]> {
    return new Observable<any[]>((observer: Observer<any[]>) => {
      const gamesRef = collection(this.db, `years/${year}/teams/${team}/games`);

      getDocs(gamesRef)
        .then((querySnapshot) => {
          const games: any[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            games.push(doc.data());
            console.log(doc.data())
          });
          observer.next(games);
          observer.complete();
        })
        .catch((error: FirebaseError) => {
          observer.error(error); // Handle error
        });
    });
  }
}
