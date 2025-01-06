import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ProgressBarProps = {
  currentStep: number;
  onStepPress?: (step: number) => void;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onStepPress }) => {
  const steps = [
    { id: 1, label: 'Personal       Info' },
    { id: 2, label: 'Professional Details' },
    { id: 3, label: 'Upload Resume' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLastStep = index === steps.length - 1;

          return (
            <View key={step.id} style={styles.stepWrapper}>
              {/* Step Circle */}
              <TouchableOpacity
                onPress={() => onStepPress?.(step.id)}
                style={[
                  styles.stepCircle,
                  isActive && styles.activeStepCircle,
                  isCompleted && styles.completedStepCircle, // Add style for completed step
                  isActive || isCompleted ? { borderColor: 'transparent' } : {},
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    isActive && styles.activeStepText,
                    isCompleted && styles.completedStepText, // Text style for completed step
                  ]}
                >
                  {step.id}
                </Text>
              </TouchableOpacity>

              {/* Connecting Line */}
              {!isLastStep && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.completedLine, // Green line for completed steps
                    isActive && styles.activeLine, // Orange line for current step
                  ]}
                />
              )}

              {/* Step Label */}
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    padding: 20,
    backgroundColor: '#fff',
    width: '100%', // Ensure container takes full width of screen
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Center the circles along the row
    justifyContent: 'space-between', // Space the circles evenly without overflow
    width: '100%', // Ensures the container spans the full width
  },
  stepWrapper: {
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'column',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F97316',
    zIndex: 1,
    alignSelf: 'center', 
  },
  activeStepCircle: {
    backgroundColor: '#F97316', // Orange for active step
  },
  completedStepCircle: {
    backgroundColor: 'green', // Green for completed steps
  },
  stepText: {
    fontSize: 16,
    color: '#F97316',
  },
  activeStepText: {
    fontWeight: 'bold',
    color: '#fff', // White text for active step
  },
  completedStepText: {
    fontWeight: 'bold',
    color: '#fff', // White text for completed steps
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    width: 80,
  },
  line: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: 100, // Adjust width to prevent overflow
    height: 2,
    backgroundColor: '#F97316', // Orange line for active step
    zIndex: 0,
  },
  activeLine: {
    backgroundColor: '#F97316',
  },
  completedLine: {
    backgroundColor: 'green', // Green line for completed steps
  },
});

export default ProgressBar;