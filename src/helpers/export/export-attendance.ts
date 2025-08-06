import { Attendance, Class, Student } from "@prisma/client";
import ExcelJS, { Alignment } from "exceljs";

function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export async function exportAttendance(students: (Student & { attendance: Attendance[] })[], classData: Class) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Daftar Hadir", {
    pageSetup: { orientation: "landscape", fitToPage: true },
  });

  if (!worksheet) return;

  // Get unique attendance dates across all students
  const attendanceDates = Array.from(
    new Set(students.flatMap((student) => student.attendance.map((attendance) => attendance.date.toLocaleDateString())))
  );
  const reportDates = getDatesInRange(
    students[0].attendance[0].date,
    students[0].attendance[students[0].attendance.length - 1].date
  );
  const dateColumnsCount = attendanceDates.length;
  const totalColumns = 4 + dateColumnsCount + 3;

  // === STYLING PRESETS ===

  const centerAlign = { vertical: "middle", horizontal: "center", wrapText: true } as Alignment;
  const leftAlign = { vertical: "middle", horizontal: "left" } as Alignment;

  worksheet.mergeCells(1, 1, 1, totalColumns);
  worksheet.getCell("A1").value = "DAFTAR HADIR SISWA";
  worksheet.getCell("A1").font = { size: 14, bold: true };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  worksheet.mergeCells(2, 1, 2, totalColumns);
  worksheet.getCell("A2").value = "TAHUN PELAJARAN 2024/2025"; // Ganti jika perlu
  worksheet.getCell("A2").font = { bold: true };
  worksheet.getCell("A2").alignment = { horizontal: "center" };

  worksheet.addRow([]); // Blank row
  worksheet.addRow(["Kelas", `: ${classData.name}`]);

  worksheet.addRow([]); // Blank row

  worksheet.mergeCells("A7:A8");
  worksheet.getCell("A7").value = "NO";
  worksheet.mergeCells("B7:B8");
  worksheet.getCell("B7").value = "NIS";
  worksheet.mergeCells("C7:C8");
  worksheet.getCell("C7").value = "NAMA SISWA";
  worksheet.mergeCells("D7:D8");
  worksheet.getCell("D7").value = "L/P";
  worksheet.mergeCells(7, 5, 7, 4 + dateColumnsCount);
  worksheet.getCell(7, 5).value = "TANGGAL";
  worksheet.mergeCells(7, 5 + dateColumnsCount, 7, 4 + dateColumnsCount + 3);
  worksheet.getCell(7, 5 + dateColumnsCount).value = "JUMLAH";

  const subHeaderValues = ["", "", "", ""]; // Kosong untuk kolom A-D
  reportDates.forEach((date) => subHeaderValues.push(date.getDate().toString())); // Tambah hari
  subHeaderValues.push("S", "I", "A");
  worksheet.getRow(8).values = subHeaderValues;

  for (let i = 7; i <= 8; i++) {
    worksheet.getRow(i).font = { bold: true };
    worksheet.getRow(i).alignment = centerAlign;
  }

  // === STUDENT DATA (ROW 9 onwards) ===
  const dailySummary = new Map<string, { SAKIT: number; IZIN: number; ALFA: number }>();

  students.forEach((student, index) => {
    const attendanceMap = new Map(student.attendance.map((att) => [att.date.toISOString().split("T")[0], att.status]));
    const studentSummary = { SAKIT: 0, IZIN: 0, ALFA: 0, HADIR: 0 };
    const rowData = [index + 1, student.nis, student.name, student.gender === "MALE" ? "L" : "P"];

    reportDates.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const status = attendanceMap.get(dateStr);
      let cellValue = "";
      if (status) {
        studentSummary[status]++;
        if (status === "HADIR") cellValue = "✓";
        else cellValue = status.charAt(0);

        // Update ringkasan harian
        if (status !== "HADIR") {
          const daySum = dailySummary.get(dateStr) || { SAKIT: 0, IZIN: 0, ALFA: 0 };
          daySum[status]++;
          dailySummary.set(dateStr, daySum);
        }
      }
      rowData.push(cellValue);
    });

    rowData.push(studentSummary.SAKIT, studentSummary.IZIN, studentSummary.ALFA);
    const dataRow = worksheet.addRow(rowData);
    dataRow.alignment = { ...centerAlign, horizontal: "center" };
    worksheet.getCell(`C${dataRow.number}`).alignment = leftAlign; // Nama siswa rata kiri
  });

  // === FOOTER (JUMLAH & SIGNATURE) ===
  worksheet.addRow([]); // Blank row
  const totalRowData = ["", "", "JUMLAH"];
  worksheet.mergeCells(worksheet.rowCount, 1, worksheet.rowCount, 4);
  worksheet.getRow(worksheet.rowCount).getCell(3).alignment = { ...centerAlign, horizontal: "center" };

  reportDates.forEach((date) => {
    const dateStr = date.toISOString().split("T")[0];
    const daySum = dailySummary.get(dateStr);
    const totalAbsence = daySum ? daySum.SAKIT + daySum.IZIN + daySum.ALFA : 0;
    totalRowData.push(totalAbsence > 0 ? String(totalAbsence) : "");
  });
  worksheet.getRow(worksheet.rowCount).values = totalRowData;
  worksheet.getRow(worksheet.rowCount).font = { bold: true };
  worksheet.getRow(worksheet.rowCount).alignment = centerAlign;

  // Tambahkan baris kosong untuk bagian tanda tangan
  // worksheet.addRows([[], [], []]);

  // let currentRow = worksheet.rowCount;
  // worksheet.getCell(`B${currentRow}`).value = "Orang Tua/Wali";
  // worksheet.getCell(`B${currentRow}`).alignment = centerAlign;
  // worksheet.getCell(currentRow, totalColumns - 2).value = `Wali Kelas,`;
  // worksheet.getCell(currentRow, totalColumns - 2).alignment = centerAlign;

  // worksheet.addRows([[], [], []]);
  // currentRow = worksheet.rowCount;
  // worksheet.getCell(`B${currentRow}`).value = "_________________";
  // worksheet.getCell(`B${currentRow}`).alignment = centerAlign;
  // worksheet.getCell(currentRow, totalColumns - 2).font = { bold: true, underline: true };
  // worksheet.getCell(currentRow, totalColumns - 2).alignment = centerAlign;

  // === FINAL STYLING (BORDERS, SHADING, WIDTH) ===
  // Borders
  for (let i = 7; i <= worksheet.rowCount - 7; i++) {
    for (let j = 1; j <= totalColumns; j++) {
      worksheet.getCell(i, j).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  // Column Widths
  worksheet.getColumn("A").width = 5;
  worksheet.getColumn("B").width = 15;
  worksheet.getColumn("C").width = 35;
  worksheet.getColumn("D").width = 5;

  // Shading for weekends
  reportDates.forEach((date, index) => {
    const colNum = 5 + index;
    worksheet.getColumn(colNum).width = 4;
    const day = date.getDay(); // 0 = Minggu, 6 = Sabtu
    if (day === 0 || day === 6) {
      for (let i = 7; i <= worksheet.rowCount - 7; i++) {
        worksheet.getCell(i, colNum).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD3D3D3" }, // Warna abu-abu
        };
      }
    }
  });

  // worksheet.columns = [
  //   { header: "NIS", key: "nis", width: 12 },
  //   { header: "Nama", key: "name", width: 40 },
  //   { header: "Gender", key: "gender", width: 10 },
  //   ...attendanceDates.map(
  //     (date) =>
  //       ({
  //         header: Intl.DateTimeFormat("id-ID", {
  //           year: "2-digit",
  //           month: "2-digit",
  //           day: "2-digit",
  //         }).format(new Date(date)),
  //         key: date,
  //         width: 5,
  //         alignment: { horizontal: "center", textRotation: "vertical" },
  //       } as Column)
  //   ),
  // ];

  // worksheet.properties.defaultColWidth = 5;

  // students.forEach((student, index) => {
  //   const row = worksheet.getRow(2 + index);

  //   row.getCell(1).value = student.nis;
  //   row.getCell(2).value = student.name;
  //   row.getCell(3).value = student.gender === "MALE" ? "L" : "P";

  //   student.attendance.forEach((attendance, index) => {
  //     const cell = row.getCell(4 + index);
  //     cell.value = attendance.status[0].toUpperCase();
  //     cell.alignment = { vertical: "middle", horizontal: "center" };
  //   });
  // });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
