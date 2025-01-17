import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
 
const screenWidth = Dimensions.get('window').width;
 
type ProgressBarProps = {
  currentStep: number;
  onStepPress?: (step: number) => void;
};
 
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onStepPress }) => {
  const steps = [
    { id: 1, label: '  Personal    Info' },
    { id: 2, label: 'Professional Details' },
    { id: 3, label: 'Upload Resume' },
  ];
 
  // Calculate dynamic line width based on screen size and number of steps
  const dynamicLineWidth = (screenWidth - steps.length * 60) / (steps.length - 1);
 
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
                  isCompleted && styles.completedStepCircle,
                  isActive || isCompleted ? { borderColor: 'transparent' } : {},
                ]}
>
<Text
                  style={[
                    styles.stepText,
                    isActive && styles.activeStepText,
                    isCompleted && styles.completedStepText,
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
                    { width: dynamicLineWidth }, // Dynamic width
                    isCompleted && styles.completedLine,
                    isActive && styles.activeLine,
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
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
    backgroundColor: '#F97316',
  },
  completedStepCircle: {
    backgroundColor: 'green',
  },
  stepText: {
    fontSize: 16,
    color: '#F97316',
  },
  activeStepText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  completedStepText: {
    fontWeight: 'bold',
    color: '#fff',
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
    height: 2,
    backgroundColor: '#F97316',
    zIndex: 0,
  },
  activeLine: {
    backgroundColor: '#F97316',
  },
  completedLine: {
    backgroundColor: 'green',
  },
});
 
export default ProgressBar;
 