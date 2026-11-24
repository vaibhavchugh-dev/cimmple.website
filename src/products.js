// Cimmple software products. Facts mirror the publicly listed product information.
// Update here if pricing or features change.
export const products = [
  {
    slug: 'cimmpleflow',
    name: 'CimmpleFlow',
    kicker: 'MACHINE SHOP ERP',
    headline: 'Run your machine shop from one cloud platform.',
    description: 'Cloud ERP for CNC shops, job shops, and precision manufacturers: quoting, purchasing, production, quality, inventory, and accounting in one system.',
    intro: 'CimmpleFlow brings together the work a machine shop depends on, from quoting through production to accounting, so estimators, buyers, the shop floor, and finance work from the same records.',
    price: {amount: 'From $69', unit: 'per user / month', note: 'Billed annually or monthly. All modules included.'},
    who: 'CNC shops, job shops, and precision manufacturers that run quoting, production, and purchasing across spreadsheets and disconnected tools.',
    modules: [
      ['Faster quoting', 'Prepare quotes faster within one system instead of across separate files.'],
      ['Order visibility', 'See where orders stand so customers and the team are working from the same information.'],
      ['Smarter purchasing', 'Manage purchasing alongside production and inventory.'],
      ['Live job tracking', 'Follow jobs as they move through the shop.'],
      ['Quality and traceability', 'Keep quality information connected to the work it relates to.'],
      ['Inventory and BOMs', 'Track inventory and bills of materials as part of the same system.'],
      ['Accounting', 'Keep accounting connected to the operational work behind it.'],
      ['Documents and AI automation', 'Store job documents together and automate routine entry, such as extracting invoice data from PDFs and email.'],
    ],
    included: ['All modules included', 'Unlimited jobs', 'Unlimited customers', 'Unlimited inventory', 'Unlimited BOMs', 'Unlimited work orders'],
    fit: [
      'Shops replacing spreadsheets for quoting and job tracking',
      'Teams that need clear order and job visibility',
      'Businesses moving from legacy manufacturing software to the cloud',
    ],
    faqs: [
      ['How is CimmpleFlow priced?', 'From $69 per user per month, billed annually or monthly, with all modules included. Book a demo for a quote based on your team size.'],
      ['Is every module included?', 'Yes. Pricing is per user, and all modules are included in the plan.'],
      ['Can we talk through our setup first?', 'Yes. Book a conversation and we will review how your quoting, production, and accounting work today before you decide.'],
    ],
  },
  {
    slug: 'cimmplepay',
    name: 'CimmplePay',
    kicker: 'PAYROLL & HR',
    headline: 'Payroll, employee records, and self-service in one place.',
    description: 'Payroll software for growing businesses: calculations, tax estimates, pay stubs, employee self-service, time, leave, and HR workflows.',
    intro: 'CimmplePay helps growing businesses calculate payroll, manage employee records, track time and leave, and prepare payroll for payment, while keeping the banking process you already use.',
    price: {amount: 'From $19', unit: 'per month', note: 'Plus per-employee pricing. Starter, Growth, and Pro plans.'},
    who: 'Growing businesses that want accurate payroll, clear employee records, and self-service without maintaining separate tools for each task.',
    modules: [
      ['Payroll calculations', 'Calculate payroll with tax estimates for each pay run.'],
      ['Pay stubs and exports', 'Produce pay stubs for employees and payroll exports for your records.'],
      ['Employee records and self-service', 'Keep employee records together and give employees access to their own information.'],
      ['Time, leave, and PTO', 'Track time and manage leave (available from the Growth plan).'],
      ['HR workflows and reporting', 'Run common HR workflows and reporting in the same platform as payroll.'],
      ['Payment preparation', 'Prepare payroll for payment while keeping your preferred banking process.'],
    ],
    included: ['Payroll calculations and tax estimates', 'Pay stubs and payroll exports', 'Employee records and self-service', 'Time, leave, and PTO (Growth and above)', 'HR workflows and reporting', 'Transparent per-employee pricing'],
    fit: [
      'Businesses outgrowing manual payroll or spreadsheets',
      'Teams that want employees to access their pay and leave information themselves',
      'Organizations that want HR records and payroll in one system',
    ],
    faqs: [
      ['How is CimmplePay priced?', 'A monthly base price by plan (Starter, Growth, Pro), from $19 per month, plus per-employee pricing. Book a demo for a quote based on your headcount.'],
      ['Which plan includes time and leave?', 'Time, leave, and PTO are available from the Growth plan and above.'],
      ['Do we need to change our bank?', 'CimmplePay prepares payroll for payment while keeping the banking process you already use.'],
    ],
  },
];

export const getProduct = slug => products.find(p => p.slug === slug);
