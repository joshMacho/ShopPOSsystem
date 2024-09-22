import CryptoJS from "crypto-js";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const apiUrl = "http://localhost:8081/api/bestmarch";

export function formatMoney(amount) {
  let num = parseFloat(amount).toFixed(2);
  let amountString = String(num);
  let [integerPart, decimalPart] = amountString.split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimalPart) {
    amountString = integerPart + "." + decimalPart;
  } else {
    amountString = integerPart;
  }
  return amountString;
}
export const getFetchdate = () => {
  const now = new Date();
  const dotw = now.getDay();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${days[dotw]} ${day} ${months[month]}, ${year} ${(hours % 12)
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};
export const decryptValue = (value) => {
  const bytes = CryptoJS.AES.decrypt(value, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
export const encryptValue = (value) => {
  const val = CryptoJS.AES.encrypt(value, secretKey).toString();
  return val;
};
export const decryptJsonValue = (value) => {
  const bytes = CryptoJS.AES.decrypt(value, secretKey);
  const jsonString = bytes.toString(CryptoJS.enc.Utf8);
  const obj = JSON.parse(jsonString);
  return obj;
};
export const encryptJsonValue = (obj) => {
  const jsonString = JSON.stringify(obj);
  const val = CryptoJS.AES.encrypt(JSON.stringify(obj), secretKey).toString();
  return val;
};
export const secretKey = "AqSDF899Rz";

// generate an id for the receipt
export const generateReceiptID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let results = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  array.forEach((num) => {
    results += characters[num % characters.length];
  });
  return results;
};

// Generate invoice id and number
export const generateINV = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
  let results = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  array.forEach((num) => {
    results += characters[num % characters.length];
  });
  return results;
};
// export const formCurrency = (val) => {
//   const num = parseFloat(val);
//   return num.toFixed(2);
// };
