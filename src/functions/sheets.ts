// import { Handler } from "aws-lambda";
// import { JWT } from "google-auth-library";
// import { GoogleSpreadsheet } from "google-spreadsheet";

// import { keys } from "../google-keys";
// console.log("🚀 ~ file: sheets.ts:6 ~ keys:", keys);

// const sheetId = keys["sheet-id"];

// export const handler: Handler<{ body: string }, any> = async (event) => {
//   const serviceAccountAuth = new JWT({
//     email: keys.client_email,
//     key: keys.private_key,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
//   await doc.loadInfo();

//   const sheet = doc.sheetsByIndex[0];
//   const rows = await sheet.getRows(); // loads document properties and worksheets
//   // console.log(rows);

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: "ok",
//     }),
//   };
// };
