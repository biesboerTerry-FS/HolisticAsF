import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "../theme/colors";

export default function ProductsScreen({ navigation, dark }) {
	const theme = dark ? darkColors : colors;
	const themed = styles(theme);

	return (
		<SafeAreaView style={themed.container}>
			<View style={themed.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={themed.backText}>← back</Text>
				</TouchableOpacity>
				<Text style={themed.title}>products</Text>
				<View style={{ width: 40 }} />
			</View>
			<View style={themed.content}>
				<Text style={themed.body}>Product catalog coming soon.</Text>
				<Text style={themed.hint}>
					This screen will list Kroger and TheMealDB holistic items.
				</Text>
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
		body: {
			fontSize: 18,
			fontWeight: "600",
			color: theme.primaryForestGreen,
			marginBottom: 8,
			textAlign: "center",
		},
		hint: {
			fontSize: 14,
			color: theme.neutralMediumGray,
			textAlign: "center",
		},
	});
