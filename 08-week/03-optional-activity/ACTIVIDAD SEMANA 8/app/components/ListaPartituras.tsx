import { useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonInput, IonItem,
  IonLabel, IonList, IonNote, IonSpinner
} from '@ionic/react';
import { listarPartituras, crearPartitura, Partitura } from '../services/api';
import './ListaPartituras.css';

const ListaPartituras: React.FC = () => {
  const [partituras, setPartituras] = useState<Partitura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [instrumento, setInstrumento] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      setPartituras(await listarPartituras());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  // Se ejecuta una sola vez, cuando el componente aparece en pantalla.
  useEffect(() => {
    cargar();
  }, []);

  async function agregar() {
    setGuardando(true);
    setError(null);
    try {
      const nueva = await crearPartitura({ titulo, instrumento });
      setPartituras((previas) => [...previas, nueva]);
      setTitulo('');
      setInstrumento('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="partituras">

      <IonCard>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Título</IonLabel>
            <IonInput
              value={titulo}
              placeholder="Ej: Rumba en Do"
              onIonInput={(e) => setTitulo(e.detail.value ?? '')}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Instrumento</IonLabel>
            <IonInput
              value={instrumento}
              placeholder="Ej: Congas"
              onIonInput={(e) => setInstrumento(e.detail.value ?? '')}
            />
          </IonItem>

          <IonButton
            expand="block"
            className="partituras__boton"
            disabled={guardando}
            onClick={agregar}
          >
            {guardando ? 'Guardando…' : 'Agregar partitura'}
          </IonButton>

          <IonNote className="partituras__ayuda">
            Deja el título vacío para ver cómo se muestra el error del servidor.
          </IonNote>
        </IonCardContent>
      </IonCard>

      {error && (
        <IonCard color="danger">
          <IonCardContent>
            <strong>Error:</strong> {error}
            <IonButton fill="clear" size="small" onClick={cargar}>
              Reintentar
            </IonButton>
          </IonCardContent>
        </IonCard>
      )}

      {cargando && (
        <div className="partituras__centro">
          <IonSpinner name="crescent" />
          <p>Cargando partituras…</p>
        </div>
      )}

      {!cargando && !error && partituras.length === 0 && (
        <p className="partituras__centro">Todavía no hay partituras.</p>
      )}

      {!cargando && partituras.length > 0 && (
        <IonList>
          {partituras.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>
                <h2>{p.titulo}</h2>
                <p>{p.instrumento} · {p.compases} compases</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}

    </div>
  );
};

export default ListaPartituras;
