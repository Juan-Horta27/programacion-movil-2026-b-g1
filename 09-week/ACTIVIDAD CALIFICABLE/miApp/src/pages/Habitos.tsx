import { useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonInput,
  IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { listarHabitos, crearHabito, Habito } from '../services/api';

/**
 * Pantalla principal: lista los hábitos (GET) y tiene un formulario que
 * crea uno nuevo (POST). El estado vive en useState.
 */

const Habitos: React.FC = () => {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [meta, setMeta] = useState('');

  // GET /habitos cuando la pantalla aparece.
  useEffect(() => {
    listarHabitos()
      .then(setHabitos)
      .catch((e: Error) => setError(e.message));
  }, []);

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
      setError((e as Error).message);
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
