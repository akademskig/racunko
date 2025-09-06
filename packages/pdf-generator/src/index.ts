import puppeteer from 'puppeteer'
import * as Handlebars from 'handlebars'
import { InvoiceWithRelations } from './types'

export async function generateInvoicePDF(invoice: InvoiceWithRelations): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
        const page = await browser.newPage()

        // Generate HTML from template
        const html = generateInvoiceHTML(invoice)

        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        })

        return Buffer.from(pdfBuffer)
    } finally {
        await browser.close()
    }
}

function generateInvoiceHTML(invoice: InvoiceWithRelations): string {
    const template = `
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Račun {{invoiceNumber}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
        }
        
        .company-info h1 {
            color: #2c3e50;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .company-details {
            color: #666;
            font-size: 14px;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .invoice-number {
            font-size: 18px;
            color: #666;
        }
        
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .bill-to, .invoice-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        
        .section-title {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .items-table th,
        .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .items-table th {
            background: #f8f9fa;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .totals-table {
            width: 300px;
        }
        
        .totals-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #ddd;
        }
        
        .totals-table .total-row {
            font-weight: bold;
            background: #2c3e50;
            color: white;
        }
        
        .notes {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-draft { background: #f39c12; color: white; }
        .status-sent { background: #3498db; color: white; }
        .status-paid { background: #27ae60; color: white; }
        .status-overdue { background: #e74c3c; color: white; }
        .status-cancelled { background: #95a5a6; color: white; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <h1>{{company.name}}</h1>
                <div class="company-details">
                    {{#if company.address}}{{company.address}}<br>{{/if}}
                    {{#if company.city}}{{company.city}}<br>{{/if}}
                    {{#if company.postalCode}}{{company.postalCode}} {{company.country}}{{/if}}
                    {{#if company.email}}<br>Email: {{company.email}}{{/if}}
                    {{#if company.phone}}<br>Tel: {{company.phone}}{{/if}}
                    {{#if company.vatNumber}}<br>OIB: {{company.vatNumber}}{{/if}}
                </div>
            </div>
            <div class="invoice-meta">
                <div class="invoice-title">RAČUN</div>
                <div class="invoice-number">Broj: {{invoiceNumber}}</div>
                <div style="margin-top: 10px;">
                    <span class="status-badge status-{{status}}">{{status}}</span>
                </div>
            </div>
        </div>
        
        <div class="invoice-details">
            <div class="bill-to">
                <div class="section-title">Račun za:</div>
                <strong>{{client.name}}</strong><br>
                {{#if client.address}}{{client.address}}<br>{{/if}}
                {{#if client.city}}{{client.city}}<br>{{/if}}
                {{#if client.postalCode}}{{client.postalCode}} {{client.country}}{{/if}}
                {{#if client.email}}<br>Email: {{client.email}}{{/if}}
                {{#if client.phone}}<br>Tel: {{client.phone}}{{/if}}
                {{#if client.vatNumber}}<br>OIB: {{client.vatNumber}}{{/if}}
            </div>
            <div class="invoice-info">
                <div class="section-title">Detalji računa:</div>
                Datum izdavanja: {{formatDate issueDate}}<br>
                {{#if dueDate}}Datum dospijeća: {{formatDate dueDate}}<br>{{/if}}
                {{#if paymentTerms}}Uvjeti plaćanja: {{paymentTerms}}<br>{{/if}}
                Valuta: {{currency}}
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Opis</th>
                    <th style="text-align: center;">Količina</th>
                    <th style="text-align: right;">Cijena</th>
                    <th style="text-align: right;">PDV %</th>
                    <th style="text-align: right;">Ukupno</th>
                </tr>
            </thead>
            <tbody>
                {{#each items}}
                <tr>
                    <td>{{description}}</td>
                    <td style="text-align: center;">{{quantity}}</td>
                    <td style="text-align: right;">{{formatCurrency unitPrice}} {{../currency}}</td>
                    <td style="text-align: right;">{{vatRate}}%</td>
                    <td style="text-align: right;">{{formatCurrency total}} {{../currency}}</td>
                </tr>
                {{/each}}
            </tbody>
        </table>
        
        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td>Ukupno bez PDV-a:</td>
                    <td style="text-align: right;">{{formatCurrency subtotal}} {{currency}}</td>
                </tr>
                <tr>
                    <td>PDV ({{vatRate}}%):</td>
                    <td style="text-align: right;">{{formatCurrency vatAmount}} {{currency}}</td>
                </tr>
                <tr class="total-row">
                    <td>UKUPNO ZA PLAĆANJE:</td>
                    <td style="text-align: right;">{{formatCurrency total}} {{currency}}</td>
                </tr>
            </table>
        </div>
        
        {{#if notes}}
        <div class="notes">
            <div class="section-title">Napomene:</div>
            {{notes}}
        </div>
        {{/if}}
        
        <div class="footer">
            <p>Hvala vam na povjerenju!</p>
            <p>Generirano pomoću Računko aplikacije</p>
        </div>
    </div>
</body>
</html>
  `

    // Register Handlebars helpers
    Handlebars.registerHelper('formatDate', (date: Date) => {
        return new Date(date).toLocaleDateString('hr-HR')
    })

    Handlebars.registerHelper('formatCurrency', (amount: number) => {
        return new Intl.NumberFormat('hr-HR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount)
    })

    const compiledTemplate = Handlebars.compile(template)
    return compiledTemplate(invoice)
}
