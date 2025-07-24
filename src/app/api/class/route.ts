import { getSession } from "@/helpers/getSession";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const sesion = await getSession();

  try {
    const classes = await prisma.class.findMany({
      where: { userId: sesion.user.id },
      include: { _count: { select: { students: true } } },
    });

    return NextResponse.json({ data: classes, message: "Success get class" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
