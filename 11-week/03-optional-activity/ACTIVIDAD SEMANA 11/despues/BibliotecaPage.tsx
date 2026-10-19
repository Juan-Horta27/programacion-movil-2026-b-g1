// DESPUÉS del rediseño: Biblioteca con una acción principal y los tres estados.
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useCallback, useEffect, useState } from 'react';
import { cargarPartituras, type Partitura } from '../partituras';

type Estado = 'cargando' | 'datos' | 'error';

const BibliotecaPage: React.FC = () => {
  const [estado, setEstado] = useState<Estado>('cargando');
  const [partituras, setPartituras] = useState<Partitura[]>([]);

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      setPartituras(await cargarPartituras());
      setEstado('datos');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Biblioteca</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {estado === 'cargando' && (
          <div className="ion-text-center" role="status">
            <IonSpinner />
            <p>Cargando tus partituras…</p>
          </div>
        )}

        {estado === 'error' && (
          <div className="ion-text-center" role="alert">
            <h2>No se pudo cargar la biblioteca</h2>
            <p>Revisa tu conexión e inténtalo de nuevo.</p>
            <IonButton size="large" onClick={() => void cargar()}>
              Reintentar
            </IonButton>
          </div>
        )}

        {estado === 'datos' && partituras.length === 0 && (
          <div className="ion-text-center">
            <h2>Aún no tienes partituras</h2>
            <p>Toca el botón + para cargar tu primer PDF.</p>
          </div>
        )}

        {estado === 'datos' && partituras.length > 0 && (
          <IonList>
            {partituras.map((partitura) => (
              <IonItem key={partitura.id} routerLink={`/biblioteca/${partitura.id}`} detail>
                <IonLabel>
                  <h2>{partitura.titulo}</h2>
                  <p>
                    {partitura.compositor} · {partitura.instrumento}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {estado === 'datos' && (
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton aria-label="Cargar partitura en PDF">
              <IonIcon icon={add} aria-hidden="true" />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BibliotecaPage;
