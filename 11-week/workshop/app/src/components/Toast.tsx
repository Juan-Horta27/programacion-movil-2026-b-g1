import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing, tokens } from '../constants/theme';

interface Props {
  mensaje: string;
  onOcultar: () => void;
  duracionMs?: number;
  tipo?: 'exito' | 'error';
}

/** Aviso breve que se oculta solo (equivalente a IonToast). Verde si sale bien, rojo si no. */
export default function Toast({ mensaje, onOcultar, duracionMs = 2500, tipo = 'exito' }: Props) {
  useEffect(() => {
    if (!mensaje) return;
    const temporizador = setTimeout(onOcultar, duracionMs);
    return () => clearTimeout(temporizador);
  }, [mensaje, onOcultar, duracionMs]);

  if (!mensaje) return null;
  const esError = tipo === 'error';
  return (
    <View
      style={[styles.toast, esError && styles.toastError]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.texto}>
        {esError ? '⚠️' : '✓'} {mensaje}
      </Text>
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
  toastError: { borderColor: tokens.error, backgroundColor: colors.redSoft },
  texto: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', textAlign: 'center' },
});
