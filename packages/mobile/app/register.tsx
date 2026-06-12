import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all fields'); return;
    }
    setLoading(true); setError('');
    try {
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={['#ffffff', '#eef5fc', '#7aaaf6']} style={styles.bg}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join TeleHealings and start your wellness journey</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#94a3b8" value={name} onChangeText={setName} autoCapitalize="words" />
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#94a3b8" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.btnWrap}>
            <LinearGradient colors={['#387BD5', '#2366BD']} style={styles.btn}>
              <Text style={styles.btnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Already a member? <Text style={styles.link} onPress={() => router.push('/login')}>Login</Text>
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 35, elevation: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#0745b1', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  error: { color: '#ef4444', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  input: { width: '100%', height: 52, paddingHorizontal: 20, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, fontSize: 15, color: '#1a293b', marginBottom: 16 },
  btnWrap: { marginTop: 8, marginBottom: 16 },
  btn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backBtn: { alignItems: 'center', marginBottom: 16 },
  backText: { color: '#387bd5', fontSize: 14, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 14, color: '#64748b' },
  link: { color: '#387bd5', fontWeight: '700' },
});
