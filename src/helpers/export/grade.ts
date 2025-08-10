import { StudentWithGrade } from "@/types/export";
import { AssessmentType, Class } from "@prisma/client";
import { getUnixTime } from "date-fns";
import ExcelJS, { Alignment } from "exceljs";

type ExportGradeProps = {
  students: StudentWithGrade[];
  classData: Class;
};

export async function exportGrade({ students, classData }: ExportGradeProps) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Penilaian Siswa", {
    pageSetup: { orientation: "landscape", fitToPage: true },
  });

  if (!worksheet) return;

  const setDates = new Set<{ date: number; type: AssessmentType }>();

  students.forEach((student) => {
    student.grade.forEach((grade) => {
      setDates.add({ date: getUnixTime(grade.date), type: grade.assessmentType });
    });
  });

  const gradeDateAndType: { date: Date; type: AssessmentType }[] = Array.from(setDates)
    .map((data) => ({ date: new Date(data.date * 1000), type: data.type }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const dateColumnsCount = gradeDateAndType.length;
  const totalColumns = 4 + dateColumnsCount + 1;

  const centerAlign = { vertical: "middle", horizontal: "center", wrapText: true } as Alignment;
  const leftAlign = { vertical: "middle", horizontal: "left" } as Alignment;

  worksheet.addRow([]); // Blank row
  worksheet.addRow(["Kelas", `: ${classData.name}`]);
  worksheet.addRow(["Deskripsi", `: ${classData.description}`]);

  worksheet.addRow([]); // Blank row

  worksheet.getCell("A7").value = "NO";
  worksheet.getCell("B7").value = "NIS";
  worksheet.getCell("C7").value = "NAMA";
  worksheet.getCell("D7").value = "L/P";
  worksheet.mergeCells(7, 5, 7, 4 + dateColumnsCount);
  worksheet.getCell(7, 5).value = "TANGGAL";
  // worksheet.mergeCells(7, 5 + dateColumnsCount, 7, 4 + dateColumnsCount + 1);
  worksheet.getCell(7, 5 + dateColumnsCount).value = "AVG";

  const subHeaderValues = ["", "", "", ""];
  subHeaderValues.push(
    ...gradeDateAndType.map(
      (data) =>
        `${Intl.DateTimeFormat("id-ID", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(data.date)} \n ${
          data.type
        }`
    )
  );
  worksheet.addRow(subHeaderValues) as unknown as ExcelJS.Row;

  for (let i = 7; i <= 8; i++) {
    worksheet.getRow(i).font = { size: 11, name: "Roboto", bold: true };
    if (i === 8) {
      worksheet.getRow(i).alignment = { vertical: "middle", horizontal: "center", textRotation: -90, wrapText: true };
      worksheet.getRow(i).height = 110;
    } else {
      worksheet.getRow(i).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    }
    for (let j = 1; j <= totalColumns; j++) {
      worksheet.getCell(i, j).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      worksheet.getCell(i, j).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
    }
  }

  console.log(String.fromCharCode(totalColumns + 64));

  for (let i = 5; i <= totalColumns; i++) {
    worksheet.getColumn(i).width = 8;
  }
  worksheet.getColumn(3).width = 40;
  worksheet.mergeCells("A7:A8");
  worksheet.mergeCells("B7:B8");
  worksheet.mergeCells("C7:C8");
  worksheet.mergeCells("D7:D8");
  // worksheet.mergeCells(`${String.fromCharCode(totalColumns + 64)}7:${String.fromCharCode(totalColumns + 64)}8`);
  console.log(`${String.fromCharCode(totalColumns + 64)}7:${String.fromCharCode(totalColumns + 64)}8`);

  const startLine = 9;
  students.forEach((student, index) => {
    const rowData = [index + 1, student.nis, student.name, student.gender === "MALE" ? "L" : "P"];
    let avg = 0;

    const calcAvg = (grade: number) => {
      avg += grade;
    };

    if (student.grade.length === 0) {
      rowData.push(...Array(gradeDateAndType.length).fill("-"));
    } else if (student.grade.length === gradeDateAndType.length) {
      student.grade.forEach((grade) => {
        rowData.push(grade ? grade.score : "-");
        calcAvg(grade.score);
      });
    } else {
      gradeDateAndType.forEach((data) => {
        const grade = student.grade.find((grade) => grade.date.getTime() === data.date.getTime());
        rowData.push(grade ? grade.score : "-");
        calcAvg(grade?.score || 0);
      });
    }

    rowData.push(avg / gradeDateAndType.length);

    const row = worksheet.addRow(rowData);

    row.alignment = { ...centerAlign, horizontal: "center" };
    for (let i = 1; i <= row.actualCellCount; i++) {
      const cell = row.getCell(i);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
    worksheet.getCell(`C${startLine + index}`).alignment = leftAlign;
  });
  worksheet.mergeCells(`${String.fromCharCode(totalColumns + 64)}7:${String.fromCharCode(totalColumns + 64)}8`);

  return await workbook.xlsx.writeBuffer();
}
