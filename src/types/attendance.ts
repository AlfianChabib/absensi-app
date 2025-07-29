export type AttendanceResult = {
  className: string;
  classId: string;
  date: string;
  calc: {
    hadir: number;
    sakit: number;
    izin: number;
    alfa: number;
  };
};
