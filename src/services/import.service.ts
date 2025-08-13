export class ImportService {
  static async import({ file, className, description }: { file: File; className: string; description: string }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("className", className);
    formData.append("description", description);

    const response = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to import file");
    }
    const data = await response.json();
    return data;
  }
}
