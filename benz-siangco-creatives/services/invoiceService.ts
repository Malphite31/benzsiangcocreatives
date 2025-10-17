import { Client, Project } from '../types';

export const generateInvoiceHtmlClientSide = (project: Project, client: Client): string => {
  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(issueDate.getDate() + 15);
  const invoiceNumber = Math.floor(100000 + Math.random() * 900000);

  const formatDate = (date: Date) => date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Embedded SVG for QR Code placeholder
  const qrCodeSvg = `
    <svg width="100" height="100" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" fill="#374151">
      <path d="M0 0h15v15H0V0zm3 3v9h9V3H3z"/>
      <path d="M30 0h15v15H30V0zm3 3v9h9V3h-9z"/>
      <path d="M0 30h15v15H0V30zm3 3v9h9v-9H3z"/>
      <path d="M21 0h3v3h-3zM18 3h3v3h-3zM24 3h3v3h-3zM27 6h3v3h-3zM33 18h3v3h-3zM21 21h3v3h-3zM18 24h3v3h-3zM24 24h3v3h-3zM21 27h3v3h-3zM30 27h3v3h-3zM33 30h3v3h-3zM21 33h3v3h-3zM24 36h3v3h-3zM27 39h3v3h-3zM39 21h3v3h-3z"/>
    </svg>
  `;


  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${invoiceNumber}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            color: #374151;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .invoice-wrapper {
            max-width: 800px;
            margin: 2rem auto;
            padding: 3rem;
            background-color: #ffffff;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-radius: 0.5rem;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .company-info .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 0.5rem;
        }
        .company-info p {
            margin: 0;
            font-size: 0.875rem;
            line-height: 1.5;
            color: #6b7280;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-details h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #3b82f6;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.05em;
        }
        .invoice-details p {
            margin: 2px 0;
            font-size: 0.875rem;
        }
        .billing-section {
            display: flex;
            justify-content: space-between;
            margin: 2rem 0;
        }
        .billing-section h3 {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            margin: 0 0 0.5rem 0;
        }
        .billing-section p {
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.6;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
        }
        .invoice-table thead {
            background-color: #3b82f6;
            color: #ffffff;
        }
        .invoice-table th {
            padding: 0.75rem 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
        }
        .invoice-table td {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .invoice-table .item-description {
            font-size: 0.875rem;
            color: #6b7280;
            max-width: 400px;
        }
        .align-right { text-align: right; }
        .summary-section {
            display: flex;
            justify-content: flex-end;
        }
        .summary-table {
            width: 100%;
            max-width: 300px;
        }
        .summary-table td {
            padding: 0.75rem 0;
            font-size: 0.9rem;
        }
        .summary-table .label {
            color: #6b7280;
        }
        .summary-table .grand-total {
            border-top: 2px solid #111827;
        }
        .summary-table .grand-total .label,
        .summary-table .grand-total .value {
            font-size: 1.25rem;
            font-weight: bold;
            color: #111827;
        }
        .summary-table .grand-total .value {
            color: #3b82f6;
        }
        .portfolio-section {
            margin-top: 3rem;
            padding: 1.5rem;
            text-align: center;
            border: 1px dashed #d1d5db;
            border-radius: 0.5rem;
            background-color: #f9fafb;
        }
        .portfolio-section h3 {
            font-size: 1.1rem;
            margin: 0 0 1rem 0;
        }
        .portfolio-section .qr-code {
            margin-bottom: 1rem;
        }
        .portfolio-section a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
        }
        .portfolio-section a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 0.8rem;
            color: #6b7280;
        }
        .footer p { margin: 0.25rem 0; }

        @media print {
            body { background-color: #ffffff; }
            .invoice-wrapper { margin: 0; padding: 0; box-shadow: none; border-radius: 0; }
        }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <header class="header">
            <div class="company-info">
                <div class="logo">Benz Siangco Creatives</div>
                <p>123 Creative Lane, Design City, DC 54321</p>
                <p>contact@benzsiangco.com</p>
            </div>
            <div class="invoice-details">
                <h1>INVOICE</h1>
                <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                <p><strong>Date of Issue:</strong> ${formatDate(issueDate)}</p>
            </div>
        </header>
        <section class="billing-section">
            <div class="billed-to">
                <h3>Billed To</h3>
                <p><strong>${client.name}</strong></p>
                <p>${client.contact}</p>
            </div>
            <div class="invoice-info" style="text-align: right;">
                 <h3>Payment Details</h3>
                 <p><strong>Due Date:</strong> ${formatDate(dueDate)}</p>
                 <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">Unpaid</span></p>
            </div>
        </section>
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th class="align-right">Rate</th>
                    <th class="align-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>${project.name}</strong>
                        <p class="item-description">${project.description}</p>
                    </td>
                    <td class="align-right">$${project.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td class="align-right">$${project.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
            </tbody>
        </table>
        <section class="summary-section">
            <table class="summary-table">
                <tr>
                    <td class="label">Subtotal</td>
                    <td class="align-right value">$${project.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <td class="label">Tax (0%)</td>
                    <td class="align-right value">$0.00</td>
                </tr>
                <tr class="grand-total">
                    <td class="label">Total Due</td>
                    <td class="align-right value">$${project.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
            </table>
        </section>
        
        <section class="portfolio-section">
            <h3>Explore My Portfolio</h3>
            <div class="qr-code">
                ${qrCodeSvg}
            </div>
            <p>Scan the code or visit <a href="https://portfolio.example.com" target="_blank">portfolio.example.com</a> to see more of my work.</p>
        </section>

        <footer class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>Payment is appreciated within 15 days. Please contact me for payment details.</p>
        </footer>
    </div>
</body>
</html>
`;
};
