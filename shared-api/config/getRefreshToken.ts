import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../constants';
export const getRefreshToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/refresh-token`,
      null,
      {
        withCredentials: true,
      }
    );
    const accessToken = response.data.accessToken;
    Cookies.set("accessToken", accessToken, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
