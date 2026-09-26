# AI Customer Support Refund Agent

A full-stack AI customer support application that uses Gemini function calling to evaluate and process e-commerce refund requests according to a strict refund policy.

The application demonstrates how an LLM can work with real backend tools, database records, deterministic business rules, and observable execution logs.

## Features

* AI-powered customer refund support
* Gemini function calling agent
* Dynamic backend tool execution
* Mock CRM database with 15 customers
* E-commerce orders and refund records
* Strict refund eligibility policy
* Automatic refund approval or denial
* Real PostgreSQL database using Prisma
* Persistent agent execution logs
* Admin monitoring dashboard
* Session-based execution tracking
* Responsive customer-facing UI
* Responsive admin dashboard

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* CSS

### Backend

* Next.js API Routes
* Gemini API
* Gemini function calling
* Prisma ORM

### Database

* PostgreSQL
* Neon PostgreSQL

## Architecture

```text
Customer
   |
   v
Next.js Customer UI
   |
   v
/api/refund
   |
   v
Gemini Refund Agent
   |
   |--- find_customer
   |--- find_order
   |--- get_refund_policy
   |--- check_refund_eligibility
   |--- process_refund
   |
   v
Business Rules + Prisma
   |
   v
PostgreSQL / Neon
   |
   +---- Refund records
   |
   +---- Customer records
   |
   +---- Order records
   |
   +---- Agent execution logs
   |
   v
Admin Agent Monitor
```

## How the Agent Works

The customer submits:

* Customer email
* Order number
* Refund reason

The request is sent to the refund agent.

The Gemini agent can dynamically select backend tools to gather the required information.

The available tools are:

### `find_customer`

Finds the customer using their email or customer number.

### `find_order`

Retrieves the requested order and its associated items and refund history.

### `get_refund_policy`

Loads the application's strict refund policy.

### `check_refund_eligibility`

Checks the actual database state against the refund policy.

### `process_refund`

Creates and processes the refund only when the backend eligibility check succeeds.

The backend policy validation is authoritative. The LLM does not directly modify database records.

## Refund Policy

A refund is allowed only when:

1. The order exists.
2. The customer owns the order.
3. The order is not cancelled.
4. The order has been delivered.
5. The request is within 30 days of delivery.
6. All requested items are refundable.
7. The order does not already have a processed refund.
8. The refund amount does not exceed the eligible order amount.

If any rule fails, the refund is denied.

## Agent Execution Logs

Every important tool execution is stored in the database using the `AgentLog` model.

The logs contain information such as:

* Session ID
* Customer
* Order
* Tool name
* Event
* Execution status
* Timestamp
* Tool result details

The admin dashboard can filter execution logs by session ID and monitor the agent workflow.

The dashboard displays observable execution activity rather than exposing private LLM chain-of-thought.

## Database

The application uses PostgreSQL with Prisma.

Main models:

```text
Customer
Order
OrderItem
Refund
AgentLog
```

The project includes mock data for 15 customers and their associated orders.

## Example Scenarios

### Successful Refund

A valid delivered order within the refund window can be processed successfully when no previous processed refund exists.

### Already Refunded

If an order already has a processed refund, the agent denies the request.

### Expired Refund

If more than 30 days have passed since delivery, the refund is denied.

### Non-Refundable Item

If the requested order contains a non-refundable item, the refund is denied.

### Cancelled Order

Cancelled orders are not eligible for refunds.

## Project Structure

```text
ai-refund-agent/
│
├── app/
│   ├── admin/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── agent-logs/
│   │   │   └── route.ts
│   │   └── refund/
│   │       └── route.ts
│   │
│   └── page.tsx
│
├── components/
│   └── ui/
│
├── lib/
│   ├── prisma.ts
│   └── generated/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── server/
│   ├── agent/
│   │   ├── gemini.ts
│   │   ├── refund-agent.ts
│   │   ├── refund-workflow.ts
│   │   └── tools.ts
│   │
│   ├── policy/
│   │   ├── refund-policy.ts
│   │   └── check-refund-eligibility.ts
│   │
│   ├── services/
│   │   └── agent-logger.ts
│   │
│   └── tools/
│       ├── find-customer.ts
│       ├── find-order.ts
│       ├── get-refund-policy.ts
│       ├── check-refund-eligibility.ts
│       └── process-refund.ts
│
├── scripts/
├── tests/
├── prisma7.config.ts
└── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd ai-refund-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
```

Do not commit `.env` or API keys to GitHub.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database

```bash
npx prisma db seed
```

### 7. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The admin monitor is available at:

```text
http://localhost:3000/admin
```

## Validation

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run the production build:

```bash
npm run build
```

## Demo Flow

The application demonstration covers:

1. A standard refund request.
2. An invalid refund request caused by a policy violation.
3. Gemini tool selection and execution.
4. Database-backed policy validation.
5. Refund processing.
6. Persistent agent execution logs.
7. Admin dashboard monitoring.

## Voice

Voice interaction was treated as an optional bonus feature from the assignment. The implemented version focuses on the required refund-agent workflow, tool orchestration, database integration, policy enforcement, and observable execution monitoring.

## Security Notes

* API keys are stored in environment variables.
* Environment files are excluded from Git.
* Refund decisions are validated by backend business rules.
* The LLM does not directly modify database records.
* Database operations are performed through controlled backend tools.

## Assignment Goal

This project was built as a product-oriented vertical slice demonstrating:

* Next.js development
* LLM integration
* Function calling
* Backend tool orchestration
* Database integration
* Business-rule enforcement
* Error and edge-case handling
* Observability
* Admin monitoring
* Production-oriented project structure
