import { getSession } from "@/helpers/getSession";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  try {
    const { user } = await getSession();
    const classes = await prisma.class.findMany({
      where: {
        userId: user.id,
        id: classId,
      },
    });
    return NextResponse.json({ data: classes, message: "Success get class" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  try {
    const { user } = await getSession();
    await prisma.class.delete({
      where: { id: classId, userId: user.id },
    });

    return NextResponse.json({ message: "Success delete class" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
