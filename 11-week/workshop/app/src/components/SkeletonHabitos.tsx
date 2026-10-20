import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';
import Card from './Card';

/** Tarjeta gris con la forma de un habito, mientras la lista carga. */
function TarjetaEsqueleto() {
  return (
    <Card>
      <View style={styles.encabezado}>
        <View style={styles.icono} />
        <View style={styles.textos}>
          <View style={[styles.barra, styles.nombre]} />
          <View style={[styles.barra, styles.categoria]} />
        </View>
      </View>
      <View style={[styles.barra, styles.datos]} />
    </Card>
  );
}

export default function SkeletonHabitos({ filas = 3 }: { filas?: number }) {
  return (
    <View style={styles.lista} accessibilityLabel="Cargando habitos">
      {Array.from({ length: filas }, (_, i) => (
        <TarjetaEsqueleto key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lista: { gap: spacing.md },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icono: { width: 32, height: 32, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  textos: { flex: 1, gap: spacing.sm },
  barra: { height: 12, borderRadius: radius.sm, backgroundColor: colors.surface2 },
  nombre: { width: '60%' },
  categoria: { width: '35%' },
  datos: { marginTop: spacing.lg, height: 28 },
});
