export interface UserFields {
    username: string;
    password: string;
    role: string;
    token: string;
    displayName?: string;
    googleID?: string;
    avatar?: string | null;
}