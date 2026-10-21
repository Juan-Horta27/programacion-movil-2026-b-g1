import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '../constants/theme';
import AppButton from './AppButton';

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Confirmacion antes de una accion destructiva (equivalente a IonAlert; Alert.alert no se ve en web). */
export default function DialogoConfirmacion(props: Props) {
  return (
    <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onCancelar}>
      <View style={styles.fondo}>
        <View style={styles.caja} accessibilityRole="alert">
          <Text style={styles.titulo}>{props.titulo}</Text>
          <Text style={styles.mensaje}>{props.mensaje}</Text>
          <View style={styles.acciones}>
            <AppButton titulo="Volver" variante="secundario" onPress={props.onCancelar} style={styles.flex} />
            <AppButton titulo={props.textoConfirmar} variante="peligro" onPress={props.onConfirmar} style={styles.flex} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', padding: spacing.xl },
  caja: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  titulo: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
  mensaje: { color: colors.muted, fontSize: fontSize.md },
  acciones: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  flex: { flex: 1 },
});
