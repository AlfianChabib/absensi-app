import { CalculatedAttendance } from "@/types/export";

export default function CalculatedAttendancesResult({
  calculatedAttendances,
}: {
  calculatedAttendances: CalculatedAttendance[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {calculatedAttendances.map((attendance) => (
        <div key={attendance.studentId} className="border-2 border-dashed rounded-sm border-primary p-2">
          <div className="flex justify-between">
            <div className="text-sm font-medium">{attendance.name}</div>
            <div className="text-sm font-medium">
              {attendance.calc.HADIR} HADIR, {attendance.calc.ALFA} ALFA, {attendance.calc.IZIN} IZIN,{" "}
              {attendance.calc.SAKIT} SAKIT
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
