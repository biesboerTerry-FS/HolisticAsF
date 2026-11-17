import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../theme/colors";

export default function ContactScreen({ navigation, dark }) {
	const theme = dark ? darkColors : colors;
	const themed = styles(theme);

	const submit = () => {
		alert("Message sent! We'll get back to you soon.");
	};

	return (
		<SafeAreaView style={themed.container}>
			<View style={themed.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={themed.backText}>← back</Text>
				</TouchableOpacity>
				<Text style={themed.title}>contact</Text>
				<View style={{ width: 40 }} />
			</View>
			<ScrollView contentContainerStyle={themed.scroll}>
				<Text style={themed.heading}>get in touch</Text>
				<TextInput style={themed.input} placeholder="Name" placeholderTextColor={theme.neutralMediumGray} />
				<TextInput
					style={themed.input}
					placeholder="Email"
					placeholderTextColor={theme.neutralMediumGray}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={[themed.input, themed.message]}
					placeholder="Message"
					placeholderTextColor={theme.neutralMediumGray}
					multiline
					numberOfLines={4}
					textAlignVertical="top"
				/>
				<TouchableOpacity style={themed.button} onPress={submit}>
					<Text style={themed.buttonText}>send message</Text>
				</TouchableOpacity>
			</ScrollView>
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
		scroll: {
			padding: 16,
			paddingBottom: 40,
		},
		heading: {
			fontSize: 24,
			fontWeight: "700",
			color: theme.primaryForestGreen,
			marginBottom: 20,
		},
		input: {
			borderWidth: 1,
			borderColor: theme.primaryForestGreen,
			borderRadius: 8,
			paddingHorizontal: 12,
			paddingVertical: 10,
			marginBottom: 12,
			backgroundColor: theme.primaryWarmWhite,
			color: theme.primaryForestGreen,
		},
		message: {
			height: 120,
			paddingTop: 10,
		},
		button: {
			backgroundColor: theme.primaryForestGreen,
			paddingVertical: 14,
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
