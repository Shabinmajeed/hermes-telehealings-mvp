import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Please enter email and password'); return; }
    setLoading(true); setError('');
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={['#ffffff', '#eef5fc', '#7aaaf6']} style={styles.bg}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.btnWrap}>
            <LinearGradient colors={['#387BD5', '#2366BD']} style={styles.btn}>
              <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Don't have an account? <Text style={styles.link} onPress={() => router.push('/register')}>Sign Up</Text>
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
