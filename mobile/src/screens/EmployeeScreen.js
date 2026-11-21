import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import {
  DEMO_EMPLOYEE,
  fetchEmployeeProfile,
  fetchEmployeeShifts,
  setCachedEmployee,
  updateEmployeeProfile,
} from "../api/employee";

const displayDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function EmployeeScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme, dark);
  const [profile, setProfile] = useState(DEMO_EMPLOYEE);
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [localOnly, setLocalOnly] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchEmployeeProfile(), fetchEmployeeShifts()])
      .then(([employee, shiftList]) => {
        if (!active) return;
        setProfile(employee);
        setShifts(shiftList);
        setForm({
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          address: employee.address || "",
        });
      })
      .catch(() => {
        // The API helpers already fall back to bundled demo data.
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    if (!form.name.trim()) return;
    const result = await updateEmployeeProfile({
      employeeId: profile.employeeId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    setProfile(result.employee);
    setLocalOnly(result.local);
  };

  const signOut = () => {
    setCachedEmployee(null);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>employee portal</Text>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={themed.content}>
        <Text style={themed.heading}>My details</Text>
        <Text style={themed.hint}>Your information and upcoming shifts only.</Text>

        {localOnly ? (
          <Text style={themed.notice}>
            Backend unavailable — changes are saved on this device for this session.
          </Text>
        ) : null}

        {loading ? (
          <Text style={themed.hint}>Loading your profile…</Text>
        ) : (
          <>
            <View style={themed.infoCard}>
              {[
                ["Name", profile.name],
                ["Position", profile.position],
                ["Email", profile.email],
                ["Phone", profile.phone],
                ["Address", profile.address],
              ].map(([label, value]) => (
                <View key={label} style={themed.infoRow}>
                  <Text style={themed.infoLabel}>{label}</Text>
                  <Text style={themed.infoValue}>{value || "—"}</Text>
                </View>
              ))}
            </View>

            <Text style={themed.section}>Upcoming shifts</Text>
            {shifts.length === 0 ? (
              <Text style={themed.hint}>No upcoming shifts.</Text>
            ) : (
              shifts.map((shift) => (
                <View key={shift._id || shift.date} style={themed.shiftCard}>
                  <Text style={themed.shiftDate}>{displayDate(shift.date)}</Text>
                  <Text style={themed.shiftDetail}>
                    {shift.startTime}–{shift.endTime}
                    {shift.role ? ` • ${shift.role}` : ""}
                  </Text>
                </View>
              ))
            )}

            <Text style={themed.section}>Edit my info</Text>
            <Text style={themed.hint}>Only name, email, phone, and address can be changed.</Text>
            {[
              ["name", "Name", "default"],
              ["email", "Email", "email-address"],
              ["phone", "Phone", "phone-pad"],
            ].map(([field, label, keyboard]) => (
              <TextInput
                key={field}
                style={themed.input}
                placeholder={label}
                placeholderTextColor={theme.neutralMediumGray}
                keyboardType={keyboard}
                autoCapitalize={field === "email" ? "none" : "sentences"}
                value={form[field]}
                onChangeText={(value) => setForm((prev) => ({ ...prev, [field]: value }))}
              />
            ))}
            <TextInput
              style={[themed.input, { height: 80 }]}
              placeholder="Address"
              placeholderTextColor={theme.neutralMediumGray}
              multiline
              value={form.address}
              onChangeText={(value) => setForm((prev) => ({ ...prev, address: value }))}
            />
            <TouchableOpacity style={themed.button} onPress={save}>
              <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
                save changes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
              <Text style={themed.guest}>sign out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme, dark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "transparent" },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryForestGreen,
    },
    backText: { color: theme.secondaryGoldenHoney, fontWeight: "600" },
    title: { fontSize: 18, fontWeight: "700", color: theme.primaryForestGreen },
    content: { padding: 16, paddingBottom: 40 },
    heading: { fontSize: 26, fontWeight: "700", color: theme.primaryForestGreen },
    hint: { fontSize: 13, color: theme.neutralMediumGray, marginTop: 6, marginBottom: 18 },
    notice: {
      fontSize: 12,
      color: theme.primaryForestGreen,
      backgroundColor: `${theme.secondaryGoldenHoney}18`,
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
    },
    infoCard: {
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderColor: `${theme.primaryForestGreen}1a`,
      borderRadius: 16,
      padding: 14,
      marginBottom: 20,
    },
    infoRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: `${theme.primaryForestGreen}12` },
    infoLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5, color: theme.neutralMediumGray },
    infoValue: { fontSize: 15, color: theme.primaryForestGreen, marginTop: 3 },
    section: { fontSize: 20, fontWeight: "700", color: theme.primaryForestGreen, marginBottom: 8, marginTop: 8 },
    shiftCard: {
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderColor: `${theme.primaryForestGreen}1a`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    shiftDate: { fontSize: 15, fontWeight: "700", color: theme.primaryForestGreen },
    shiftDetail: { fontSize: 13, color: theme.neutralMediumGray, marginTop: 3 },
    input: {
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
      backgroundColor: theme.primaryWarmWhite,
      color: theme.primaryForestGreen,
    },
    button: {
      backgroundColor: theme.secondaryGoldenHoney,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: { fontWeight: "600" },
    guest: {
      color: theme.primaryForestGreen,
      textAlign: "center",
      marginTop: 18,
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });
