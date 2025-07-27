import { getSession } from "@/helpers/getSession";
import prisma from "@/lib/db";
import { CreateClassSchema } from "@/validation/class.validation";
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

export async function POST(request: Request) {
  const sesion = await getSession();

  try {
    const data: CreateClassSchema = await request.json();
    const classData = await prisma.class.create({
      data: {
        name: data.name,
        description: data.description,
        user: { connect: { id: sesion.user.id } },
      },
    });

    return NextResponse.json({ data: classData, message: "Success create class" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
