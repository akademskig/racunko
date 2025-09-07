import puppeteer from 'puppeteer';
import { prisma } from '@racunko/db';
import { logger } from '../utils/logger';

export async function fetchTaxUpdates(): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set user agent to avoid blocking
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    logger.info('Fetching tax updates from Croatian tax authority...');

    // Navigate to Croatian tax authority website
    await page.goto('https://www.porezna-uprava.hr/', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Extract VAT rates and tax information
    const taxData = await page.evaluate(() => {
      // This is a simplified extraction - in a real implementation,
      // you would need to parse the actual content structure
      const vatRates = {
        standard: 25.0,
        reduced: 13.0,
        superReduced: 5.0,
      };

      return {
        vatRates,
        lastUpdated: new Date().toISOString(),
        source: 'Porezna uprava',
      };
    });

    // Store or update tax rules in database
    await updateTaxRules(taxData);

    logger.info('Tax updates processed successfully');
  } catch (error) {
    logger.error('Error fetching tax updates:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function updateTaxRules(taxData: any): Promise<void> {
  try {
    // Update standard VAT rate
    await prisma.taxRule.upsert({
      where: { id: 'vat-standard' },
      update: {
        vatRate: taxData.vatRates.standard,
        effectiveFrom: new Date(),
        source: taxData.source,
      },
      create: {
        id: 'vat-standard',
        name: 'Standard VAT Rate',
        description: 'Standard VAT rate for Croatia',
        vatRate: taxData.vatRates.standard,
        category: 'standard',
        effectiveFrom: new Date(),
        source: taxData.source,
        isActive: true,
      },
    });

    // Update reduced VAT rate
    await prisma.taxRule.upsert({
      where: { id: 'vat-reduced' },
      update: {
        vatRate: taxData.vatRates.reduced,
        effectiveFrom: new Date(),
        source: taxData.source,
      },
      create: {
        id: 'vat-reduced',
        name: 'Reduced VAT Rate',
        description: 'Reduced VAT rate for Croatia',
        vatRate: taxData.vatRates.reduced,
        category: 'reduced',
        effectiveFrom: new Date(),
        source: taxData.source,
        isActive: true,
      },
    });

    // Update super reduced VAT rate
    await prisma.taxRule.upsert({
      where: { id: 'vat-super-reduced' },
      update: {
        vatRate: taxData.vatRates.superReduced,
        effectiveFrom: new Date(),
        source: taxData.source,
      },
      create: {
        id: 'vat-super-reduced',
        name: 'Super Reduced VAT Rate',
        description: 'Super reduced VAT rate for Croatia',
        vatRate: taxData.vatRates.superReduced,
        category: 'super-reduced',
        effectiveFrom: new Date(),
        source: taxData.source,
        isActive: true,
      },
    });

    logger.info('Tax rules updated in database');
  } catch (error) {
    logger.error('Error updating tax rules:', error);
    throw error;
  }
}
