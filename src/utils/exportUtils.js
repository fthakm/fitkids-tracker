import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportPDF = (student) => {
  const doc = new jsPDF();
  doc.text(`Laporan Latihan - ${student.name}`, 14, 20);
  doc.text(`Usia: ${student.age}`, 14, 30);
  doc.text(`Badge: ${student.badge || "-"}`, 14, 40);
  const rows = student.results.map(r=>[r.date, r.exercise, r.target, r.value, r.value>=r.target?"✔":"❌"]);
  doc.autoTable({ head:[["Tanggal","Latihan","Target","Hasil","Status"]], body:rows, startY:50 });
  doc.save(`laporan_${student.name}.pdf`);
};

export const exportExcel = (student) => {
  const ws = XLSX.utils.json_to_sheet(student.results);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Latihan");
  XLSX.writeFile(wb, `laporan_${student.name}.xlsx`);
};
