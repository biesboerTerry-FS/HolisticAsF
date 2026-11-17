import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AdminScreen from "./src/screens/AdminScreen";

const Stack = createNativeStackNavigator();

export default function App() {
	const systemTheme = useColorScheme();
	const [dark, setDark] = useState(systemTheme === "dark");
	const toggleTheme = () => setDark((prev) => !prev);

	const withTheme = (Component) =>
		function ThemedScreen(props) {
			return <Component {...props} dark={dark} toggleTheme={toggleTheme} />;
		};

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="Home" component={withTheme(HomeScreen)} />
				<Stack.Screen name="Products" component={withTheme(ProductsScreen)} />
				<Stack.Screen name="Category" component={withTheme(CategoryScreen)} />
				<Stack.Screen name="Contact" component={withTheme(ContactScreen)} />
				<Stack.Screen name="Admin" component={withTheme(AdminScreen)} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
