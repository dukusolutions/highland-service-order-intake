# Highland Service Order Intake

Emergency Leak Service intake form for Highland Commercial Roofing. Built with Next.js, React 19, and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev        # start dev server at http://localhost:3000
npm test           # run tests (single run)
npm run test:watch # run tests in watch mode
```

### Environment Variables

Create a `.env.local` file with:

```env
# Customer Lookup & Order Status (staging API)
SERVICE_INTAKE_API_URL=https://hcr-staging.dukusolutions.com/ws/api/ServiceIntake/CustomerLookup
SERVICE_INTAKE_API_KEY=<your-api-key>

# Service Order Submission (Azure Function)
SERVICE_ORDER_INTAKE_URL=https://dynamo-highland-functions.azurewebsites.net/api/service-order-intake?code=<dfdfdfdfd>
```

---

## API Endpoints

The app proxies all backend calls through Next.js API routes so that API keys and upstream URLs are never exposed to the browser.

### 1. Customer Lookup (Prefill)

Look up existing customer records by job number or email to prefill the form.

|                    |                                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| **Frontend route** | `POST /api/emergency-leak-service/lookup`                                       |
| **Upstream**       | `GET https://hcr-staging.dukusolutions.com/ws/api/ServiceIntake/CustomerLookup` |
| **Auth**           | `apikey` header                                                                 |

**Request body:**

```json
{
  "JobNo": "ELS-26-01-0001",
  "EmailAddress": "john@acme.com",
  "City": "Denver",
  "Zip": "80202"
}
```

At least one of `JobNo` or `EmailAddress` is required. `City` and `Zip` are optional filters.

**Response:** Array of `ServiceOrderResponse` objects containing `Clients[]`, `BillingInfos[]`, and `LeakDetails[]`.

---

### 2. Submit Service Order

Submit a new emergency leak service request. The Azure Function queues it for processing.

|                    |                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **Frontend route** | `POST /api/emergency-leak-service`                                                             |
| **Upstream**       | `POST https://dynamo-highland-functions.azurewebsites.net/api/service-order-intake?code=<key>` |

**Request body:** `ServiceOrderIntakeRequest` (camelCase, numeric enums)

```json
{
  "client": { "dynamoAccountId": null, "dynamoContactId": null, "accountName": "...", "accountContactName": "...", "email": "...", "phone": "..." },
  "billing": { "dynamoId": null, "entityBillToName": "...", "billToAddress": "...", "billToAddress2": "...", "billToCity": "...", "billToZip": "...", "billToEmail": "..." },
  "leakDetails": { "dynamoId": null, "jobNo": "", "jobDate": null, "siteName": "...", "siteAddress": "...", ... },
  "additionalLeaks": [],
  "SignatureData": "data:image/png;base64,...",
  "SignatureName": "John Smith"
}
```

**Response:**

```json
{
  "success": true,
  "referenceId": "7568e1e0-1d0c-4f22-bd1a-303ee95fb7b7",
  "queueName": "...",
  "requestDate": "2026-02-16T18:54:25Z",
  "createdAt": "2026-02-16T18:54:25Z",
  "message": "Service order request received and queued for processing."
}
```

After a successful submission, the server also fires a best-effort `POST /api/ServiceIntake/TriggerQueueProcessing` call to kick off backend processing.

**Save the `referenceId`** — you need it to check order status.

---

### 3. Get Service Order Status

Pull up an existing submitted request using the `referenceId` returned from submission.

|                    |                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Frontend route** | `GET /api/emergency-leak-service/status?referenceId=<guid>`                                               |
| **Upstream**       | `GET https://hcr-staging.dukusolutions.com/ws/api/ServiceIntake/GetServiceOrderStatus?referenceId=<guid>` |
| **Auth**           | `apikey` header                                                                                           |

**Query string parameter:**

| Parameter     | Type          | Required | Description                                            |
| ------------- | ------------- | -------- | ------------------------------------------------------ |
| `referenceId` | string (GUID) | Yes      | The reference ID returned when the order was submitted |

**Example request:**

```
GET /api/emergency-leak-service?referenceId=7568e1e0-1d0c-4f22-bd1a-303ee95fb7b7
```

**Example response:**

```json
{
  "Success": true,
  "Message": "Service order found",
  "Status": "NEW",
  "Data": {
    "Id": "7568e1e0-1d0c-4f22-bd1a-303ee95fb7b7",
    "RequestDate": "2026-02-16T18:54:25Z",
    "Client": {
      "DynamoAccountId": null,
      "DynamoContactId": null,
      "AccountName": "Acme Corporation",
      "AccountContactName": "John Smith",
      "Email": "john.smith@acmecorp.com",
      "Phone": "555-123-4567"
    },
    "Billing": {
      "DynamoId": null,
      "EntityBillToName": "Acme Corporation Billing Dept",
      "BillToAddress": "123 Main Street",
      "BillToAddress2": "Suite 200",
      "BillToCity": "Springfield",
      "BillToZip": "12345",
      "BillToEmail": "billing@acmecorp.com"
    },
    "LeakDetails": {
      "DynamoId": null,
      "JobNo": "",
      "JobDate": "2024-03-15T10:00:00Z",
      "SiteName": "Acme Warehouse Building A",
      "SiteAddress": "456 Industrial Pkwy",
      "SiteAddress2": "Building A",
      "SiteCity": "Springfield",
      "SiteZip": "12345",
      "TenantBusinessName": "ABC Logistics",
      "TenantContactName": "Jane Doe",
      "TenantContactPhone": "555-987-6543",
      "TenantContactCell": "555-111-2222",
      "TenantContactEmail": "jane.doe@abclogistics.com",
      "HoursOfOperation": "Monday-Friday 8:00 AM - 5:00 PM",
      "LeakLocation": 1,
      "LeakNear": 2,
      "LeakNearOther": "",
      "HasAccessCode": true,
      "AccessCode": "1234#",
      "IsSaturdayAccessPermitted": true,
      "IsKeyRequired": false,
      "IsLadderRequired": true,
      "RoofPitch": 1,
      "Comments": "Leak is actively dripping."
    },
    "AdditionalLeaks": [],
    "CreatedAt": "2026-02-16T18:54:25Z",
    "UpdatedAt": null
  }
}
```

**Status values:**

| Status        | Description                      |
| ------------- | -------------------------------- |
| `NEW`         | Order received, not yet assigned |
| `IN_PROGRESS` | Order is being worked            |
| `COMPLETED`   | Service completed                |
| `CANCELLED`   | Order was cancelled              |

**Numeric enum mappings (for `LeakLocation`, `LeakNear`, `RoofPitch`):**

| LeakLocation |        | LeakNear |           | RoofPitch |                    |
| ------------ | ------ | -------- | --------- | --------- | ------------------ |
| 1            | Front  | 1        | HVAC Duct | 1         | Flat Roof          |
| 2            | Middle | 2        | Skylight  | 2         | Steep/Shingle/Tile |
| 3            | Back   | 3        | Wall      |           |                    |
|              |        | 4        | Drain     |           |                    |
|              |        | 5        | Other     |           |                    |

---

## Key Features

- **Multiple properties** — add multiple leaking properties per service order; each appears in an editable table
- **Auto-add on submit** — if the property editor has unsaved valid data when you submit, it's automatically added
- **Customer lookup** — prefill form fields by searching service order number or email
- **Signature capture** — `react-signature-canvas` records a base64 PNG sent as `SignatureData`
- **Signature name mirroring** — the account contact name auto-populates the signature name field in real time
- **Billing terms acknowledgment** — pricing verbiage with a required checkbox before submission
- **Conditional fields** — "Leak Near Other" textarea only appears when "Other" is selected; Access Code input only appears when "Has Access Code" is checked
- **Order status tracking** — view submitted order status by reference ID
- **Draft persistence** — form state is saved to `localStorage`

---

## Project Structure

```
app/
  api/emergency-leak-service/
    route.ts              # POST — submit new order (Azure Function proxy + TriggerQueueProcessing)
    lookup/route.ts       # POST — customer lookup (staging API proxy)
    prefill/route.ts      # POST — prefill data
    status/route.ts       # GET  — order status (staging API proxy)
  page.tsx                # Main page
components/
  EmergencyLeakServiceForm.tsx        # Main form orchestrator
  emergencyLeakService/
    ContactInfoSection.tsx            # Account & contact info fields
    BillingInfoSection.tsx            # Billing address fields
    LeakingPropertySection.tsx        # Property editor with conditional fields
    PropertyTable.tsx                 # Table of added properties
    PrefillDropdown.tsx               # Customer lookup result selector
    SignatureSection.tsx              # Signature canvas, name, billing terms
    OrderStatusPanel.tsx              # Post-submit status view
    IntakeHeader.tsx                  # Page header with lookup inputs
    FormInput.tsx                     # Reusable input & textarea components
    Footer.tsx                        # Form footer
helpers/
  emergencyLeakServiceForm.ts         # Validation, initial data, dirty checks
  serviceOrderApi.ts                  # Client-side API functions
  serviceOrderPayload.ts              # Form data → API payload transform
  unifiedFetcher.ts                   # Generic fetch wrapper
types/
  emergencyLeakService.ts             # All TypeScript types
__tests__/
  helpers/                             # Vitest unit tests
backendfiles/                          # C# model reference files
```
