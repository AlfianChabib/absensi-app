import { CalculatedAttendance, StudentWithAttendance } from "@/types/export";

type CalculatedAttendanceProps = {
  students: StudentWithAttendance[];
};

export const calculatedAttendance = ({ students }: CalculatedAttendanceProps): CalculatedAttendance[] => {
  return students.map((student) => {
    const studentCalculated = { HADIR: 0, ALFA: 0, IZIN: 0, SAKIT: 0 };
    studentCalculated.HADIR = student.attendance.filter((attendance) => attendance.status === "HADIR").length;
    studentCalculated.ALFA = student.attendance.filter((attendance) => attendance.status === "ALFA").length;
    studentCalculated.IZIN = student.attendance.filter((attendance) => attendance.status === "IZIN").length;
    studentCalculated.SAKIT = student.attendance.filter((attendance) => attendance.status === "SAKIT").length;
    const studentData = {
      studentId: student.id,
      name: student.name,
      gender: student.gender,
      calc: studentCalculated,
    };

    return studentData;
  });
};
