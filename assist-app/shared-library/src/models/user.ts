import { User as FirebaseUser } from 'firebase/auth'; // Frontend Firebase User
import { UserRecord } from 'firebase-admin/auth'; // Backend Firebase User

export interface AppUser extends Partial<FirebaseUser> {
    role?: 'admin' | 'user'; // Custom attribute
    createdAt?: Date;
    userRecord: UserRecord;
}
