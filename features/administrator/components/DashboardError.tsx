import { AlertTriangle } from "lucide-react";

export const ErrorDisplay = ({ message = "Gagal memuat data dashboard." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center text-destructive">
      <AlertTriangle className="w-16 h-16 mb-4" />
      <h2 className="text-2xl font-semibold text-foreground">Terjadi Kesalahan</h2>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};