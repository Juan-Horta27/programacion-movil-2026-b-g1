import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { obtenerHabito, Habito, SesionInvalidaError } from '../services/api';

/**
 * Pantalla de detalle de un hábito.
 * La API solo expone GET /habitos y POST /habitos, así que el hábito se busca
 * con el id de la ruta en la lista que ya cargó la pantalla principal.
 */

const DetalleHabito: React.FC = () => {
  // useParams entrega los parámetros de la ruta siempre como texto.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [habito, setHabito] = useState<Habito | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Igual que en la lista: navigate cambia con cada ruta, así que se guarda en
  // una ref para que la carga dependa solo del id.
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    obtenerHabito(id ?? '')
      .then(setHabito)
      .catch((e: Error) => {
        // 401: se vuelve al login con el mensaje; otro error se muestra aquí.
        if (e instanceof SesionInvalidaError) {
          navigateRef.current('/login', { replace: true, state: { aviso: e.message } });
        } else {
          setError(e.message);
        }
      });
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/habitos" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <strong>Error:</strong> {error}
            </IonCardContent>
          </IonCard>
        )}

        {habito && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{habito.nombre}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonLabel>
                    <p>Categoría</p>
                    <h3>{habito.categoria}</h3>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <p>Meta</p>
                    <h3>{habito.meta}</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};

export default DetalleHabito;
