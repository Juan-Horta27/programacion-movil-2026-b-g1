import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonInput,
  IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { listarHabitos, crearHabito, Habito, SesionInvalidaError } from '../services/api';

/**
 * Pantalla principal: lista los hábitos (GET) y tiene un formulario que
 * crea uno nuevo (POST). El estado vive en useState.
 */

const Habitos: React.FC = () => {
  const navigate = useNavigate();
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 401: se vuelve al login con el mensaje. Cualquier otro error (por ejemplo,
  // sin conexión) se muestra en la tarjeta roja.
  const manejarError = useCallback((e: unknown) => {
    if (e instanceof SesionInvalidaError) {
      navigate('/login', { replace: true, state: { aviso: e.message } });
    } else {
      setError((e as Error).message);
    }
  }, [navigate]);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [meta, setMeta] = useState('');

  // Ubicación: coordenadas, o un mensaje si no se pudo obtener.
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [avisoUbicacion, setAvisoUbicacion] = useState<string | null>(null);

  // GET /habitos cuando la pantalla aparece.
  useEffect(() => {
    listarHabitos()
      .then(setHabitos)
      .catch(manejarError);
  }, [manejarError]);

  async function agregar() {
    setError(null);
    try {
      const nuevo = await crearHabito({ nombre, categoria, meta });
      // Se agrega el hábito que devolvió el servidor.
      setHabitos((previos) => [...previos, nuevo]);
      setNombre('');
      setCategoria('');
      setMeta('');
    } catch (e) {
      manejarError(e);
    }
  }

  async function obtenerUbicacion() {
    setCoords(null);
    setAvisoUbicacion(null);
    try {
      // Se pide el permiso solo si todavía no está concedido.
      let permiso = await Geolocation.checkPermissions();
      if (permiso.location !== 'granted') {
        permiso = await Geolocation.requestPermissions();
      }
      if (permiso.location !== 'granted') {
        setAvisoUbicacion(
          'No diste permiso de ubicación, así que no puedo mostrarla. ' +
          'Puedes activarlo en los ajustes del celular (Aplicaciones > miApp > Permisos).'
        );
        return;
      }
      const pos = await Geolocation.getCurrentPosition();
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch {
      setAvisoUbicacion(
        'No se pudo obtener la ubicación. Revisa que el permiso y el GPS estén activados e inténtalo de nuevo.'
      );
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hábitos Saludables</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        {/* Mi ubicación (Capacitor Geolocation) */}
        <IonCard>
          <IonCardContent>
            <IonButton expand="block" onClick={obtenerUbicacion}>
              Mi ubicación
            </IonButton>
            {coords && (
              <p className="ion-margin-top">
                Latitud: {coords.lat.toFixed(5)}<br />
                Longitud: {coords.lng.toFixed(5)}
              </p>
            )}
            {avisoUbicacion && (
              <p className="ion-margin-top">{avisoUbicacion}</p>
            )}
          </IonCardContent>
        </IonCard>

        {/* Formulario */}
        <IonCard>
          <IonCardContent>
            <IonInput
              label="Nombre"
              labelPlacement="stacked"
              placeholder="Ej: Beber agua"
              value={nombre}
              onIonInput={(e) => setNombre(e.detail.value ?? '')}
            />
            <IonInput
              label="Categoría"
              labelPlacement="stacked"
              placeholder="Ej: Hidratación"
              value={categoria}
              onIonInput={(e) => setCategoria(e.detail.value ?? '')}
            />
            <IonInput
              label="Meta"
              labelPlacement="stacked"
              placeholder="Ej: 8 vasos al día"
              value={meta}
              onIonInput={(e) => setMeta(e.detail.value ?? '')}
            />
            <IonButton expand="block" className="ion-margin-top" onClick={agregar}>
              Agregar hábito
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Error de red o del servidor */}
        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <strong>Error:</strong> {error}
            </IonCardContent>
          </IonCard>
        )}

        {/* Lista: cada elemento lleva al detalle */}
        <IonList>
          {habitos.map((h) => (
            <IonItem key={h.id} routerLink={`/habitos/${h.id}`} detail>
              <IonLabel>
                <h2>{h.nombre}</h2>
                <p>{h.categoria} · {h.meta}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Habitos;
