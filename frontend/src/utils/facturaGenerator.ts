import jsPDF from "jspdf";

const formatCOP = (valor: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

interface Compra {
  id: number;
  items: ItemCarrito[];
  descuentoGlobal: number;
  subtotal: number;
  total: number;
  nota: string;
  fecha: string;
}

export const generarFacturaPDF = (compra: Compra) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // ========== ENCABEZADO ==========
  doc.setFontSize(24);
  doc.setTextColor(25, 118, 210);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURA", margin, yPosition);

  yPosition += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`Número: ${compra.id}`, margin, yPosition);

  yPosition += 4;
  const fecha = new Date(compra.fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const hora = new Date(compra.fecha).toLocaleTimeString("es-CO");
  doc.text(`Fecha: ${fecha} - Hora: ${hora}`, margin, yPosition);

  yPosition += 8;
  doc.setDrawColor(25, 118, 210);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // ========== INFORMACIÓN DE LA EMPRESA ==========
  yPosition += 7;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("PRODUCTOS STORE", margin, yPosition);

  yPosition += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Sistema de Gestión de Inventario", margin, yPosition);

  yPosition += 3;
  doc.text(
    "📧 info@productosstore.com  |  ☎ +57 (1) 1234-5678",
    margin,
    yPosition,
  );

  // ========== DETALLES DE LA FACTURA ==========
  yPosition += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 118, 210);
  doc.text("DETALLES DE LA COMPRA", margin, yPosition);

  yPosition += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Encabezados de tabla con fondo
  doc.setFillColor(25, 118, 210);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");

  const colProducto = margin;
  const colCantidad = 90;
  const colPrecio = 125;
  const colSubtotal = 160;

  doc.rect(colProducto - 1, yPosition - 3, pageWidth - 2 * margin + 2, 5, "F");
  doc.text("PRODUCTO", colProducto, yPosition);
  doc.text("CANTIDAD", colCantidad, yPosition, { align: "center" });
  doc.text("PRECIO UNIT.", colPrecio, yPosition, { align: "center" });
  doc.text("SUBTOTAL", colSubtotal, yPosition, { align: "right" });

  yPosition += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Filas de productos
  compra.items.forEach((item, index) => {
    // Alternancia de colores
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(
        colProducto - 1,
        yPosition - 3,
        pageWidth - 2 * margin + 2,
        5,
        "F",
      );
    }

    // Limitar nombre a 35 caracteres
    const nombreProducto =
      item.nombre.length > 35
        ? item.nombre.substring(0, 32) + "..."
        : item.nombre;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(nombreProducto, colProducto, yPosition);
    doc.text(item.cantidad.toString(), colCantidad, yPosition, {
      align: "center",
    });
    doc.text(formatCOP(item.precio), colPrecio, yPosition, { align: "center" });
    doc.text(formatCOP(item.subtotal), colSubtotal, yPosition, {
      align: "right",
    });

    yPosition += 5;
  });

  // Línea separadora
  yPosition += 2;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(colProducto - 1, yPosition, pageWidth - margin + 1, yPosition);

  // ========== RESUMEN FINANCIERO ==========
  yPosition += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const subtotal = compra.subtotal;
  const descuento = compra.descuentoGlobal;
  const total = compra.total;

  // Subtotal
  doc.setTextColor(80, 80, 80);
  doc.text("Subtotal:", colPrecio, yPosition);
  doc.text(formatCOP(subtotal), colSubtotal, yPosition, { align: "right" });

  // Descuento (si existe)
  if (descuento > 0) {
    yPosition += 4;
    doc.setTextColor(220, 53, 69);
    doc.setFont("helvetica", "bold");
    doc.text("Descuento (-) :", colPrecio, yPosition);
    doc.text(formatCOP(descuento), colSubtotal, yPosition, { align: "right" });
  }

  // Total final
  yPosition += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(25, 118, 210);
  doc.rect(
    colPrecio - 5,
    yPosition - 3.5,
    pageWidth - colPrecio + 5 - margin + 1,
    6,
    "F",
  );
  doc.text("TOTAL:", colPrecio, yPosition);
  doc.text(formatCOP(total), colSubtotal, yPosition, { align: "right" });

  // ========== NOTAS ==========
  if (compra.nota && compra.nota.trim()) {
    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("OBSERVACIONES:", margin, yPosition);

    yPosition += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    const notaLines = doc.splitTextToSize(compra.nota, pageWidth - 2 * margin);
    doc.text(notaLines, margin, yPosition);
  }

  // ========== PIE DE PÁGINA ==========
  yPosition = pageHeight - 12;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 3;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text("Gracias por su compra", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 3;
  doc.text(
    "Factura electrónica generada automáticamente",
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );

  yPosition += 3;
  doc.text(
    `www.productosstore.com | Generado: ${new Date().toLocaleString("es-CO")}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );

  // Descargar PDF
  const nombreArchivo = `Factura_${compra.id}_${fecha.replace(/\//g, "-")}.pdf`;
  doc.save(nombreArchivo);
};
