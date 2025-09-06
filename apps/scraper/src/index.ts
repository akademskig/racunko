import cron from 'node-cron'
import dotenv from 'dotenv'
import { fetchTaxUpdates } from './cron/fetchTaxUpdates'
import { logger } from './utils/logger'

dotenv.config()

// Schedule tax updates every 24 hours
cron.schedule('0 0 * * *', async () => {
    logger.info('Starting scheduled tax update...')
    try {
        await fetchTaxUpdates()
        logger.info('Tax update completed successfully')
    } catch (error) {
        logger.error('Tax update failed:', error)
    }
})

// Run immediately on startup if in development
if (process.env.NODE_ENV === 'development') {
    logger.info('Running tax scraper in development mode...')
    fetchTaxUpdates()
        .then(() => {
            logger.info('Initial tax scrape completed')
        })
        .catch((error) => {
            logger.error('Initial tax scrape failed:', error)
        })
}

logger.info('Tax scraper service started')
logger.info('Scheduled to run daily at midnight')

// Keep the process running
process.on('SIGINT', () => {
    logger.info('Shutting down tax scraper service...')
    process.exit(0)
})
