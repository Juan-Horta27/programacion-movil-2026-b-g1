import { DarkTheme, NavigationContainer, type LinkingOptions, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { colors } from '../constants/theme';
import HabitoDetalleScreen from '../screens/HabitoDetalleScreen';
import LoginScreen from '../screens/LoginScreen';
import NuevoRegistroScreen from '../screens/NuevoRegistroScreen';
import RegisterScreen from '../screens/RegisterScreen';
import type { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Tema de navegacion alineado con la paleta de la app. */
const temaOscuro: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    primary: colors.teal,
  },
};

/** En web el detalle tiene URL propia: /habitos/3 abre el habito con id 3. */
const enlaces: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      Tabs: { screens: { Habitos: 'habitos' } },
      HabitoDetalle: { path: 'habitos/:id', parse: { id: Number } },
    },
  },
};

/**
 * Stack raiz:
 *   Login / Registro  →  Tabs  →  HabitoDetalle / NuevoRegistro (modal)
 */
export default function AppNavigator() {
  return (
    <NavigationContainer theme={temaOscuro} linking={enlaces}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="HabitoDetalle" component={HabitoDetalleScreen} />
        <Stack.Screen
          name="NuevoRegistro"
          component={NuevoRegistroScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
