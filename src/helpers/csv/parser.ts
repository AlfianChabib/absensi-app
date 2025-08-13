import csvParser, { Options } from "csv-parser";
import fs from "node:fs";

export const parseCsvOptions: Options = {
  headers: ["nis", "nama", "gender"],
  skipLines: 5,
};

export const parseCsv = async (filePath: string) => {
  const results = [] as { nis: string; nama: string; gender: string }[];
  await new Promise((resolve, reject) => {
    const parser = csvParser(parseCsvOptions);
    const stream = fs.createReadStream(filePath);
    stream.on("error", reject);
    stream.pipe(parser);

    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        results.push(record);
      }
    });

    parser.on("error", reject);
    parser.on("finish", resolve);
  });
  fs.unlinkSync(filePath);
  return results;
};
