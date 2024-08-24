type registerErrorType = {
    ward_id?:number;
    email?:string;
    username?:string;
    password?:string;
    password_confirmation?: string;
};

type loginErrorType = {
    email?:string;
    password?:string;
};

type adminloginErrorType = {
    user_id?:number;
    ward_id?:number;
    role?:string;
}