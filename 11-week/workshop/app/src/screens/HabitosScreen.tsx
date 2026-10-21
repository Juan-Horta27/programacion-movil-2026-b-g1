import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import Card from '../components/Card';
import ChipSelector from '../components/ChipSelector';
import DialogoConfirmacion from '../components/DialogoConfirmacion';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import ScreenHeader from '../components/ScreenHeader';
import SkeletonHabitos from '../components/SkeletonHabitos';
import Toast from '../components/Toast';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { FALLA_GUARDADO, simularPeticion } from '../services/simulacion';
import { validarHabito, type CamposHabito } from '../utils/validarHabito';

const FORMULARIO_VACIO = { nombre: '', descripcion: '', unidadMedida: '' };

type EstadoCarga = 'cargando' | 'listo' | 'error';

export default function HabitosScreen() {
  const {
    habitos,
    categorias,
    registros,
    metaActivaDe,
    rachaDe,
    categoriaPorId,
    crearHabito,
    eliminarHabito,
  } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [tocados, setTocados] = useState<Partial<Record<keyof CamposHabito, boolean>>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [confirmarDescarte, setConfirmarDescarte] = useState(false);
  const [avisoExito, setAvisoExito] = useState('');
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>('cargando');
  const [recargando, setRecargando] = useState(false);

  const cargarHabitos = useCallback(async () => {
    setEstadoCarga('cargando');
    try {
      await simularPeticion();
      setEstadoCarga('listo');
    } catch {
      setEstadoCarga('error');
    }
  }, []);

  useEffect(() => {
    cargarHabitos();
  }, [cargarHabitos]);

  const recargarHabitos = async () => {
    setRecargando(true);
    try {
      await simularPeticion();
    } catch {
      setEstadoCarga('error');
    } finally {
      setRecargando(false);
    }
  };

  const errores = validarHabito({ ...form, categoriaId });
  const hayErrores = Object.keys(errores).length > 0;
  const errorVisible = (campo: keyof CamposHabito) => (tocados[campo] ? errores[campo] : undefined);
  const tocar = (campo: keyof CamposHabito) => setTocados((previos) => ({ ...previos, [campo]: true }));
  const ocultarAviso = useCallback(() => setAvisoExito(''), []);

  const cerrarModal = () => {
    setModalVisible(false);
    setForm(FORMULARIO_VACIO);
    setCategoriaId(null);
    setTocados({});
    setErrorEnvio('');
    setConfirmarDescarte(false);
  };

  const solicitarCierre = () => {
    const hayDatos = Object.values(form).some((v) => v.trim()) || categoriaId !== null;
    if (hayDatos) setConfirmarDescarte(true);
    else cerrarModal();
  };

  const guardar = async () => {
    if (hayErrores || enviando || categoriaId === null) return;
    setEnviando(true);
    setErrorEnvio('');
    try {
      await simularPeticion(FALLA_GUARDADO);
      crearHabito({ ...form, categoriaHabitoId: categoriaId });
      setAvisoExito(`Habito "${form.nombre.trim()}" creado`);
      cerrarModal();
    } catch {
      setErrorEnvio('No se pudo guardar el habito. Revisa tu conexion e intentalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const confirmarEliminar = (id: number, nombre: string) => {
    Alert.alert('Eliminar habito', `¿Eliminar "${nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          const resultado = eliminarHabito(id);
          if (!resultado.ok) {
            Alert.alert('No se puede eliminar', resultado.mensaje);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      <View style={styles.contenido}>
        <ScreenHeader
          titulo="📌 Habitos"
          subtitulo={`${habitos.length} habitos registrados`}
          derecha={
            <Pressable
              style={styles.botonAgregar}
              onPress={() => setModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Crear habito"
            >
              <Text style={styles.botonAgregarTexto}>+</Text>
            </Pressable>
          }
        />

        {estadoCarga === 'cargando' && <SkeletonHabitos />}

        {estadoCarga === 'error' && (
          <EmptyState
            icono="⚠️"
            titulo="No se pudieron cargar tus habitos"
            mensaje="Revisa tu conexion e intentalo de nuevo."
            accion={{ titulo: 'Reintentar', onPress: cargarHabitos }}
          />
        )}

        {estadoCarga === 'listo' && (
          <FlatList
            data={habitos}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={recargando}
                onRefresh={recargarHabitos}
                tintColor={colors.teal}
                colors={[colors.teal]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icono="📌"
                titulo="Sin habitos"
                mensaje="Crea tu primer habito para empezar a hacer seguimiento."
                accion={{ titulo: '+ Crear habito', onPress: () => setModalVisible(true) }}
              />
            }
            renderItem={({ item }) => {
              const categoria = categoriaPorId(item.categoriaHabitoId);
              const meta = metaActivaDe(item.id);
              const racha = rachaDe(item.id);
              const totalRegistros = registros.filter((r) => r.habitoId === item.id).length;

              return (
                <Card>
                  <View style={styles.encabezado}>
                    <Text style={styles.icono} accessibilityElementsHidden importantForAccessibility="no">
                      {categoria?.icono ?? '🏷️'}
                    </Text>
                    <View style={styles.flex}>
                      <Text style={styles.nombre}>{item.nombre}</Text>
                      <Text style={styles.categoria}>{categoria?.nombre ?? 'Sin categoria'}</Text>
                    </View>
                    <Badge
                      texto={item.activo ? 'Activo' : 'Inactivo'}
                      color={item.activo ? colors.green : colors.muted}
                    />
                  </View>

                  {item.descripcion ? (
                    <Text style={styles.descripcion}>{item.descripcion}</Text>
                  ) : null}

                  <View style={styles.datos}>
                    <Dato etiqueta="Unidad" valor={item.unidadMedida} />
                    <Dato
                      etiqueta="Meta"
                      valor={meta ? String(meta.valorObjetivo) : '—'}
                    />
                    <Dato etiqueta="Racha" valor={`${racha.rachaActual} d`} />
                    <Dato etiqueta="Registros" valor={String(totalRegistros)} />
                  </View>

                  <AppButton
                    titulo="Eliminar"
                    variante="peligro"
                    onPress={() => confirmarEliminar(item.id, item.nombre)}
                    style={styles.botonEliminar}
                  />
                </Card>
              );
            }}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={solicitarCierre}
      >
        <View style={styles.fondoModal}>
          <View style={styles.hojaModal}>
            <View style={styles.agarre} />
            <Text style={styles.tituloModal}>Nuevo habito</Text>

            {errorEnvio ? (
              <Text style={styles.error} accessibilityRole="alert">
                ⚠️ {errorEnvio}
              </Text>
            ) : null}

            <View style={styles.formulario}>
              <Input
                etiqueta="Nombre *"
                valor={form.nombre}
                onChange={(texto) => {
                  setForm({ ...form, nombre: texto });
                  tocar('nombre');
                }}
                placeholder="Beber agua"
                error={errorVisible('nombre')}
              />
              <ChipSelector
                etiqueta="Categoria *"
                opciones={categorias.map((c) => ({
                  id: c.id,
                  etiqueta: `${c.icono} ${c.nombre}`,
                }))}
                seleccion={categoriaId}
                onSeleccionar={setCategoriaId}
              />
              {(tocados.nombre || tocados.unidadMedida) && errores.categoriaId ? (
                <Text style={styles.errorCampo}>{errores.categoriaId}</Text>
              ) : null}
              <Input
                etiqueta="Unidad de medida *"
                valor={form.unidadMedida}
                onChange={(texto) => {
                  setForm({ ...form, unidadMedida: texto });
                  tocar('unidadMedida');
                }}
                placeholder="vasos, minutos, horas..."
                error={errorVisible('unidadMedida')}
              />
              <Input
                etiqueta="Descripcion"
                valor={form.descripcion}
                onChange={(texto) => setForm({ ...form, descripcion: texto })}
                placeholder="Opcional"
                multilinea
              />
            </View>

            <View style={styles.accionesModal}>
              <AppButton
                titulo="Cancelar"
                variante="secundario"
                onPress={solicitarCierre}
                style={styles.flex}
              />
              <AppButton
                titulo="Guardar"
                onPress={guardar}
                deshabilitado={hayErrores}
                cargando={enviando}
                style={styles.flex}
              />
            </View>
          </View>
        </View>
        <DialogoConfirmacion
          visible={confirmarDescarte}
          titulo="¿Descartar este habito?"
          mensaje="Se perdera lo que escribiste en el formulario."
          textoConfirmar="Descartar"
          onConfirmar={cerrarModal}
          onCancelar={() => setConfirmarDescarte(false)}
        />
      </Modal>
      <Toast mensaje={avisoExito} onOcultar={ocultarAviso} />
    </SafeAreaView>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.datoEtiqueta}>{etiqueta}</Text>
      <Text style={styles.datoValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.bg },
  contenido: { flex: 1, padding: spacing.lg },
  flex: { flex: 1 },
  lista: { gap: spacing.md, paddingBottom: spacing.xxl },
  botonAgregar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAgregarTexto: { color: colors.bg, fontSize: 24, fontWeight: '800', lineHeight: 28 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icono: { fontSize: 26 },
  nombre: { color: colors.text, fontSize: fontSize.md + 1, fontWeight: '700' },
  categoria: { color: colors.muted, fontSize: fontSize.xs + 1, marginTop: 2 },
  descripcion: {
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: spacing.md,
    lineHeight: 19,
  },
  datos: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dato: { flex: 1 },
  datoEtiqueta: { color: colors.subtle, fontSize: fontSize.xs, fontWeight: '700' },
  datoValor: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', marginTop: 2 },
  botonEliminar: { marginTop: spacing.md },

  fondoModal: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  hojaModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
    borderTopWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    paddingBottom: spacing.xxl + spacing.md,
    gap: spacing.lg,
  },
  agarre: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  tituloModal: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
  error: { color: colors.red, fontSize: fontSize.sm },
  errorCampo: { color: colors.red, fontSize: fontSize.sm, marginTop: -spacing.md },
  formulario: { gap: spacing.lg },
  accionesModal: { flexDirection: 'row', gap: spacing.md },
});
