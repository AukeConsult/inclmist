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
