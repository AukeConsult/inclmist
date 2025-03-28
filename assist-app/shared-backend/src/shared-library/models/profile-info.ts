import {QueryDescriptor} from "./query-descriptor";
import {ModelEnum, ProfileUserType, VendorEnum} from "./enum-types";
import {ChatDialog} from "./chat-dialog";

export interface ProfileAdminUser {
    uid: string
    role: ProfileUserType
    name: string
}

// subsribers to the profile
export interface ProfileUser {
    userid: string
    email: string
    phone: string
    name: string
    role: string
    added: Date
    active: boolean
    closed: Date
}

// contain everything regarding Queries
export interface ProfileQueries {
    queries?: QueryDescriptor[]
    queryRefs?: string[]
    activeQueryDescriptor?: QueryDescriptor
}

// ALL subsriptions on the profile
// contain everthing regarding subscriptions
export interface ProfileSubscription {

    // is possible to subscribe
    canSubscr: boolean
    maxSubscriptions: number

    // fee for signon
    signonFee: number

    // month fee for a subsription
    monthlyFee: number

    // invited users
    invites: ProfileUser []
    // requested memberslip from users
    requests: ProfileUser []

    // subsriptioned users
    subscriptions: ProfileUser []

    // payment done to profile (for later)
    paiedInvoices: []

    // iinvoices, not payed
    openInvoices: []

}

export interface ProfileSettings {
    models: { modelVendor: VendorEnum | string, modelId: ModelEnum | string, modelApiKey: string } []
    colorBack?: string
    colorFrame?: string
}

// contain everything regarding Admin users
export interface ProfileAdminUsers {
    canUpdate: boolean
    users: ProfileAdminUser []
}

// all operational data for profile
export interface ProfileWork {

    uid: string
    pid?: string

    // string to make easy to see what it is when list
    nameRef: string

    // list of user subscriptions to profile
    subscriptions?: ProfileSubscription

    // settings for profile
    profileSetting?: ProfileSettings

    // querySpecifications under work
    workQueries?: QueryDescriptor []

    // dialogs from tuning queries
    workDialogs?: ChatDialog []

    // querySpecifications publiched
    publishedQueries?: QueryDescriptor[]

    // list of users that can admin the profile
    adminUsers: ProfileAdminUser []
}

//
// basic profile information
//
export interface Profile {
    pid?: string
    public: boolean
    displayName?: string
    description?: string
    logo?: object
    imageUrl?: string
    longText: string
    homeUrl?: string
    helpUrl?: string
}