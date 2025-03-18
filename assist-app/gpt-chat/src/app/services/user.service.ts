import { Injectable } from '@angular/core';
import {Auth, updateEmail, updatePassword, updateProfile, User} from '@angular/fire/auth';
import {Firestore, setDoc, doc, getDoc} from '@angular/fire/firestore';
import { AppUser } from 'shared-library';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async updateUserInfo(uid: string, userData: AppUser): Promise<void> {
    const user = await this.auth.currentUser;
    if (!user) throw new Error("No user logged in");

    // Update Firebase Auth properties
    if (userData.email && user.email !== userData.email) {
      await updateEmail(user, userData.email);
    }
    if (userData.displayName) {
      await updateProfile(user, { displayName: userData.displayName });
    }
    if (userData.password) {
      await updatePassword(user, userData.password);
    }

    // Update Firestore with custom attributes
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      ...userData, // spread the userData to include custom attributes
    }, { merge: true });

    console.log('User info updated successfully');
  }

  async getUserDetails(uid: string): Promise<AppUser | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as AppUser; // Ensure the data structure matches your AppUser model
    } else {
      console.warn('No user details found for UID:', uid);
      return null;
    }
  }

}
