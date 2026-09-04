# Process Specification: E-Commerce Product Return Agent

> **Status**: Approved
> **Target Component**: `ReturnAgentFlow` (`src/examples/return-agent/ReturnAgentFlow.tsx`)
> **WebMCP Tool**: `process_product_return`

---

## 1. Purpose Statement
Enables customers and autonomous customer support agents to validate order eligibility, select return reasons and shipping methods, and instantly issue return merchandise authorizations (RMA) and refund preferences from a single unified workflow.

---

## 2. Workflow & Step Progression

| Step # | Stage Name | Description | Required Human Action / Agent Data |
| :--- | :--- | :--- | :--- |
| 1 | **Order** | Order identification and lookup | Order number (`orderNumber`) and account email (`email`) |
| 2 | **Eligibility** | Verify policy window and item state | Item condition (`unopened` or `gently_used`) |
| 3 | **Reason** | Purpose for returning product | Reason code (`wrong_size`, `defective`, `not_as_described`, `changed_mind`) + optional notes |
| 4 | **Method** | Logistics & carrier return method | Method (`dropoff_qr`, `carrier_pickup`, `in_store`) |
| 5 | **Refund** | Refund destination & credit preference | Refund target (`original_payment` or `store_credit` with 10% bonus) |
| 6 | **Ready** | Confirmation & label dispatch | RMA authorization, tracking number, and QR code generated |

---

## 3. Data Schema & Input Fields

### Input Definitions
| Field Name | Type | Required? | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| `orderNumber` | string | Yes | Format: `/^ORD-[A-Z0-9]{4,8}$/i` | The original customer order identifier |
| `email` | string | Yes | Valid email regex | Customer account email address |
| `itemCondition` | enum | Yes | `'unopened' \| 'gently_used'` | Product physical status |
| `reason` | enum | Yes | `'wrong_size' \| 'defective' \| 'not_as_described' \| 'changed_mind'` | Customer's stated return rationale |
| `returnMethod` | enum | Yes | `'dropoff_qr' \| 'carrier_pickup' \| 'in_store'` | Selected shipping logistics method |
| `refundPreference` | enum | Yes | `'original_payment' \| 'store_credit'` | Target refund disbursement vehicle |
| `notes` | string | No | Optional string (max 250 chars) | Additional context from user/agent |

---

## 4. Backend Touchpoints & Side Effects
When `executeReturnAction` is called:
- **Order State**: Marks order status as `RETURN_INITIATED` in the order management system.
- **Logistics Integration**: Generates carrier tracking number and drop-off QR authorization code.
- **Financial Ledger**: Queues refund transaction to payment gateway or issues instant digital gift card with a +10% bonus.
- **Customer Notification**: Emits simulated email with prepaid return shipping slip.

---

## 5. Output & Response Contract

### Success Envelope
```json
{
  "success": true,
  "rmaNumber": "RMA-849201",
  "orderNumber": "ORD-9821",
  "trackingNumber": "1Z9999999999999999",
  "qrCodeData": "RMA-849201-DROP",
  "refundAmount": "$96.12",
  "status": "READY",
  "message": "Return authorization generated. Drop off at any carrier location using your digital QR code."
}
```

### Error Envelope
```json
{
  "success": false,
  "code": "INVALID_INPUT | INELIGIBLE_CONDITION | ORDER_EXPIRED",
  "error": "Human-readable explanation of rejection"
}
```
