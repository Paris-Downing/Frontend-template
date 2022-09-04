import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false;

  constructor(public firebaseAuth : AngularFireAuth) { }

  async signin (email: string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(res=>{
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
        // console.log('email', email)
        // console.log('password', password)
      })
      //reroute to tree component
  }

  async signup (email: string, password: string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem('user',JSON.stringify(res.user));
        // console.log('email', email)
        // console.log('password', password)
      })

      //reroute to tree component
  }

  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    //reroute to login page
  }
}
