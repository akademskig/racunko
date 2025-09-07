// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    actions: 'Actions',
  },
  navigation: {
    dashboard: 'Dashboard',
    invoices: 'Invoices',
    clients: 'Clients',
    settings: 'Settings',
    newInvoice: 'New Invoice',
  },
  invoices: {
    title: 'Invoices',
    subtitle: 'Manage your invoices and track payments',
    noInvoices: 'No invoices yet',
    noInvoicesDescription: 'Create your first invoice to get started',
    invoiceNumber: 'Invoice',
    client: 'Client',
    issueDate: 'Issue Date',
    status: 'Status',
    total: 'Total',
    downloadPDF: 'Download PDF',
    deleteConfirm: 'Are you sure you want to delete this invoice?',
    statuses: {
      DRAFT: 'Draft',
      SENT: 'Sent',
      PAID: 'Paid',
      OVERDUE: 'Overdue',
      CANCELLED: 'Cancelled',
    },
  },
  theme: {
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
  },
  notifications: {
    invoiceDeleted: 'Invoice deleted successfully',
    invoiceDeleteError: 'Failed to delete invoice',
    pdfDownloaded: 'PDF downloaded successfully',
    pdfDownloadError: 'Failed to generate PDF',
    invoicesLoadError: 'Failed to load invoices. Please check if the API server is running.',
  },
  landing: {
    header: {
      getStarted: 'Get Started',
    },
    hero: {
      badge: 'Smart Invoice Management',
      title: 'Streamline Your Business with Intelligent Invoicing',
      subtitle:
        'Create, manage, and track invoices with automatic VAT calculations and real-time tax regulation updates from Croatian tax authorities.',
      cta: 'Start Managing Invoices',
      demo: 'Watch Demo',
      demoTitle: 'Invoice Preview',
      demoDescription: 'Professional invoices with automatic calculations and compliance checking.',
    },
    stats: {
      invoices: 'Invoices Processed',
      clients: 'Happy Clients',
      uptime: 'Uptime',
      support: 'Support',
    },
    features: {
      title: 'Powerful Features',
      subtitle: 'Everything you need to manage your business finances efficiently',
      invoicing: {
        title: 'Smart Invoicing',
        description:
          'Create professional invoices with automatic VAT calculations and compliance checking.',
      },
      automation: {
        title: 'Automation',
        description: 'Automate recurring invoices, payment reminders, and tax calculations.',
      },
      security: {
        title: 'Bank-Level Security',
        description: 'Your data is protected with enterprise-grade security and encryption.',
      },
      cloud: {
        title: 'Cloud-Based',
        description: 'Access your invoices anywhere, anytime with our secure cloud platform.',
      },
    },
    testimonials: {
      title: 'What Our Customers Say',
      subtitle: 'Join thousands of satisfied businesses using Racunko',
      user1: {
        name: 'Marko Petrović',
        role: 'CEO, TechStart Croatia',
        content:
          'Racunko has revolutionized our invoicing process. The automatic tax calculations save us hours every week.',
      },
      user2: {
        name: 'Ana Novak',
        role: 'Freelance Designer',
        content:
          'Finally, an invoicing solution that understands Croatian tax regulations. Highly recommended!',
      },
    },
    cta: {
      title: 'Ready to Transform Your Invoicing?',
      subtitle:
        'Join thousands of businesses already using Racunko to streamline their operations.',
      button: 'Start Free Trial',
    },
    footer: {
      rights: 'All rights reserved.',
    },
  },
};

export default enTranslations;
