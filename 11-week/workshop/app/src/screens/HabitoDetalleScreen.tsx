import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import SkeletonHabitos from '../components/SkeletonHabitos';
import { colors, fontSize, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { simularPeticion } from '../services/simulacion';
import type { RootStackParamList } from '../types';
import { fechaCorta } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitoDetalle'>;

const FALLA_DETALLE = process.env.EXPO_PUBLIC_FALLA_DETALLE === '1';

export default function HabitoDetalleScreen({ navigation, route }: Props) {
  const id = Number(route.params.id);
  const { habitoPorId, categoriaPorId, metaActivaDe, rachaDe, registros } = useApp();
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');

  const cargar = useCallback(() => {
    setEstado('cargando');
    simularPeticion(FALLA_DETALLE)
      .then(() => setEstado('listo'))
      .catch(() => setEstado('error'));
  }, []);

  useEffect(cargar, [cargar, id]);

  const volver = () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Tabs'));
  const habito = habitoPorId(id);
  const ultimos = registros
    .filter((r) => r.habitoId === id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.pantalla} edges={['top', 'bottom']}>
      <Pressable onPress={volver} style={styles.volver} accessibilityRole="button" accessibilityLabel="Volver a Habitos">
        <Text style={styles.volverTexto}>‹ Habitos</Text>
      </Pressable>

      {estado === 'cargando' && <SkeletonHabitos />}

      {estado === 'error' && (
        <EmptyState
          icono="⚠️"
          titulo="No se pudo cargar el habito"
          mensaje="Revisa tu conexion e intentalo de nuevo."
          accion={{ titulo: 'Reintentar', onPress: cargar }}
        />
      )}

      {estado === 'listo' && !habito && (
        <EmptyState
          icono="🔍"
          titulo="Este habito no existe"
          mensaje={`No encontramos un habito con el numero ${route.params.id}. Puede que lo hayan eliminado.`}
          accion={{ titulo: 'Ver mis habitos', onPress: volver }}
        />
      )}

      {estado === 'listo' && habito && (
        <ScrollView contentContainerStyle={styles.contenido}>
          <View style={styles.encabezado}>
            <Text style={styles.nombre} accessibilityRole="header">
              {categoriaPorId(habito.categoriaHabitoId)?.icono} {habito.nombre}
            </Text>
            <Badge texto={habito.activo ? 'Activo' : 'Inactivo'} color={habito.activo ? colors.green : colors.muted} />
          </View>
          {habito.descripcion ? <Text style={styles.texto}>{habito.descripcion}</Text> : null}

          <Card>
            <Fila etiqueta="Categoria" valor={categoriaPorId(habito.categoriaHabitoId)?.nombre ?? 'Sin categoria'} />
            <Fila etiqueta="Frecuencia" valor={habito.frecuencia} />
            <Fila etiqueta="Meta activa" valor={metaActivaDe(id) ? `${metaActivaDe(id)?.valorObjetivo} ${habito.unidadMedida}` : 'Sin meta'} />
            <Fila etiqueta="Racha" valor={`${rachaDe(id).rachaActual} d (maxima ${rachaDe(id).rachaMaxima} d)`} />
          </Card>

          <AppButton titulo="Registrar avance" onPress={() => navigation.navigate('NuevoRegistro', { habitoId: id })} />

          <Text style={styles.subtitulo}>Ultimos registros</Text>
          {ultimos.length === 0 ? <Text style={styles.texto}>Todavia no hay registros de este habito.</Text> : null}
          {ultimos.map((r) => (
            <Fila key={r.id} etiqueta={fechaCorta(r.fecha)} valor={`${r.valorRegistrado} ${habito.unidadMedida}${r.metaCumplida ? ' · meta cumplida' : ''}`} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  contenido: { gap: spacing.lg, paddingBottom: spacing.xxl },
  volver: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  volverTexto: { color: colors.teal, fontSize: fontSize.md, fontWeight: '700' },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  nombre: { color: colors.text, fontSize: fontSize.xl, fontWeight: '800', flexShrink: 1 },
  texto: { color: colors.muted, fontSize: fontSize.sm },
  subtitulo: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, gap: spacing.md },
  etiqueta: { color: colors.muted, fontSize: fontSize.sm },
  valor: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});
