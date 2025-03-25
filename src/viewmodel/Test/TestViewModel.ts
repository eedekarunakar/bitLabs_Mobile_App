// TestViewModel.ts
import { useState } from "react";
import { submitTestResult } from "@services/Test/testService"; // Import the service
import { TestDetails } from "@models/Model"; // Assuming you have a model for test details
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@models/model"; // Define your stack param list
import { updateLead } from "@services/ZohoCrm";
import { useAuth } from "@context/Authcontext";
// Type the navigation object with your stack's params

export const useTestViewModel = (
  userId: number | any,
  jwtToken: string | null,
  testName: string,
) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [showEarlySubmissionModal, setShowEarlySubmissionModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const { leadId } = useAuth();
  const submitTest = async (finalScore: number, isEarlySubmission: boolean) => {
    const testStatus = isEarlySubmission
      ? "F" // Early submission fails by default
      : finalScore >= 70
        ? "P" // Pass if score >= 70
        : "F"; // Fail otherwise
    const testDetails: TestDetails = {
      testName: testName,
      testScore: isEarlySubmission ? 0 : finalScore,
      testStatus: testStatus,
      testDateTime: new Date().toISOString(),
      applicant: { id: userId },
    };

    try {
      const response = await submitTestResult(userId, testDetails, jwtToken);

      if (response.status) {
        // Handle success
        setIsTestComplete(true);
        let leadData = {};
        if (testName === "General Aptitude Test") {
          leadData = {
            data: [
              {
                Owner: { id: "4569859000019865042" },
                GAT: finalScore >= 70 ? 'cleared' : 'failed',
                GAT_Score: Math.round(testDetails.testScore),
              },
            ],
          };
        }
        else if (testName === "Technical Test") {
          leadData = {
            data: [
              {
                Owner: { id: "4569859000019865042" },
                TT: finalScore >= 70 ? 'cleared' : 'failed',
                TT_Score: Math.round(testDetails.testScore),
              },
            ],
          };
        }
        // Attempt to update lead in Zoho CRM
        try {
          console.log("Lead Data:", leadData);
          console.log("Lead Id:", leadId);
          const res = await updateLead(leadId, leadData);
          // if (res?.status) {
          //   console.log("Lead updated status", res?.status);
          // }
        } catch (error) {
          console.error("Error updating lead:", error);
        }

        // Navigation logic
        if (finalScore >= 70) {
          navigation.navigate("passContent", { finalScore, testName });
        } else {
          navigation.navigate("FailContent");
        }
      } else {
        console.error("Error during test submission:");
      }
    } catch (error) {
      console.error("Error during test submission:", error);
    }
  };

  return {
    isTestComplete,
    showEarlySubmissionModal,
    setShowEarlySubmissionModal,
    setIsTestComplete,
    submitTest,
    showTimeUpModal,
    setShowTimeUpModal,
  };
};
