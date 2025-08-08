import { Attendance, Class, Student } from "@prisma/client";
import { getUnixTime } from "date-fns";
import ExcelJS, { Alignment } from "exceljs";

type StudentWithAttendance = Student & { attendance: Attendance[] };

type ExportAttendanceProps = {
  students: StudentWithAttendance[];
  classData: Class;
};

export async function exportAttendance2({ students, classData }: ExportAttendanceProps) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Absensi Siswa", {
    pageSetup: { orientation: "landscape", fitToPage: true },
  });

  if (!worksheet) return;

  const setDates = new Set<number>();

  students.forEach((student) => {
    student.attendance.forEach((attendance) => {
      setDates.add(getUnixTime(attendance.date));
    });
  });

  const attendanceDates = Array.from(setDates)
    .map((date) => new Date(date * 1000))
    .sort((a, b) => a.getTime() - b.getTime());

  console.log(attendanceDates);

  const dateColumnsCount = attendanceDates.length;
  const totalColumns = 4 + dateColumnsCount + 4;

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
  worksheet.mergeCells(7, 5 + dateColumnsCount, 7, 4 + dateColumnsCount + 4);
  worksheet.getCell(7, 5 + dateColumnsCount).value = "JUMLAH";

  const subHeaderValues = ["", "", "", ""];
  subHeaderValues.push(
    ...attendanceDates.map((date) =>
      Intl.DateTimeFormat("id-ID", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(date)
    ),
    "HADIR",
    "ALFA",
    "IZIN",
    "SAKIT"
  );
  worksheet.addRow(subHeaderValues) as unknown as ExcelJS.Row;

  for (let i = 7; i <= 8; i++) {
    worksheet.getRow(i).font = { size: 11, name: "Roboto", bold: true };
    if (i === 8) {
      worksheet.getRow(i).alignment = { vertical: "middle", horizontal: "center", textRotation: -90 };
      worksheet.getRow(i).height = 55;
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

  for (let i = 5; i <= totalColumns; i++) {
    worksheet.getColumn(i).width = 5;
  }
  worksheet.getColumn(3).width = 40;
  worksheet.mergeCells("A7:A8");
  worksheet.mergeCells("B7:B8");
  worksheet.mergeCells("C7:C8");
  worksheet.mergeCells("D7:D8");

  const startLine = 9;
  students.forEach((student, index) => {
    const rowData = [index + 1, student.nis, student.name, student.gender === "MALE" ? "L" : "P"];
    const studentSummary = { HADIR: 0, ALFA: 0, IZIN: 0, SAKIT: 0 };

    const calcSummary = (status: string) => {
      switch (status[0]) {
        case "S":
          studentSummary.SAKIT++;
          break;
        case "I":
          studentSummary.IZIN++;
          break;
        case "A":
          studentSummary.ALFA++;
          break;
        case "H":
          studentSummary.HADIR++;
          break;
      }
    };

    if (student.attendance.length === 0) {
      rowData.push(...Array(attendanceDates.length).fill("-"));
    } else if (student.attendance.length === attendanceDates.length) {
      student.attendance.forEach((attendance) => {
        rowData.push(attendance ? attendance.status[0].toUpperCase() : "-");
        calcSummary(attendance?.status);
      });
    } else {
      attendanceDates.forEach((date) => {
        const attendance = student.attendance.find((attendance) => attendance.date.getTime() === date.getTime());
        rowData.push(attendance ? attendance.status[0].toUpperCase() : "-");
        calcSummary(attendance?.status || "-");
      });
    }

    rowData.push(studentSummary.HADIR, studentSummary.ALFA, studentSummary.IZIN, studentSummary.SAKIT);

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

  return await workbook.xlsx.writeBuffer();
}
