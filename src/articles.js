// Each section is [heading, blocks]; a block is a paragraph string or {list:[...]}.
export const articles = [
{
slug:'planning-a-legacy-modernization',
name:'A practical starting point for legacy modernization',
intro:'Before replacing a business application, understand the workflows and dependencies it supports. A bounded first step is safer, cheaper, and easier to prove than a full rewrite.',
sections:[
['Why “replace everything” usually stalls',[
'Most established businesses run on at least one system that everyone complains about and nobody wants to touch. It might be an on-premise ERP, a heavily customized Access database, or a web application that has been extended by several developers over a decade. The natural instinct is to replace it in one go.',
'Full replacements tend to stall for the same reasons. The old system does more than anyone has written down. The new system has to match years of accumulated behavior before it can go live. Meanwhile, the business keeps changing, so the target keeps moving. The result is a long project with a single, high-risk cutover at the end.',
'A more reliable approach treats modernization as a series of smaller, verifiable moves. Each move improves one part of the system, keeps the business running, and teaches you something about the next step.'
]],
['Map the working system',[
'Start by describing what the system actually does today, not what its original specification said. Talk to the people who use it every day, and look at the data and integrations, not only the screens.',
{list:[
'Business-critical workflows: quoting, order entry, purchasing, invoicing, and month-end tasks.',
'Integrations: every file export, API call, email, and scheduled job that moves data in or out.',
'Data ownership: which system is the source of truth for customers, items, prices, and stock.',
'Reports and spreadsheets that depend on the system, including the ones people maintain on the side.',
'Users and permissions: who can approve, override, or delete, and why.'
]},
'This map does not need to be perfect. It needs to be good enough to show where the dependencies are, so you can choose a first step that will not break something unexpected.'
]],
['Look for the hidden behavior',[
'Legacy systems often contain rules nobody remembers adding: a discount applied for a specific customer group, a field that triggers a nightly email, a status that hides an order from a report. Users rely on this behavior even when it is undocumented.',
'Ask users to walk through real examples, including unusual ones. Compare a sample of records against what the reports show. Review scheduled jobs and database triggers. Each rule you find is a requirement the new solution must keep, change deliberately, or retire with the agreement of the people affected.'
]],
['Choose a bounded first step',[
'A good first step is small enough to finish in weeks rather than months, but meaningful enough that the business notices the improvement. It should have dependencies you understand and can test.',
{list:[
'A module with clear inputs and outputs, such as quoting, a customer portal, or a reporting layer.',
'A workflow where the current pain is visible: repeated data entry, slow approvals, or frequent errors.',
'A part of the system where success can be measured against today’s baseline.',
'A change that can be rolled back if something goes wrong.'
]},
'In many cases, the first step is not rebuilding anything. It can be putting a clean API in front of the old database, moving reporting to a separate data model, or automating one manual handoff. These moves reduce risk for every step that follows.'
]],
['Plan the transition before you build',[
'Decide how the new piece will go live before development starts. Will it run alongside the old system for a period? Which records move, and how will you verify them? What happens if the new component is unavailable?',
'Rehearse data migration with real data, more than once. Agree on a rollback approach, and make sure someone owns the decision to use it. A transition plan written early tends to change the design for the better, because it exposes assumptions while they are still cheap to fix.'
]],
['Validate against business continuity',[
'Modernization succeeds when the business keeps working and the improvement is real. Technical progress alone is not enough.',
{list:[
'Reconcile migrated data: record counts, balances, and a sample of detailed records.',
'Test representative workflows end to end with the people who perform them.',
'Monitor errors, performance, and support requests closely after release.',
'Compare results against the baseline you recorded before the change.'
]}
]],
['A simple first-month plan',[
{list:[
'Week 1: interview users, collect examples, and list integrations and reports.',
'Week 2: map dependencies and data ownership; identify hidden rules.',
'Week 3: choose and scope the first step, with success measures and a rollback plan.',
'Week 4: confirm the transition approach and start building in reviewable stages.'
]},
'By the end of the month, you have a clear picture of the system, a defined first step, and an agreed way to measure whether it worked.'
]],
['Decide what to retire, not only what to rebuild',[
'Every legacy system carries features that made sense once and no longer do: reports nobody opens, statuses nobody uses, workarounds for a process that has since changed. Rebuilding all of them adds cost and complexity to the new solution without adding value.',
'As you map the system, mark each feature as keep, change, or retire. Confirm the decisions with the people who would notice. Usage logs and report access records help, but a short conversation with each team is usually faster and more reliable.',
{list:[
'Keep: behavior the business depends on and that works well today.',
'Change: behavior that is needed but causes errors, delays, or manual effort.',
'Retire: features with no current users or purpose, documented so the decision can be revisited.'
]},
'Retiring features deliberately is one of the simplest ways to make modernization cheaper. It also makes the new system easier to learn, because people are not asked to relearn things they never needed.'
]],
['How we approach it',[
'When we help a business modernize, we start with this kind of mapping and a single bounded step, then plan the next move from what that step teaches us. If you are weighing a replacement and want a second opinion on where to start, book a conversation and bring a description of the system and the problem it is causing.'
]]
]
},
{
slug:'making-business-data-useful',
name:'Make business data useful before building more reports',
intro:'Reliable reporting starts with clear definitions and consistent source data. More dashboards rarely fix numbers that people do not trust.',
sections:[
['The symptoms are familiar',[
'Two reports show different revenue for the same month. The sales team keeps its own spreadsheet because the system “is never right.” Month-end takes days because someone has to reconcile everything by hand. A new dashboard is requested, built, and quietly ignored.',
'These are rarely tooling problems. They are definition, ownership, and data-quality problems. Adding another report on top of inconsistent data produces another number to argue about.'
]],
['Agree on definitions first',[
'Most disagreements between reports come from measures that sound the same but are calculated differently. “Revenue” is a common example:',
{list:[
'Invoiced amount, or amount actually collected?',
'Before or after discounts, credits, and returns?',
'Including or excluding shipping and taxes?',
'Recognized on the order date, ship date, or invoice date?'
]},
'Each answer can be valid. The problem is when different reports use different answers without saying so. Write down the definition of each key measure, the reporting period, and the system it comes from. Agree on it with the people who use the number to make decisions.'
]],
['Give each measure an owner',[
'A definition without an owner drifts. For each important measure, name the person who decides how it is calculated and who is asked when it looks wrong. That is usually a business role, such as the finance lead for revenue or the operations lead for on-time delivery, not the person who builds the report.',
'Ownership also makes change manageable. When the business introduces a new product line or pricing model, the owner decides how the measure should treat it, and the reports are updated once rather than argued about later.'
]],
['Check the source before the report',[
'Reports inherit every problem in the data underneath them. Before building anything new, profile the source data for common issues:',
{list:[
'Duplicate customers, suppliers, or items created with slightly different names.',
'Missing values in fields that reports depend on, such as region, category, or cost.',
'Inconsistent identifiers between systems, for example item codes that differ between the ERP and the e-commerce platform.',
'Delayed updates, where one system syncs nightly and another in real time.',
'Manual overrides that are not recorded anywhere.'
]}
]],
['Fix problems close to where they start',[
'It is tempting to clean data inside the report: a filter here, a mapping table there. That works until the next report needs the same fix and implements it differently.',
'Where possible, correct issues at the source. Add validation to the form where data is entered. Make required fields required. Agree on a master list for customers and items, and reconcile integrations against it. When a problem cannot be fixed at the source, handle it once in a shared data layer that every report uses, and make the exceptions visible rather than hiding them.'
]],
['Build each report for a decision',[
'Every report should answer a question that leads to an action. Before building one, write down:',
{list:[
'The question: for example, “Which orders are at risk of shipping late this week?”',
'Who asks it, and how often.',
'What they will do differently depending on the answer.',
'The measures and level of detail needed to support that action.'
]},
'This keeps reports focused. A smaller set of trusted measures, reviewed regularly, is usually more useful than a large dashboard with dozens of charts nobody owns.'
]],
['Make data quality visible',[
'Data-quality problems do not disappear when they are hidden. A report that silently drops records with a missing region looks clean, but it undercounts, and nobody knows by how much.',
'Instead, show the exceptions. Add a simple data-quality view alongside the main reports: how many records are missing key fields, how many could not be matched between systems, and when each source last updated. Assign each type of issue to the person who can fix it at the source.',
'Over time, this view becomes a useful measure in its own right. When the number of exceptions falls, confidence in the reports rises, and people stop keeping their own spreadsheets.'
]],
['Review measures as the business changes',[
'Definitions that were right last year may not fit a new product line, a new sales channel, or a change in pricing. Schedule a short review of key measures, for example each quarter, with their owners.',
{list:[
'Is each measure still used to make a decision?',
'Has anything changed in how the underlying data is created?',
'Are any reports duplicating each other, and can one be retired?',
'Are there questions the business now asks that the reports cannot answer?'
]},
'A regular review keeps the reporting set small and relevant. It also catches drift early, before two teams find themselves arguing over numbers again.'
]],
['A short checklist',[
{list:[
'Key measures have written definitions and named owners.',
'Source data has been profiled, and known issues are tracked.',
'Fixes live at the source or in one shared data layer, not inside individual reports.',
'Each report states the decision it supports.',
'Exceptions and data-quality problems are visible, not filtered out silently.'
]}
]],
['How we approach it',[
'When businesses ask us for reporting, we usually start by agreeing on definitions and checking the source data, then build a small set of reports people can trust before adding more. If your teams spend more time reconciling numbers than acting on them, book a conversation and bring an example of two reports that disagree.'
]]
]
},
{
slug:'choosing-automation-workflows',
name:'Where to begin with workflow automation',
intro:'Good automation starts with a well-understood process and a clear exception path. Choosing the right first workflow matters more than choosing the right tool.',
sections:[
['Start with the process, not the tool',[
'Automation tools, including AI-assisted ones, have become easier to try. That makes it tempting to pick a tool first and look for something to automate. The more reliable order is the reverse: understand a process well, decide which steps are worth automating, and then choose the simplest tool that does the job.',
'Automating a process that is unclear or inconsistent usually makes the problems faster and harder to see. The goal is not to remove people from the work, but to remove repeated effort and errors so people can focus on the cases that need judgment.'
]],
['Find the repeated work',[
'Good candidates tend to share a few characteristics. Look for work that is:',
{list:[
'Repeated often, such as daily or weekly, by one or more people.',
'Rule-based, where the steps are mostly the same each time.',
'Moving information between systems by copy and paste, re-keying, or email attachments.',
'Prone to errors that cause rework, delays, or customer issues.',
'Waiting on simple approvals or notifications.'
]},
'Common examples include entering supplier invoices from PDF or email, creating orders from customer purchase orders, sending status updates, reconciling payments against invoices, and moving data between an e-commerce platform and an accounting system.'
]],
['Estimate the value before you build',[
'For each candidate, make a rough estimate: how often it happens, how long it takes, how often it goes wrong, and what an error costs. You do not need precise numbers. A simple comparison is usually enough to show which workflow deserves attention first.',
'Also consider risk. A workflow that touches payments, payroll, or customer commitments needs more validation and review than one that drafts an internal summary. Starting with a moderate-value, low-risk workflow builds confidence and teaches the team what good automation looks like.'
]],
['Map the normal path and the exceptions',[
'Walk through the process with the people who do it today. Document the normal path step by step: what triggers it, what information is needed, which systems are involved, and what the output is.',
'Then list the exceptions. These are the cases where information is missing, a value looks wrong, a system is unavailable, or a customer asks for something unusual. In many processes, the exceptions take more time than the normal path. Automation that ignores them simply moves the problem elsewhere.'
]],
['Define the exception path deliberately',[
'Decide in advance what happens when the automation cannot complete a step:',
{list:[
'Who is notified, and where the item waits for review.',
'What information the reviewer sees, so they can decide quickly.',
'How a corrected item is retried without duplicating work.',
'How long an item can wait before it is escalated.'
]},
'A clear exception path is what makes automation dependable. It also gives you a record of where the process struggles, which is valuable input for the next improvement.'
]],
['Keep people in the loop where it matters',[
'For tasks that involve interpretation, such as reading documents or classifying requests, AI can reduce manual effort significantly. It can also be wrong in ways that look plausible. Use confidence thresholds, show reviewers the source alongside the extracted result, and require approval for actions that are hard to reverse.',
'Over time, as you see how the automation performs on real work, you can adjust which cases need review. Start conservative and relax controls based on evidence, not assumptions.'
]],
['Measure the outcome',[
'Record a baseline before you automate, then track the same measures afterward:',
{list:[
'Time from trigger to completion.',
'Error and rework rates.',
'Number of items needing manual intervention, and why.',
'Effort spent by the team on the process each week.'
]},
'These numbers show whether the automation is helping and point to the next improvement. They also make it easier to decide which workflow to automate next.'
]],
['Choose the simplest tool that does the job',[
'Once the process and its exceptions are clear, the tool choice usually becomes simpler. Many workflows can be handled by features already available in the systems you use, such as built-in approval rules, scheduled exports, or native integrations between your accounting and commerce platforms.',
'Where those are not enough, a workflow platform or a small custom integration may be the right fit. AI services are worth considering when the work involves reading unstructured documents or classifying free-text requests. Whatever you choose, prefer options your team can understand, monitor, and change without depending on one person.'
]],
['Plan for ownership after go-live',[
'Automation is not finished when it goes live. Suppliers change invoice formats, systems release updates, and business rules change. Someone needs to own each automated workflow, the same way someone owns each manual process today.',
{list:[
'Name an owner who reviews exceptions and performance regularly.',
'Keep a short description of what the workflow does, its triggers, and its rules.',
'Set up alerts for failures, not only for successful runs.',
'Agree on how changes are requested, tested, and released.'
]},
'With clear ownership, automation stays dependable as the business changes, and each new workflow builds on what the team has already learned.'
]],
['How we approach it',[
'When we help businesses automate, we start by mapping one workflow with the people who run it, define the exception path, and agree on how success will be measured before building. If there is a task your team repeats every day and wishes it did not, book a conversation and bring a recent example of it.'
]]
]
}
];
