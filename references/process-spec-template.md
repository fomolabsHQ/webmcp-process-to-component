# Process Specification: [Process Name]

> **Status**: [Draft | In Review | Approved]
> **Target Component**: `[ComponentName]` (`[path/to/component]`)
> **WebMCP Tool**: `[tool_name]`

---

## 1. Purpose Statement
[A single, unambiguous sentence explaining what this business process accomplishes.]

---

## 2. Workflow & Step Progression
Define the sequential stages through which a user or agent moves.

| Step # | Step Name | Description | Required Human Action / Agent Data |
| :--- | :--- | :--- | :--- |
| 1 | [e.g. Identification] | [Step summary] | [Inputs collected] |
| 2 | [e.g. Validation] | [Step summary] | [Checks performed] |
| 3 | [e.g. Configuration] | [Step summary] | [Options selected] |
| 4 | [e.g. Confirmation] | [Step summary] | [Final submission] |

---

## 3. Data Schema & Input Fields

### Input Definitions
| Field Name | Type | Required? | Validation Rules | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `field_one` | string | Yes | Min 3 chars, alphanumeric | Unique identifier |
| `field_two` | enum | Yes | One of `['A', 'B', 'C']` | Category choice |
| `field_three` | number | No | Positive integer | Optional count or amount |

### Zod Schema Definition
```typescript
import { z } from "zod";

export const ProcessInputSchema = z.object({
  field_one: z.string().min(3, "Must be at least 3 characters"),
  field_two: z.enum(["A", "B", "C"]),
  field_three: z.number().int().positive().optional(),
});

export type ProcessInput = z.infer<typeof ProcessInputSchema>;
```

---

## 4. Backend Touchpoints & Side Effects
Document all operations executed when the mutation is triggered:

- **Touchpoint 1 (Database / State)**: [e.g., Records new claim status as 'PENDING']
- **Touchpoint 2 (External Service)**: [e.g., Dispatches confirmation email or webhook]
- **Touchpoint 3 (Inventory / Locks)**: [e.g., Reserves booking slot or releases return label]

---

## 5. Output & Response Contract

### Success Envelope
```json
{
  "success": true,
  "referenceId": "REF-12345",
  "status": "COMPLETED",
  "data": {
    /* payload */
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "code": "INVALID_INPUT | NOT_FOUND | ELIGIBILITY_FAILED",
  "message": "Human-readable explanation of error"
}
```
