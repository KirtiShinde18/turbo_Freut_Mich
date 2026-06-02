
// ====================================== LOGIN ====================================== 
// 🌸 Request type for login
export type LOGIN_REQUEST = {
    email : string,
    password : string,
}

// 👑 Response type for login
export type LOGIN_RESPONSE = {
    message: string,
    result?: {
        id: number,
        name: string,
        mobile: string,
        email: string,
        role: string
    }
}

// ====================================== LOGOUT ====================================== 
// 🌸 Request type for logout
export type LOGOUT_REQUEST = void

// 👑 Response type for logout
export type LOGOUT_RESPONSE = { message: string }


// ====================================== REGISTER ====================================== 
export interface REGISTER_CUSTOMER_REQUEST {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface REGISTER_CUSTOMER_RESPONSE {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    role: string;
  };
}

// ====================================== ME ======================================
// 🌸 Response for GET /api/auth/me
export type ME_RESPONSE = {
    id: number
    name: string
    email: string
    role: string
}