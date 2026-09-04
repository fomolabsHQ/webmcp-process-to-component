# Process Specification: Comprehensive Insurance Claim Submission

> **Status**: Approved
> **Target Component**: `InsuranceClaimFlow` (`src/examples/insurance-claim/InsuranceClaimFlow.tsx`)
> **WebMCP Tool**: `file_insurance_claim`

---

## 1. Purpose Statement
Enables policyholders and enterprise insurance intake agents to verify active policy coverage, record incident specifics and regulatory requirements, calculate estimated payouts against deductibles, and assign a formal claim reference to an adjuster from a unified interface.

---

## 2. Workflow & Step Progression

| Step # | Stage Name | Description | Required Human Action / Agent Data |
| :--- | :--- | :--- | :--- |
| 1 | **Policy** | Policy verification and lookup | Policy identifier (`POL-XXXXXX`), policyholder full name, and coverage line |
| 2 | **Claim** | Incident timeline and narrative | Incident date (YYYY-MM-DD), location/jurisdiction, and event description |
| 3 | **Requirements** | Statutory & compliance checks | Police report filing status (`hasPoliceReport`), report number, third-party involvement |
| 4 | **Evidence** | Financial loss and evidence classification | Monetary loss estimate ($ USD), primary evidence type (`photos`, `estimate`, etc.) |
| 5 | **Validation** | Deductible assessment & coverage check | Automated coverage check against standard $500 deductible |
| 6 | **Submission** | Claim issuance & adjuster assignment | Generates claim number (`CLM-XXXXXX`), assigned claims adjuster, and scheduled review date |

---

## 3. Data Schema & Input Fields

### Input Definitions
| Field Name | Type | Required? | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| `policyNumber` | string | Yes | Format: `/^POL-\d{6}$/` | Policy account identifier |
| `policyHolderName` | string | Yes | Min 3 chars | Full legal name of insured party |
| `coverageType` | enum | Yes | `'auto' \| 'homeowners' \| 'commercial'` | Line of insurance coverage |
| `incidentDate` | string | Yes | ISO date string (YYYY-MM-DD) | Date the incident occurred |
| `incidentLocation` | string | Yes | Min 3 chars | City, state or street location |
| `incidentDescription` | string | Yes | Min 20 chars | Narrative description of damage/event |
| `hasPoliceReport` | boolean | Yes | Boolean flag | Whether authorities were notified |
| `policeReportNumber` | string | No | Optional string if reported | Formal police blotter/report number |
| `hasThirdPartyInvolved` | boolean | Yes | Boolean flag | Whether third parties were affected |
| `estimatedLossAmount` | number | Yes | Positive integer/float > 0 | Estimated dollar cost of loss |
| `evidenceType` | enum | Yes | `'photos' \| 'repair_estimate' \| 'medical_invoice' \| 'affidavit'` | Primary evidentiary documentation |
| `notes` | string | No | Max 500 chars | Optional supplementary notes |

---

## 4. Backend Touchpoints & Side Effects
When `executeInsuranceClaimAction` is called:
- **Core Policy Admin**: Verifies policy is active and in good standing.
- **Claims Registry**: Creates a pending claim record in state and assigns a claim tracking number (`CLM-XXXXXX`).
- **Underwriting & Deductible Engine**: Deducts policy deductible ($500) and calculates net approved coverage limit.
- **Adjuster Dispatch**: Assigns claim to the regional claims resolution team with a 48-hour response SLA.
- **Digital Notice**: Simulates formal email confirmation containing claim portal tracking credentials.

---

## 5. Output & Response Contract

### Success Envelope
```json
{
  "success": true,
  "claimNumber": "CLM-592810",
  "policyNumber": "POL-883920",
  "status": "UNDER_REVIEW",
  "estimatedLoss": "$4,250.00",
  "deductible": "$500.00",
  "netEstimatedPayout": "$3,750.00",
  "assignedAdjuster": "Sarah Jenkins (Regional Claims Team)",
  "reviewDeadline": "2 Business Days",
  "message": "Claim CLM-592810 successfully registered and dispatched for underwriting review."
}
```

### Error Envelope
```json
{
  "success": false,
  "code": "POLICY_INACTIVE | INVALID_INCIDENT_DATE | REQUIREMENT_MISSING",
  "error": "Human-readable explanation of rejection"
}
```
