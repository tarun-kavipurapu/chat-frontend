// helpers.ts
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Replace with your actual secret key

export const setAccessToken = (token: string) => {
  const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  localStorage.setItem("accessToken", encryptedToken);
};

export const getAccessToken = () => {
  const encryptedToken = localStorage.getItem("accessToken");
  if (!encryptedToken) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  const token = bytes.toString(CryptoJS.enc.Utf8);
  return token;
};
export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};

export const userInfoFromStorage = (() => {
  const storedValue = localStorage.getItem("userInfo");
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.error("Error parsing stored userInfo:", e);
      return null;
    }
  }
  return null;
})();
