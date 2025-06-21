import axios from "../lib/axios";

interface LoginUserRequest {
    username: string;
    password: string;
}

interface LoginUserResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        // add other user fields as needed
    };
}

export const loginUser = async (data: LoginUserRequest): Promise<LoginUserResponse> => {
    const res = await axios.post<LoginUserResponse>("/auth/login", data);
    return res.data;
};

export const getUserRecordings = async () => {
  const res = await axios.get("/user/recordings");
  return res.data;
};