# Maintenance Feature Documentation

## Overview
The maintenance feature allows users to create, manage, and track maintenance requests for office equipment, utilities, and other maintenance needs.

## API Endpoints

### Base URL
```
POST {{base_url}}/maintenance
```

### Create Maintenance Request
```json
{
  "title": "Air Conditioner Repair",
  "category": "equipment",
  "details": {
    "location": "Office Block A",
    "issue": "Not cooling properly",
    "requested_by": "Khalil Officer"
  },
  "priority": "high",
  "amount": 500,
  "notes": "Urgent repair needed",
  "vendor": "Cool Air Services"
}
```

### Available Categories
- `office_supplies` - Office supplies and stationery
- `equipment` - Office equipment and machinery
- `utilities` - Utility services (electricity, water, internet)
- `cleaning` - Cleaning services
- `security` - Security-related maintenance
- `it_services` - IT equipment and services
- `other` - Other maintenance needs

### Available Priorities
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority
- `urgent` - Urgent priority

### Request Status Flow
1. `pending` - Request created, awaiting approval
2. `approved` - Request approved, ready for processing
3. `in_progress` - Work in progress
4. `completed` - Request completed
5. `rejected` - Request rejected

## Frontend Integration

### Service Layer
The maintenance feature uses `maintenanceService` located in `src/services/maintenanceService.ts` which provides:
- `createMaintenanceRequest()` - Create new maintenance requests
- `getMaintenanceRequests()` - Fetch all maintenance requests
- `getMaintenanceRequest(id)` - Fetch specific maintenance request
- `updateMaintenanceRequest(id, data)` - Update maintenance request
- `deleteMaintenanceRequest(id)` - Delete maintenance request
- `approveMaintenanceRequest(id)` - Approve maintenance request
- `rejectMaintenanceRequest(id, reason)` - Reject maintenance request
- `completeMaintenanceRequest(id)` - Mark request as completed
- `getMaintenanceStats()` - Get maintenance statistics

### UI Components
The maintenance feature is accessible through:
- **MaintenanceView** (`src/components/views/MaintenanceView.tsx`) - Main maintenance interface
- **Dashboard Integration** - Available in the sidebar as "Maintenance"
- **Admin Integration** - Maintenance requests appear in the admin panel for approval

### Key Features
1. **Create Requests** - Users can create maintenance requests with detailed information
2. **Request Management** - View, edit, and track maintenance requests
3. **Approval Workflow** - Admin approval system for maintenance requests
4. **Statistics Dashboard** - Overview of maintenance request statistics
5. **Status Tracking** - Real-time status updates for maintenance requests

### Form Fields
- **Title** - Brief description of the maintenance need
- **Category** - Type of maintenance (equipment, utilities, etc.)
- **Location** - Where the maintenance is needed
- **Issue Description** - Detailed description of the problem
- **Requested By** - Name of the person requesting maintenance
- **Priority** - Urgency level of the request
- **Amount** - Estimated or actual cost (optional)
- **Vendor** - Preferred service provider (optional)
- **Notes** - Additional information (optional)

## Usage Examples

### Creating a Maintenance Request
```typescript
import { maintenanceService } from '../services/maintenanceService';

const createRequest = async () => {
  try {
    const request = await maintenanceService.createMaintenanceRequest({
      title: "Air Conditioner Repair",
      category: "equipment",
      details: {
        location: "Office Block A",
        issue: "Not cooling properly",
        requested_by: "Khalil Officer"
      },
      priority: "high",
      amount: 500,
      notes: "Urgent repair needed",
      vendor: "Cool Air Services"
    });
    console.log('Request created:', request);
  } catch (error) {
    console.error('Error creating request:', error);
  }
};
```

### Fetching Maintenance Requests
```typescript
const fetchRequests = async () => {
  try {
    const requests = await maintenanceService.getMaintenanceRequests();
    console.log('All requests:', requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
};
```

### Approving a Request
```typescript
const approveRequest = async (requestId: number) => {
  try {
    const approvedRequest = await maintenanceService.approveMaintenanceRequest(requestId);
    console.log('Request approved:', approvedRequest);
  } catch (error) {
    console.error('Error approving request:', error);
  }
};
```

## Testing
A test utility is available at `src/utils/testMaintenanceApi.ts` to verify API functionality:

```typescript
import { testMaintenanceApi } from '../utils/testMaintenanceApi';

// Run maintenance API tests
testMaintenanceApi().then(result => {
  console.log('Test result:', result);
});
```

## Error Handling
The maintenance service includes comprehensive error handling for:
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Validation errors (400)
- Server errors (500+)
- Network errors

All errors are properly typed and include descriptive error messages for better user experience.
