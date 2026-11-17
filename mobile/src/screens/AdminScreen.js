import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../theme/colors";

export default function AdminScreen({ navigation, dark }) {
	const theme = dark ? darkColors : colors;
	const themed = styles(theme);

	const login = () => {
		alert("Admin login placeholder.");
	};

	return (
		<SafeAreaView style={themed.container}>
			<View style={themed.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={themed.backText}>← back</Text>
				</TouchableOpacity>
				<Text style={themed.title}>admin</Text>
				<View style={{ width: 40 }} />
			</View>
			<View style={themed.content}>
				<Text style={themed.heading}>admin portal</Text>
				<TextInput
					style={themed.input}
					placeholder="Email"
					placeholderTextColor={theme.neutralMediumGray}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={themed.input}
					placeholder="Password"
					placeholderTextColor={theme.neutralMediumGray}
					secureTextEntry
				/>
				<TouchableOpacity style={themed.button} onPress={login}>
					<Text style={themed.buttonText}>login</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = (theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.secondarySoftBeige,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: 16,
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: theme.primaryForestGreen,
		},
		backText: {
			color: theme.primaryForestGreen,
			fontSize: 14,
			fontWeight: "600",
		},
		title: {
			fontSize: 18,
			fontWeight: "700",
			color: theme.primaryForestGreen,
		},
		content: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: 24,
		},
		heading: {
			fontSize: 24,
			fontWeight: "700",
			color: theme.primaryForestGreen,
			marginBottom: 20,
		},
		input: {
			width: "100%",
			maxWidth: 320,
			borderWidth: 1,
			borderColor: theme.primaryForestGreen,
			borderRadius: 8,
			paddingHorizontal: 12,
			paddingVertical: 10,
			marginBottom: 12,
			backgroundColor: theme.primaryWarmWhite,
			color: theme.primaryForestGreen,
		},
		button: {
			backgroundColor: theme.primaryForestGreen,
			paddingVertical: 14,
			paddingHorizontal: 40,
			borderRadius: 8,
			alignItems: "center",
			marginTop: 8,
		},
		buttonText: {
			color: theme.primaryWarmWhite,
			fontWeight: "600",
			fontSize: 15,
		},
	});
