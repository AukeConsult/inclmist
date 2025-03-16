import { User as FirebaseUser } from 'firebase/auth'; // Frontend Firebase User
import { UserRecord } from 'firebase-admin/auth';
import {Profile, ProfileSubscription} from "./profile-info";
import {QuerySubscription} from "./subscriptions";
import {ChatDialog} from "./chat-dialog";

export interface AppUser {
    role?: 'admin' | 'user' | 'profileOwner'; // Custom attribute
    userId: string
    displayName: string
    email: string
    info?: string
    photoUrl?: string
    image?: any
    profiles?: Profile[]
    profileSubscriptions?: ProfileSubscription []
    querySubscriptions?: QuerySubscription []
    dialogs?: ChatDialog []
    firebaseUser?: FirebaseUser
    userRecord?: UserRecord
    createdAt?: Date
}
