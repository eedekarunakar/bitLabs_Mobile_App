import apiClient from "./login/ApiClient";

export const createLead = async (leadData) => {
    try {
        console.log("🔄 Creating Lead with Data:", leadData); // Log data before sending

        const response = await apiClient.post(`/zoho/create-lead`,leadData);

        console.log("✅ API Response:", response.data); // Log success response

        if (response.status === 200 || response.status === 201) {
            return response.data?.data?.[0].details.id || null;
        } else {
            console.error(" Failed to submit lead:", response.data);
            return null;
        }
    } catch (error) {
        console.error("API Call Failed:", error); // Log the complete error object

        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(" Error submitting lead:", errorMessage);

        throw new Error(`Failed to create lead: ${errorMessage}`);
    }
};


export const searchLead = async(email) => {
    if (!email) {
        console.error("Email is required for searching leads");
        return null;
      }
  
      try {
        const response = await apiClient.get(`/zoho/searchlead/${encodeURIComponent(email)}`);
  
        if (response.status === 200 || response.status === 201) {
          const leadId = response.data?.data?.[0]?.id || null;
          console.log("Lead search result:", leadId ? "Found" : "Not found");
          return leadId;
        } else {
          console.error("Failed to find lead", response.data);
          return null;
        }
      } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        console.error("Error finding lead:", errorMessage);
        throw new Error(`Failed to search lead: ${errorMessage}`);
      }
};

export const updateLead = async (leadId, leadData) => {
    try {
        const response = await apiClient.put( `/zoho/update/${leadId}`, leadData);
   
        if (response.status === 200 || response.status === 201) {
          console.log("✅ Lead successfully updated in Zoho CRM.");
          return response; // Exit function on success
        }
   
      } catch (error) {
        console.error("❌ Failed to update lead in Zoho CRM", error);
      }
    
};