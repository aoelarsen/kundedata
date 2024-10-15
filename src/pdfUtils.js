import jsPDF from 'jspdf';
import 'jspdf-autotable';
import JsBarcode from 'jsbarcode'; // Importer JsBarcode for å generere strekkoder
import logo from './image/logo.png'; // Importer logoen

// Funksjon for å konvertere en EAN-kode til en base64-encoded strekkodebilde
const generateBarcode = (ean) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, ean, { format: 'EAN13', width: 1, height: 40 }); // Juster bredde og høyde her
    return canvas.toDataURL('image/png'); // Returner base64-kodet bilde
};

export const generateServicePDF = async (serviceDetails, customer, formData, calculateTotalPrice) => {
    const doc = new jsPDF('p', 'mm', 'a5'); // A5-format

    // Legg til logoen
    doc.addImage(logo, 'PNG', 10, 10, 30, 15); // Plassering og størrelse

    doc.setFontSize(12);
    doc.text('Butikknavn: Sport1', 10, 30); // Butikknavn

    // Kundeinfo
    if (customer) {
        doc.text(`Kunde: ${customer.firstName} ${customer.lastName}`, 10, 40);
        doc.text(`Telefon: ${customer.phoneNumber}`, 10, 45);
        doc.text(`E-post: ${customer.email}`, 10, 50);
    }

    // Servicedetaljer
    if (serviceDetails) {
        doc.text(`Servicenummer: ${serviceDetails.serviceid}`, 10, 60);
        doc.text(`Utført arbeid:`, 10, 70);

        // Tabell for arbeid
        const arbeidRows = formData.arbeid.map((work) => [work.title, `${work.price} kr`]);
        doc.autoTable({
            head: [['Arbeid', 'Pris']],
            body: arbeidRows,
            startY: 75,
        });

        // Tabell for deler med strekkoder for 13-tegns EAN-koder
        const delerRows = await Promise.all(
            formData.deler.map(async (part) => {
                if (part.ean.length === 13) {
                    const barcodeImage = generateBarcode(part.ean); // Generer strekkodebilde
                    return [
                        part.product,
                        `${part.price} kr`,
                        { image: barcodeImage, fit: [50, 20] } // Juster størrelsen for å passe inn i cellen
                    ];
                } else {
                    return [part.product, `${part.price} kr`, part.ean]; // Legg til EAN som tekst hvis det ikke er 13 tegn
                }
            })
        );

        // Generer deler-tabellen med strekkoder og bakgrunnsfarge
        doc.autoTable({
            head: [['Del', 'Pris', 'EAN/Strekkode']],
            body: delerRows,
            startY: doc.previousAutoTable.finalY + 10, // Plasser under forrige tabell
            didDrawCell: (data) => {
                // Hvis det er en strekkode, tegn bakgrunnsfarge og deretter strekkoden
                if (data.cell.raw && data.cell.raw.image) {
                    doc.setFillColor(240, 240, 240); // Bakgrunnsfarge for cellen
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F'); // Fyll cellen med bakgrunnsfarge
                    doc.addImage(data.cell.raw.image, 'PNG', data.cell.x + 2, data.cell.y + 2, 40, 18); // Legg til strekkoden på riktig posisjon med justert størrelse
                }
            }
        });

        // Totalpriser
        const totalPris = calculateTotalPrice();
        doc.text(`Totalpris: ${totalPris} kr`, 10, doc.previousAutoTable.finalY + 20);
    }

    // Lagre PDF
    doc.save(`servicefaktura_${serviceDetails?.serviceid}.pdf`);
};
