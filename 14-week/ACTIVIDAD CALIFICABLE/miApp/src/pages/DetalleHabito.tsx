import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonSpinner, IonTitle, IonToolbar
} from '@ionic/react';
import { listarHabitos, Habito, SesionInvalidaError } from '../services/api';

/**
 * Pantalla de detalle de un hábito.
 * La API solo expone GET /habitos y POST /habitos, así que el hábito se busca
 * en la respuesta del GET usando el id que viene en la ruta.
 */

const DetalleHabito: React.FC = () => {
  // useParams entrega los parámetros de la ruta siempre como texto.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [habito, setHabito] = useState<Habito | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Igual que en la lista: navigate se guarda en una ref para que la carga
  // dependa solo del id.
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    setCargando(true);
    setError(null);
    listarHabitos()
      .then((lista) => setHabito(lista.find((h) => h.id === Number(id)) ?? null))
      .catch((e: Error) => {
        // 401: se vuelve al login con el mensaje; otro error se muestra aquí.
        if (e instanceof SesionInvalidaError) {
          navigateRef.current('/login', { replace: true, state: { aviso: e.message } });
        } else {
          setError(e.message);
        }
      })
      .finally(() => setCargando(false));
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

        {/* Estado: cargando */}
        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
            <p>Cargando hábito…</p>
          </div>
        )}

        {/* Estado: error */}
        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <strong>Error:</strong> {error}
            </IonCardContent>
          </IonCard>
        )}

        {!cargando && !error && !habito && (
          <p className="ion-text-center ion-padding">No se encontró este hábito.</p>
        )}

        {/* Estado: datos */}
        {!cargando && habito && (
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
