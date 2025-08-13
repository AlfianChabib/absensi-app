import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseCsv } from "@/helpers/csv/parser";
import prisma from "@/lib/db";
import { getSession } from "@/helpers/getSession";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const className = formData.get("className") as string;
  const description = formData.get("description") as string;

  try {
    const { user } = await getSession();
    if (file) {
      const buffer = await file.arrayBuffer();
      const filePath = path.join(process.cwd(), "public", "imports", file.name);
      fs.writeFileSync(path.join(filePath), Buffer.from(buffer));

      const results = await parseCsv(filePath);
      if (results.length === 0) throw new Error("Invalid CSV file");

      const existClass = await prisma.class.findFirst({
        where: { name: { mode: "insensitive", equals: className }, userId: user.id },
      });

      if (existClass) {
        await prisma.class.update({
          where: { id: existClass.id },
          data: {
            description,
            students: {
              createMany: {
                data: results.map((result) => ({
                  name: result.nama,
                  gender: result.gender === "L" ? "MALE" : "FEMALE",
                  nis: result.nis,
                })),
                skipDuplicates: true,
              },
            },
          },
        });
      } else {
        await prisma.class.create({
          data: {
            name: className,
            description,
            userId: user.id,
            students: {
              createMany: {
                data: results.map((result) => ({
                  name: result.nama,
                  gender: result.gender === "L" ? "MALE" : "FEMALE",
                  nis: result.nis,
                })),
                skipDuplicates: true,
              },
            },
          },
        });
      }

      return NextResponse.json({ message: `Kelas ${className} berhasil diimport` }, { status: 200 });
    }

    return NextResponse.json({ message: "Please upload a file" }, { status: 400 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
