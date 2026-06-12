import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import api from '@services/api';

/*
 * Design ref: Design HTML/User (mobile)/workflows/login/login.html
 * Colors, spacing, and layout match the HTML design token-for-token.
 *
 * Key design tokens from the HTML:
 *   -- Top bg gradient: #cbe0f9 -> #e2effa
 *   -- Title color: #1e5ab8
 *   -- Subtitle color: #4f6885
 *   -- Input border: #cbd5e1, focus: #3b82f6
 *   -- Input label bg: #ffffff, color: #64748b
 *   -- Forgot password: #387bd5
 *   -- Divider text: #94a3b8
 *   -- Social border: rgba(0,0,0,0.05), shadow 0 6px 15px rgba(0,0,0,0.03)
 *   -- Signup link: #64748b / #387bd5 bold
 *   -- Login btn gradient: matches .btn-primary (#3b82f6 -> #1d4ed8)
 *   -- Eye icon color: #94a3b8
 */

/* ── Inline SVG icon primitives (no emoji, no library) ── */

const BackArrowIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    {/* Horizontal line */}
    <View style={{ position: 'absolute', width: 14, height: 2.5, backgroundColor: '#1e5ab8', borderRadius: 1.25, left: 5, top: 10.75 }} />
    {/* Arrowhead top */}
    <View style={{ position: 'absolute', width: 8, height: 2.5, backgroundColor: '#1e5ab8', borderRadius: 1.25, transform: [{ rotate: '45deg' }], left: 4, top: 8.5 }} />
    {/* Arrowhead bottom */}
    <View style={{ position: 'absolute', width: 8, height: 2.5, backgroundColor: '#1e5ab8', borderRadius: 1.25, transform: [{ rotate: '-45deg' }], left: 4, top: 13 }} />
  </View>
);

const ArrowRightIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ position: 'absolute', width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 1, left: 4, top: 9 }} />
    <View style={{ position: 'absolute', width: 7, height: 7, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#ffffff', transform: [{ rotate: '45deg' }], right: 4, top: 6.5 }} />
  </View>
);

const EyeIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    {/* Eye outline - ellipse approximation */}
    <View style={{
      width: 18,
      height: 11,
      borderWidth: 1.5,
      borderColor: '#94a3b8',
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Pupil */}
      <View style={{
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#94a3b8',
      }} />
    </View>
  </View>
);

const EyeOffIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    {/* Eye outline */}
    <View style={{
      width: 18,
      height: 11,
      borderWidth: 1.5,
      borderColor: '#94a3b8',
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#94a3b8',
      }} />
    </View>
    {/* Diagonal strike line */}
    <View style={{
      position: 'absolute',
      width: 22,
      height: 1.5,
      backgroundColor: '#94a3b8',
      borderRadius: 0.75,
      transform: [{ rotate: '-45deg' }],
    }} />
  </View>
);

export default function LoginPage() {
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  /* Entrance animation — slideFadeUp matching the CSS @keyframes */
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const response = await api.login(emailOrPhone.trim(), password);
      if (response.data?.user) {
        router.replace('/(tabs)');
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please try again.';
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: navigate to forgot password flow
  };

  const handleGoogleLogin = () => {
    // TODO: integrate Google auth
  };

  const handleAppleLogin = () => {
    // TODO: integrate Apple auth
  };

  const handleSignUp = () => {
    router.push('/soft-onboarding');
  };

  return (
    <View style={styles.loginContainer}>
      <StatusBar style="dark" />

      {/* ═══ Top Curved Section ═══ */}
      <LinearGradient
        colors={['#cbe0f9', '#e2effa']}
        style={styles.topBgCurve}
      >
        {/* Header Row: Back | Title | Heali */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <BackArrowIcon />
          </TouchableOpacity>

          <Text style={styles.title}>Welcome Back</Text>

          <View style={styles.headerHeali}>
            <Image
              source={require('../../src/assets/images/Heali.png')}
              style={styles.healiImg}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.subtitle}>Log in to continue your wellness journey.</Text>
      </LinearGradient>

      {/* ═══ Form Section ═══ */}
      <Animated.View
        style={[
          styles.formSection,
          {
            opacity: formAnim,
            transform: [
              {
                translateY: formAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Email or Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email or Phone</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Enter your email or phone"
            placeholderTextColor="#94a3b8"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Enter your password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setPasswordVisible(!passwordVisible)}
            activeOpacity={0.6}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          activeOpacity={0.7}
          style={styles.forgotPasswordWrapper}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Error Message */}
        {loginError && (
          <Text
            style={{
              color: '#ef4444',
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 12,
              fontWeight: '500',
            }}
          >
            {loginError}
          </Text>
        )}

        {/* Login Button — .btn-primary style */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={isLoggingIn}
          style={styles.loginButtonWrapper}
        >
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginButton}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Login</Text>
                <ArrowRightIcon />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.dividerText}>Or login with</Text>

        {/* Social Buttons */}
        <View style={styles.socialGroup}>
          <TouchableOpacity
            style={styles.btnSocial}
            activeOpacity={0.8}
            onPress={handleGoogleLogin}
          >
            <Image
              source={require('../../src/assets/images/google.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSocial}
            activeOpacity={0.8}
            onPress={handleAppleLogin}
          >
            <Image
              source={require('../../src/assets/images/apple.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupLinkWrapper}>
          <Text style={styles.signupLink}>
            Don't have an account?{' '}
            <Text style={styles.signupLinkBold} onPress={handleSignUp}>
              Sign Up
            </Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = {
  /* Layout: full-height white bg, no scroll */
  loginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  } as const,

  /* Top curved section — matches .top-bg-curve */
  topBgCurve: {
    paddingTop: 48,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  } as const,

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  } as const,

  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } as const,

  title: {
    flex: 1,
    textAlign: 'center' as const,
    color: '#1e5ab8',
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  } as const,

  headerHeali: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } as const,

  healiImg: {
    width: 36,
    height: 36,
  } as const,

  subtitle: {
    color: '#4f6885',
    fontSize: 14,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    lineHeight: 20,
    paddingHorizontal: 10,
  } as const,

  /* Form section — flex: 1, no ScrollView, matches .form-section */
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  } as const,

  /* Floating label input group — matches .input-group */
  inputGroup: {
    position: 'relative' as const,
    marginBottom: 24,
  } as const,

  inputLabel: {
    position: 'absolute' as const,
    top: -8,
    left: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#64748b',
    zIndex: 1,
  } as const,

  customInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#1a293b',
  } as const,

  passwordToggle: {
    position: 'absolute' as const,
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: 30,
  } as const,

  forgotPasswordWrapper: {
    alignItems: 'flex-end' as const,
    marginTop: -12,
    marginBottom: 32,
  } as const,

  forgotPassword: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#387bd5',
  } as const,

  /* Login button — matches .btn-primary */
  loginButtonWrapper: {
    width: '100%',
    marginBottom: 0,
  } as const,

  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  } as const,

  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  } as const,

  /* Divider — matches .divider-text with margin-top: auto behavior */
  dividerText: {
    textAlign: 'center' as const,
    marginTop: 40,
    marginBottom: 30,
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500' as const,
  } as const,

  /* Social buttons — matches .social-group */
  socialGroup: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 20,
    marginBottom: 20,
  } as const,

  btnSocial: {
    flex: 1,
    maxWidth: 140,
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 25,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  } as const,

  socialIcon: {
    width: 18,
    height: 18,
  } as const,

  socialText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1a293b',
  } as const,

  /* Sign up link — matches .signup-link */
  signupLinkWrapper: {
    alignItems: 'center' as const,
    marginTop: 32,
  } as const,

  signupLink: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  } as const,

  signupLinkBold: {
    color: '#387bd5',
    fontWeight: '700' as const,
  } as const,
};
