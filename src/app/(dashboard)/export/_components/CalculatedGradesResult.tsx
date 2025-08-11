import { CalculatedGrade } from "@/types/export";

export default function CalculatedGradesResult({ calculatedGrades }: { calculatedGrades: CalculatedGrade[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {calculatedGrades.map((grade) => (
        <div key={grade.studentId} className="border-2 border-dashed border-primary rounded-sm p-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">{grade.name}</p>
            <p className="text-sm font-medium">Rata-rata : {grade.avg}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
