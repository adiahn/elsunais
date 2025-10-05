import { maintenanceService } from '../services/maintenanceService';

// Test function for maintenance API
export const testMaintenanceApi = async () => {
  console.log('Testing Maintenance API...');
  
  try {
    // Test creating a maintenance request
    const testRequest = {
      title: "Air Conditioner Repair",
      category: "equipment" as const,
      details: {
        location: "Office Block A",
        issue: "Not cooling properly",
        requested_by: "Khalil Officer"
      },
      priority: "high" as const,
      amount: 500,
      notes: "Urgent repair needed",
      vendor: "Cool Air Services"
    };

    console.log('Creating test maintenance request:', testRequest);
    const createdRequest = await maintenanceService.createMaintenanceRequest(testRequest);
    console.log('✅ Maintenance request created successfully:', createdRequest);

    // Test fetching all maintenance requests
    console.log('Fetching all maintenance requests...');
    const allRequests = await maintenanceService.getMaintenanceRequests();
    console.log('✅ Maintenance requests fetched successfully:', allRequests);

    // Test fetching maintenance stats
    console.log('Fetching maintenance stats...');
    const stats = await maintenanceService.getMaintenanceStats();
    console.log('✅ Maintenance stats fetched successfully:', stats);

    return {
      success: true,
      message: 'All maintenance API tests passed!',
      data: {
        createdRequest,
        allRequests,
        stats
      }
    };
  } catch (error) {
    console.error('❌ Maintenance API test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error
    };
  }
};

export default testMaintenanceApi;
