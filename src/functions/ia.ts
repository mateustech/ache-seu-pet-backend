import vision from "@google-cloud/vision";
import { Handler } from "aws-lambda";
import namer from "color-namer";
import { google } from "googleapis";
import { keys } from "../google-keys";
const species = ["Cat", "Dog"];

const speciesMap: Record<string, string> = {
  Cat: "Gato",
  Dog: "Cachorro",
};

const colorsMap: Record<string, string> = {
  gray: "Cinza",
  black: "Preto",
  white: "Branco",
  brown: "Marrom",
  tan: "Bege",
  red: "Vermelho",
  orange: "Laranja",
  yellow: "Amarelo",
  green: "Verde",
  blue: "Azul",
  purple: "Roxo",
};

export const handler: Handler<{ body: string }, any> = async (event) => {
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

  const color = await detectColors(
    "https://drive.google.com/open?id=1BZiavDWbhFDYT8WnsYIXIJzk003aKBVS"
  );

  console.log(color);
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

  const specie = await detectSpecie(
    "https://drive.google.com/open?id=1BZiavDWbhFDYT8WnsYIXIJzk003aKBVS"
  );

  console.log(specie);
  const response = {
    colors: [...new Set(colors)]
      .filter((color) => !!color)
      .map((color) => color && colorsMap[color]),
    specie: specie?.description ? speciesMap[specie.description] : "Outro",
  };

  const client = new google.auth.JWT(
    keys.client_email,
    undefined,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  // Authorize client
  await new Promise<void>((resolve, reject) => {
    client.authorize((err) => {
      if (err) {
        console.error("Authorization error:", err);
        reject({ error: "Authorization error" });
      }
      resolve();
    });
  });

  // Create Google Sheets API instance
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1Hm9b-2wVIFPjOEaI9Y9ULTy6eyxYE2dtvMVgzw_h-ic";

  const rowData = [
    new Date().toISOString(), // Timestamp
    response.specie,
    "", // Gênero (opcional)
    response.colors.join(", "),
    "", // Porte (opcional)
    "", // Raça (opcional)
    "", // Outras características (opcional)
    "Foto",
    "",
    "",
    "",
    "",
    "",
  ];

  await sheets.spreadsheets.values.append(
    {
      spreadsheetId: spreadsheetId,
      range: "A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [rowData],
      },
    },
    {
      responseType: "json",
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: 1,
    }),
  };
};
