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
  doc,
  getDoc,
  DocumentSnapshot,
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

  public loadTeamsDesigns(): Observable<any[]> {
    return new Observable<any[]>((observer: Observer<any[]>) => {
      const teamsRef = collection(this.db, `teams`);

      getDocs(teamsRef)
        .then((querySnapshot) => {
          const userTeams: any[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const teamData = doc.data();
            userTeams.push({ id: doc.id, data: teamData });
          });
          observer.next(userTeams);
          observer.complete();
        })
        .catch((error: FirebaseError) => {
          observer.error(error); // Handle error
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
          });
          observer.next(games);
          observer.complete();
        })
        .catch((error: FirebaseError) => {
          observer.error(error); // Handle error
        });
    });
  }

  public loadGameMeta(game_id: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>) => {
      const gameDocRef = doc(this.db, 'games', game_id);

      getDoc(gameDocRef)
        .then((docSnapshot: DocumentSnapshot<any>) => {
          if (docSnapshot.exists()) {
            const gameData = docSnapshot.data();
            observer.next(gameData);
          } else {
            observer.next(null); // Document does not exist
          }
          observer.complete();
        })
        .catch((error: FirebaseError) => {
          observer.error(error); // Handle error
        });
    });
  }

  public loadPlayData(game_id: string): Observable<any[]> {
    return new Observable<any[]>((observer: Observer<any[]>) => {
      const gamesRef = collection(this.db, `games/${game_id}/scoring_plays`);

      getDocs(gamesRef)
        .then((querySnapshot) => {
          const games: any[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            games.push({ id: doc.id, ...doc.data() });
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
