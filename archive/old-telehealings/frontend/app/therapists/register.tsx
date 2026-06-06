// app/therapists/register.tsx
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function RegisterTherapistScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: '',
    licenseNumber: '',
    licenseType: '',
    licenseState: '',
    licenseExpiry: '',
    specializations: '',
    languages: '',
    hourlyRate: '',
    bio: '',
    experience: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Convert specializations and languages strings to arrays
    const specializationsArray = formData.specializations
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const languagesArray = formData.languages
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const therapistData = {
      ...formData,
      specializations: specializationsArray,
      languages: languagesArray,
      hourlyRate: parseFloat(formData.hourlyRate),
      experience: parseInt(formData.experience, 10),
    };

    try {
      const response = await fetch('http://localhost:3000/therapists/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(therapistData),
      });

      if (response.ok) {
        alert('Registration successful!');
        // Navigate to verification status or home
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Therapist Registration</Text>
      <Text style={styles.subtitle}>Step {step} of 3</Text>

      {step === 1 && (
        <>
          <TextInput
            placeholder="User ID"
            value={formData.userId}
            onChangeText={(text) => setFormData({ ...formData, userId: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="License Number"
            value={formData.licenseNumber}
            onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="License Type (e.g., LMFT, LCSW, PhD)"
            value={formData.licenseType}
            onChangeText={(text) => setFormData({ ...formData, licenseType: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="License State"
            value={formData.licenseState}
            onChangeText={(text) => setFormData({ ...formData, licenseState: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="License Expiry (YYYY-MM-DD)"
            value={formData.licenseExpiry}
            onChangeText={(text) => setFormData({ ...formData, licenseExpiry: text })}
            style={styles.input}
          />
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            placeholder="Specializations (comma separated)"
            value={formData.specializations}
            onChangeText={(text) => setFormData({ ...formData, specializations: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Languages (comma separated)"
            value={formData.languages}
            onChangeText={(text) => setFormData({ ...formData, languages: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Hourly Rate"
            value={formData.hourlyRate}
            onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            style={styles.input}
            multiline
          />
          <TextInput
            placeholder="Years of Experience"
            value={formData.experience}
            onChangeText={(text) => setFormData({ ...formData, experience: text })}
            style={styles.input}
            keyboardType="numeric"
          />
        </>
      )}

      {step === 3 && (
        <>
          <Text>Please review your information:</Text>
          <Text>User ID: {formData.userId}</Text>
          <Text>License: {formData.licenseNumber} ({formData.licenseType})</Text>
          <Text>Specializations: {formData.specializations}</Text>
          <Text>Languages: {formData.languages}</Text>
          <Text>Hourly Rate: ${formData.hourlyRate}</Text>
          <Text>Experience: {formData.experience} years</Text>
          <Text>Bio: {formData.bio}</Text>
        </>
      )}

      <View style={styles.buttonGroup}>
        {step > 1 && (
          <Button title="Back" onPress={handleBack} color="#6c63ff" />
        )}
        {step < 3 ? (
          <Button title="Next" onPress={handleNext} color="#4cc9f0" />
        ) : (
          <Button title="Submit Registration" onPress={handleSubmit} color="#4cc9f0" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'white',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
});