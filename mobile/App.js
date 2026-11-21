import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { CartProvider } from "./src/context/CartContext";
import HomeScreen from "./src/screens/HomeScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AdminScreen from "./src/screens/AdminScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import AdminListScreen from "./src/screens/AdminListScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Admin" component={AdminScreen} />
            <Stack.Screen name="AdminList" component={AdminListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </ThemeProvider>
  );
}
