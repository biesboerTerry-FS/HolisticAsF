import { useState } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	useColorScheme,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, darkColors } from "./src/theme/colors";

const categories = [
	"Herbs & Botanicals",
	"Teas & Tonics",
	"Superfoods",
	"Supplements",
	"Pantry & Whole Foods",
	"Body & Wellness",
];

export default function App() {
	const systemTheme = useColorScheme();
	const [dark, setDark] = useState(systemTheme === "dark");
	const toggleTheme = () => setDark((prev) => !prev);
	const theme = dark ? darkColors : colors;

	const themed = styles(theme);

	return (
		<SafeAreaProvider>
			<StatusBar
				barStyle={dark ? "light-content" : "dark-content"}
				backgroundColor={theme.secondarySoftBeige}
			/>
			<SafeAreaView style={themed.container}>
				<View style={themed.nav}>
					<Text style={[themed.logo, dark && { color: "#e9b04a" }]}>holisticAF</Text>
					<View style={themed.navActions}>
						<TouchableOpacity onPress={toggleTheme} style={themed.iconBtn}>
							<Text style={themed.iconText}>{dark ? "☀" : "☾"}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={themed.loginBtn}>
							<Text style={themed.loginText}>login</Text>
						</TouchableOpacity>
					</View>
				</View>

				<ScrollView
					contentContainerStyle={themed.scroll}
					showsVerticalScrollIndicator={false}
				>
					<View style={[themed.hero, dark && { backgroundColor: "#163c35", borderColor: "#6cc3aa33" }]}>
						<Text style={[themed.heroTitle, dark && { color: "#f5f3ee" }]}>
							nourish with purpose - your food is your medicine.
						</Text>
						<View style={themed.heroActions}>
							<TouchableOpacity style={[themed.ctaBtn, dark && { backgroundColor: "#e9b04a" }]}>
								<Text style={themed.ctaText}>shop now</Text>
							</TouchableOpacity>
							<TouchableOpacity>
								<Text style={[themed.linkText, dark && { color: "#d9f2e8" }]}>see top sellers →</Text>
							</TouchableOpacity>
						</View>
					</View>

					<Text style={themed.sectionLabel}>EXPLORE</Text>
					<Text style={themed.sectionTitle}>
						shop by <Text style={themed.accentText}>category</Text>
					</Text>

					<View style={themed.categoryGrid}>
						{categories.map((cat) => (
							<TouchableOpacity key={cat} style={themed.categoryCard}>
								<Text style={themed.categoryTitle}>{cat}</Text>
								<Text style={themed.categoryHint}>browse →</Text>
							</TouchableOpacity>
						))}
					</View>

					<View style={themed.newsletter}>
						<Text style={[themed.newsletterTitle, dark && { color: "#d9f2e8" }]}>stay in the know</Text>
						<Text style={[themed.newsletterSubtitle, dark && { color: "#b7cbc4" }]}>
							subscribe to get the latest offers, new arrivals, and exclusive
							discounts
						</Text>
						<View style={themed.inputRow}>
							<TextInput
								style={themed.input}
								placeholder="Enter your email"
								placeholderTextColor={theme.neutralMediumGray}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							<TouchableOpacity style={themed.subscribeBtn}>
								<Text style={themed.subscribeText}>subscribe</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = (theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.secondarySoftBeige,
		},
		scroll: {
			padding: 16,
			paddingBottom: 40,
		},
		nav: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: 16,
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: theme.primaryForestGreen,
			backgroundColor: theme.secondarySoftBeige,
		},
		logo: {
			fontSize: 22,
			fontWeight: "700",
			color: theme.secondaryGoldenHoney,
		},
		navActions: {
			flexDirection: "row",
			alignItems: "center",
			gap: 12,
		},
		iconBtn: {
			width: 32,
			height: 32,
			borderRadius: 16,
			borderWidth: 1,
			borderColor: theme.primaryForestGreen,
			alignItems: "center",
			justifyContent: "center",
		},
		iconText: {
			fontSize: 14,
			color: theme.primaryForestGreen,
		},
		loginBtn: {
			backgroundColor: theme.secondaryGoldenHoney,
			paddingHorizontal: 16,
			paddingVertical: 6,
			borderRadius: 20,
		},
		loginText: {
			color: theme.neutralCharcoal,
			fontWeight: "600",
			fontSize: 13,
		},
		hero: {
			borderRadius: 24,
			overflow: "hidden",
			backgroundColor: theme.primaryForestGreen,
			padding: 24,
			marginBottom: 32,
			borderWidth: 1,
			borderColor: `${theme.primaryForestGreen}33`,
		},
		heroTitle: {
			fontSize: 28,
			fontWeight: "700",
			color: theme.secondaryGoldenHoney,
			fontStyle: "italic",
			marginBottom: 20,
			maxWidth: 280,
		},
		heroActions: {
			flexDirection: "row",
			alignItems: "center",
			gap: 16,
		},
		ctaBtn: {
			backgroundColor: theme.secondaryGoldenHoney,
			paddingHorizontal: 20,
			paddingVertical: 10,
			borderRadius: 6,
		},
		ctaText: {
			color: theme.neutralCharcoal,
			fontWeight: "600",
		},
		linkText: {
			color: theme.secondaryGoldenHoney,
			fontWeight: "500",
		},
		sectionLabel: {
			fontSize: 11,
			fontWeight: "700",
			letterSpacing: 2,
			color: theme.primaryForestGreen,
			textTransform: "uppercase",
			marginBottom: 4,
		},
		sectionTitle: {
			fontSize: 28,
			fontWeight: "700",
			color: theme.primaryForestGreen,
			marginBottom: 16,
		},
		accentText: {
			color: theme.secondaryGoldenHoney,
		},
		categoryGrid: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 12,
			marginBottom: 32,
		},
		categoryCard: {
			width: "47%",
			flexGrow: 1,
			minHeight: 96,
			padding: 16,
			borderRadius: 16,
			backgroundColor: theme.primaryWarmWhite,
			borderWidth: 1,
			borderColor: `${theme.primaryForestGreen}1a`,
			justifyContent: "space-between",
		},
		categoryTitle: {
			fontSize: 15,
			fontWeight: "600",
			color: theme.primaryForestGreen,
		},
		categoryHint: {
			fontSize: 12,
			color: theme.neutralMediumGray,
			marginTop: 8,
		},
		newsletter: {
			alignItems: "center",
			marginTop: 16,
		},
		newsletterTitle: {
			fontSize: 24,
			fontWeight: "600",
			color: theme.primaryForestGreen,
			marginBottom: 6,
		},
		newsletterSubtitle: {
			fontSize: 14,
			color: theme.primaryForestGreen,
			textAlign: "center",
			marginBottom: 20,
		},
		inputRow: {
			flexDirection: "row",
			width: "100%",
			maxWidth: 500,
			height: 44,
		},
		input: {
			flex: 1,
			borderWidth: 1,
			borderColor: theme.primaryForestGreen,
			borderRightWidth: 0,
			borderTopLeftRadius: 6,
			borderBottomLeftRadius: 6,
			paddingHorizontal: 12,
			backgroundColor: theme.primaryWarmWhite,
			color: theme.primaryForestGreen,
		},
		subscribeBtn: {
			backgroundColor: theme.primaryForestGreen,
			paddingHorizontal: 20,
			justifyContent: "center",
			borderTopRightRadius: 6,
			borderBottomRightRadius: 6,
		},
		subscribeText: {
			color: theme.primaryWarmWhite,
			fontWeight: "500",
		},
	});
