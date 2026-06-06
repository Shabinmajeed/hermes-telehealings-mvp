// app/therapists/profile.tsx
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TherapistProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { therapistId } = route.params || {};

  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    hourlyRate: '',
    specializations: '',
    languages: '',
  });

  useEffect(() => {
    if (therapistId) {
      fetchTherapist();
    }
  }, [therapistId]);

  const fetchTherapist = async () => {
    try {
      const response = await fetch(`http://localhost:3000/therapists/${therapistId}`);
      if (response.ok) {
        const data = await response.json();
        setTherapist(data);
        setFormData({
          bio: data.bio || '',
          experience: data.experience?.toString() || '',
          hourlyRate: data.hourlyRate?.toString() || '',
          specializations: (data.specializations || []).join(', '),
          languages: (data.languages || []).join(', '),
        });
      } else {
        Alert.alert('Error', 'Failed to load therapist data');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/therapists/${therapistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: formData.bio,
          experience: parseInt(formData.experience, 10),
          hourlyRate: parseFloat(formData.hourlyRate),
          specializations: formData.specializations
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          languages: formData.languages
            .split(',')
            .map((l) => l.trim())
            .filter((l) => l.length > 0),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading therapist profile...</Text>
      </View>
    );
  }

  if (!therapist) {
    return (
      <View style={styles.container}>
        <Text>Therapist not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Therapist Profile</Text>
        <Button title="Back" onPress={() => navigation.goBack()} color="#6c63ff" />
      </View>

      {therapist.licenseVerified && (
        <View style={styles.verificationBadge}>
          <Text style={styles.verifiedText}>Verified Therapist</Text>
        </View>
      )}

      <View style={statsContainer}>
        <View style={statBox}>
          <Text style={statLabel}>Rating</Text>
          <Text style={statValue}>{therapist.rating?.toFixed(1) || '0.0'}</Text>
        </View>
        <View style={statBox}>
          <Text style={statLabel}>Reviews</Text>
          <Text style={statValue}>{therapist.reviewCount || 0}</Text>
        </View>
        <View style={statBox}>
          <Text style={statLabel}>Experience</Text>
          <Text style={statValue}>{therapist.experience || 0} years</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <TextInput
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          style={styles.input}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specializations</Text>
        <TextInput
          placeholder="Specializations (comma separated)"
          value={formData.specializations}
          onChangeText={(text) => setFormData({ ...formData, specializations: text })}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <TextInput
          placeholder="Languages (comma separated)"
          value={formData.languages}
          onChangeText={(text) => setFormData({ ...formData, languages: text })}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience (Years)</Text>
        <TextInput
          placeholder="Years of experience"
          value={formData.experience}
          onChangeText={(text) => setFormData({ ...formData, experience: text })}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hourly Rate ($)</Text>
        <TextInput
          placeholder="Hourly rate"
          value={formData.hourlyRate}
          onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      <Button title="Save Profile" onPress={handleSave} style={styles.saveButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  verificationBadge: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  verifiedText: {
    color: '#155724',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 90,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
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
  saveButton: {
    backgroundColor: '#4cc9f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

const saveButtonText = {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
};