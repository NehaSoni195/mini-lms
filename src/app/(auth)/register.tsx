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

export default function RegisterScreen() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    general: "",
  });

  const validate = () => {
    let valid = true;

    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      general: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
      valid = false;
    }

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
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setErrors({
        fullName: "",
        email: "",
        password: "",
        general: "",
      });

      await register(fullName, email, password);

      router.replace("/(tabs)");
    } catch (error) {
      let message = "Something went wrong";

      const msg = error?.message?.toLowerCase?.() || "";

      if (msg.includes("email already")) {
        message = "Email is already registered";
      } else if (msg.includes("invalid email")) {
        message = "Wrong email address";
      } else if (msg.includes("weak password")) {
        message = "Password is too weak";
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

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our LMS platform</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#999"
          style={[styles.input, errors.fullName && styles.inputError]}
          onChangeText={setFullName}
          value={fullName}
        />
        {errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}

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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
    backgroundColor: "#ffe6e6",
    color: "#d63031",
    padding: 10,
    borderRadius: 10,
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
