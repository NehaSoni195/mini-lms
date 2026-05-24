import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validate = () => {
    let valid = true;
    let newErrors = { email: "", password: "", general: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Wrong email address format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password is too short";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setErrors({ email: "", password: "", general: "" });

      await login(email, password);

      router.replace("/(tabs)");
    } catch (error) {
      let message = "Something went wrong. Try again.";

      const msg = error?.message?.toLowerCase?.() || "";

      if (msg.includes("user not found") || msg.includes("email not found")) {
        message = "Email is not registered";
      } else if (
        msg.includes("wrong password") ||
        msg.includes("invalid password")
      ) {
        message = "Wrong password";
      } else if (msg.includes("invalid credentials")) {
        message = "Wrong email address or password";
      } else if (msg.includes("network")) {
        message = "Network error. Check your internet connection";
      }

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={48} color="#111" />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your LMS account</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={[styles.input, errors.email && styles.inputError]}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={[styles.input, errors.password && styles.inputError]}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        {errors.general ? (
          <Text style={styles.errorBox}>{errors.general}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#fafafa",
  },

  inputError: {
    borderColor: "#ff4d4f",
  },

  errorText: {
    color: "#ff4d4f",
    marginBottom: 10,
    fontSize: 12,
  },

  errorBox: {
    color: "#d63031",
    padding: 10,

    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  link: {
    textAlign: "center",
    color: "#111",
    fontWeight: "600",
  },
});
