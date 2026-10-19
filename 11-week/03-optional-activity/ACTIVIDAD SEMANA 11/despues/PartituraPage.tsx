// Detalle de una partitura: segunda pantalla del stack (Biblioteca → Detalle).
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cargarPartitura, type Partitura } from '../partituras';

type Estado = 'cargando' | 'datos' | 'no-encontrada' | 'error';

const PartituraPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [estado, setEstado] = useState<Estado>('cargando');
  const [partitura, setPartitura] = useState<Partitura>();

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      const encontrada = await cargarPartitura(Number(id));
      setPartitura(encontrada);
      setEstado(encontrada ? 'datos' : 'no-encontrada');
    } catch {
      setEstado('error');
    }
  }, [id]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/biblioteca"
              text="Biblioteca"
              style={{ '--min-height': '44px' } as React.CSSProperties}
            />
          </IonButtons>
          <IonTitle>Partitura</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {estado === 'cargando' && (
          <div className="ion-text-center" role="status">
            <IonSpinner />
            <p>Cargando la partitura…</p>
          </div>
        )}

        {estado === 'error' && (
          <div className="ion-text-center" role="alert">
            <h2>No se pudo cargar la partitura</h2>
            <p>Revisa tu conexión e inténtalo de nuevo.</p>
            <IonButton size="large" onClick={() => void cargar()}>
              Reintentar
            </IonButton>
          </div>
        )}

        {estado === 'no-encontrada' && (
          <div className="ion-text-center">
            <h2>Esta partitura no existe</h2>
            <p>Vuelve a la Biblioteca y elige otra.</p>
          </div>
        )}

        {estado === 'datos' && partitura && (
          <>
            <h1>{partitura.titulo}</h1>
            <p>{partitura.compositor}</p>
            <p>Instrumento: {partitura.instrumento}</p>
            <p>Tempo sugerido: {partitura.tempo} BPM</p>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PartituraPage;
