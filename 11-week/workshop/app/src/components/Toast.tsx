import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing, tokens } from '../constants/theme';

interface Props {
  mensaje: string;
  onOcultar: () => void;
  duracionMs?: number;
}

/** Aviso breve de exito que se oculta solo (equivalente a IonToast). */
export default function Toast({ mensaje, onOcultar, duracionMs = 2500 }: Props) {
  useEffect(() => {
    if (!mensaje) return;
    const temporizador = setTimeout(onOcultar, duracionMs);
    return () => clearTimeout(temporizador);
  }, [mensaje, onOcultar, duracionMs]);

  if (!mensaje) return null;
  return (
    <View style={styles.toast} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Text style={styles.texto}>✓ {mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: tokens.success,
    backgroundColor: colors.greenSoft,
  },
  texto: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', textAlign: 'center' },
});
