import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateQuotePDF = ({
  quoteId = "EST-" + Math.floor(100000 + Math.random() * 900000),
  fullName,
  phone,
  email,
  productName,
  quantity,
  deliverySite,
  notes,
  unitPrice = 9.5, // fallback or dynamic rate
}) => {
  const doc = new jsPDF();
  const numericQty = Number(quantity) || 10000;
  const subtotal = numericQty * unitPrice;
  const gstRate = 0.05; // 5% GST on building bricks
  const tax = subtotal * gstRate;
  const estimatedTotal = subtotal + tax;

  // Header / Branding
  doc.setFillColor(74, 44, 35); // #4A2C23
  doc.rect(0, 0, 210, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("BRICKWORKS INDUSTRIAL", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(230, 230, 230);
  doc.text("Heavy Masonry & Certified Kiln Fired Building Solutions", 14, 25);

  // Document Type & Reference
  doc.setTextColor(74, 44, 35);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("COMMERCIAL PROFORMA ESTIMATE", 14, 44);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Reference No: #${quoteId.slice ? quoteId.slice(-8).toUpperCase() : quoteId}`, 14, 50);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 14, 55);
  doc.text("Validity: 15 Calendar Days", 14, 60);

  // Client Details Box
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 249, 246);
  doc.roundedRect(14, 66, 182, 30, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 44, 35);
  doc.setFontSize(10);
  doc.text("DELIVERY & CLIENT SPECIFICATIONS:", 20, 74);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.text(`Client Name: ${fullName || "Valued Customer"}`, 20, 81);
  doc.text(`Contact: ${phone || "N/A"} | Email: ${email || "N/A"}`, 20, 86);
  doc.text(`Site Destination: ${deliverySite || "Standard Factory Ex-Works"}`, 20, 91);

  // Table of Materials
  autoTable(doc, {
    startY: 104,
    head: [["Item Description", "Specifications", "Quantity", "Indicative Rate", "Total (INR)"]],
    body: [
      [
        productName || "Standard Modular Red Clay Bricks",
        "IS 1077 Compliant / Compressive tested",
        `${numericQty.toLocaleString()} Units`,
        `Rs. ${unitPrice.toFixed(2)}`,
        `Rs. ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      ],
      [
        "Transit Breakage Allowance & Staging",
        "Standard batch handling allowance (up to 3%)",
        "Included",
        "--",
        "Included",
      ],
      [
        "Quality & Batch Test Certificate",
        "Third-party compressive & water absorption report",
        "1 Set",
        "Complimentary",
        "Rs. 0.00",
      ],
    ],
    headStyles: {
      fillColor: [166, 61, 47], // #A63D2F
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 5,
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Financial Breakdown Summary
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Material Subtotal:", 130, finalY);
  doc.text(`Rs. ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 196, finalY, { align: "right" });

  doc.text("Estimated GST (5%):", 130, finalY + 6);
  doc.text(`Rs. ${tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 196, finalY + 6, { align: "right" });

  doc.setDrawColor(166, 61, 47);
  doc.line(130, finalY + 9, 196, finalY + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(166, 61, 47);
  doc.text("Estimated Total:", 130, finalY + 16);
  doc.text(`Rs. ${estimatedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 196, finalY + 16, { align: "right" });

  // Notes & Commercial Terms
  const termsY = Math.max(finalY + 28, 190);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(74, 44, 35);
  doc.text("Commercial Terms & Dispatch Notes:", 14, termsY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);

  const notesText = notes ? `Customer Notes: "${notes}"` : "";
  const standardTerms = [
    notesText,
    "1. Freight & Offloading: Final freight charges depend on access route restrictions and direct truck placement.",
    "2. Quality Assurance: Batch compressive test records are supplied upon vehicle dispatch.",
    "3. Terms: This document is an estimate proforma, not a final tax invoice. Official invoice is raised on dispatch.",
  ].filter(Boolean);

  let curY = termsY + 6;
  standardTerms.forEach((line) => {
    doc.text(line, 14, curY);
    curY += 5;
  });

  // Footer Signature Block
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 272, 196, 272);

  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("Brickworks Manufacturing Plant | Dispatch & Logistics Office | Contact: dispatch@brickworks.com", 14, 278);
  doc.text("Page 1 of 1", 196, 278, { align: "right" });

  // Save the PDF
  const filename = `Brickworks_Estimate_${fullName ? fullName.replace(/\s+/g, "_") : "Lead"}.pdf`;
  doc.save(filename);
};