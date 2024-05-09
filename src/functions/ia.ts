import vision from "@google-cloud/vision";
import { Handler } from "aws-lambda";
import namer from "color-namer";
import fs from "fs";
import { google } from "googleapis";
import { colorsMap, species, speciesMap } from "../constants";
import { keys } from "../google-keys";

const folderId =
  "1ZW5u13gARB_gSfs9XR1cC_Xfc6Gvzmx98YKNbLS23qY_Ctg9xZubbOfORSb6w52dw95sgzSp";

export const handler: Handler<{ body: string }, any> = async (event) => {
  const filesData: { fileId?: string; fileName?: string }[] = [];

  const authDrive = new google.auth.JWT(
    keys.client_email,
    undefined,
    keys.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );

  const drive = google.drive({ version: "v3", auth: authDrive });

  async function downloadFile(fileId?: string, fileName?: string) {
    const destPath = `aux/${fileName}`;
    const response = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const dest = fs.createWriteStream(destPath);
    response.data
      .on("end", () => {
        console.log("Arquivo baixado com sucesso.", { fileId });
      })
      .on("error", (err) => {
        console.error("Erro ao baixar o arquivo:", err);
      })
      .pipe(dest);

    filesData.push({ fileId: fileId, fileName: fileName });
  }

  async function downloadAllFile() {
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/jpg' or mimeType='image/webp')`, // Adicionando tipos de mime alternativos
        fields: "files(id, name)", // Campos necessários: id e name
      });

      const files = response.data.files;
      console.log("Files length: ", files?.length);

      files &&
        (await Promise.all(
          files?.map((file) => downloadFile(file.id || "", file.name || ""))
        ));
    } catch (err) {
      console.error("Erro ao listar os arquivos:", err);
    }
  }

  await downloadAllFile();

  console.log("Proximo passo:");

  const CONFIG = {
    credentials: {
      private_key: keys.private_key,
      client_email: keys.client_email,
    },
  };

  const clientVision = new vision.v1.ImageAnnotatorClient(CONFIG);

  const detectColors = async (file_path: string) => {
    let [result] = await clientVision.imageProperties(file_path);
    return result.imagePropertiesAnnotation?.dominantColors?.colors?.filter(
      (color) => color.score && color.score > 0.1
    );
  };

  const detectSpecie = async (file_path: string) => {
    let [result] = await clientVision.labelDetection(file_path);
    return result.labelAnnotations
      ?.filter((label) =>
        label.description ? species.includes(label.description) : undefined
      )
      .filter((v) => !!v)
      .find(Boolean);
  };

  const authSheets = new google.auth.JWT(
    keys.client_email,
    undefined,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  // Create Google Sheets API instance
  const sheets = google.sheets({ version: "v4", auth: authSheets });

  const spreadsheetId = "1Hm9b-2wVIFPjOEaI9Y9ULTy6eyxYE2dtvMVgzw_h-ic";

  let responses: any[] = [];
  for await (const fileData of filesData) {
    const color = await detectColors(`aux/${fileData.fileName}`);

    const colors = color?.map(
      (color) =>
        namer(
          `rgba(${[
            color.color?.red,
            color.color?.green,
            color.color?.blue,
            color.color?.alpha || 1,
          ].join(",")})`
        )
          .basic.sort((a, b) => a.distance - b.distance)
          .find(Boolean)?.name
    );

    const specie = await detectSpecie(`aux/${fileData.fileName}`);

    const responseVision = {
      colors: [...new Set(colors)]
        .filter((color) => !!color)
        .map((color) => color && colorsMap[color]),
      specie: specie?.description ? speciesMap[specie.description] : "Outro",
    };

    responses.push(responseVision);

    // const rowData = [
    //   new Date().toISOString(), // Timestamp
    //   responseVision.specie,
    //   "", // Gênero (opcional)
    //   responseVision.colors.join(", "),
    //   "", // Porte (opcional)
    //   "", // Raça (opcional)
    //   "", // Outras características (opcional)
    //   `https://drive.google.com/open?id=${fileData.fileId}`,
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    // ];

    // await sheets.spreadsheets.values.append(
    //   {
    //     spreadsheetId: spreadsheetId,
    //     range: "A1",
    //     valueInputOption: "RAW",
    //     requestBody: {
    //       values: [rowData],
    //     },
    //   },
    //   {
    //     responseType: "json",
    //   }
    // );
  }

  console.log(responses);

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: 1,
    }),
  };
};
