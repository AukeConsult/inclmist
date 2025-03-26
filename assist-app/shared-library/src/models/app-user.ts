import {ProfileSubscription} from "./profile-info";
import {QuerySubscription} from "./subscriptions";
import {ChatDialog} from "./chat-dialog";
import {QueryDescriptor} from "./query-descriptor";

export interface AppUserWork {

    role?: 'admin' | 'user' | 'profileOwner'; // Custom attribute
    uid: string;

    // reference for better readabillity
    nameRef: string

    // list of own profiles
    profiles?: {pid: string, active: boolean}[]

    // list of profiles subscription
    profileSubscriptions?: ProfileSubscription []

    // list query subsriptions
    querySubscriptions?: QuerySubscription []

    // dialog history
    dialogs?: ChatDialog []

    // dialog history
    queries?: QueryDescriptor []


}

export interface AppUser {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    password?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    jobTitle?: string;
    birthdate?: Date;
    nationality?: string;
    socialMediaHandles?: {
        facebook?: string;
        twitter?: string;
        linkedIn?: string;
    };
    languagePreferences?: string[];
}

