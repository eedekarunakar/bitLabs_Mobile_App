import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";

const Step3: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
  const [resumeText, setResumeText] = useState<string>("");

  const handleUploadResume = async () => {
    try {
      const result: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Allow only PDF files
      });

      if (!result || result.length === 0) {
        console.log("No file selected.");
        return;
      }

      const selectedFile: DocumentPickerResponse = result[0];
      const maxSize = 1048576; // 1MB size limit

      // Validate file size
      if (selectedFile.size && selectedFile.size > maxSize) {
        console.log("File size exceeds the 1MB limit.");
        return;
      }

      setResumeFile(selectedFile);
      setResumeText(selectedFile.name || "");
      console.log("Resume selected: ", selectedFile.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the picker");
      } else {
        console.error("Unknown error: ", err);
      }
    }
  };

  return (
    <View style={styles.screen}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("./src/assests/Images/rat/logo.png")} />
      </View>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.completeProfile}>Upload Your Resume</Text>
          <Text style={styles.subHeader}>Please upload your resume:</Text>
        </View>

        {/* Resume Upload Section */}
        <View style={styles.form}>
          <Text style={styles.label}>Resume</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              placeholder="Upload your resume"
              style={styles.textInput}
              editable={false}
              value={resumeText}
            />
            <TouchableOpacity
              style={styles.browseButton}
              onPress={handleUploadResume}
            >
              <Text style={styles.browseText}>Browse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  completeProfile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  subHeader: {
    fontSize: 11,
    color: "black",
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "black",
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#E5E4E2",
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  browseButton: {
    backgroundColor: "#F97316",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  browseText: {
    color: "white",
  },
});

export default Step3;
