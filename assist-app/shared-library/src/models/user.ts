export interface AppUser {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    address?: string;
    photoURL?:any,
    password?: string;
}