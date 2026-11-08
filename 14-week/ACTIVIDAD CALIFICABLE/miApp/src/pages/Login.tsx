import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonInput,
  IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { iniciarSesion } from '../services/api';

/**
 * Inicio de sesión: envía correo y contraseña a POST /login y, si son
 * correctos, el servicio guarda el token y la app pasa a la lista de hábitos.
 */

const Login: React.FC = () => {
  const navigate = useNavigate();
  // Mensaje que llega desde otra pantalla cuando la sesión venció (401).
  const aviso = (useLocation().state as { aviso?: string } | null)?.aviso;

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar() {
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
      navigate('/habitos', { replace: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        {aviso && !error && (
          <IonCard color="warning">
            <IonCardContent>{aviso}</IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardContent>
            <IonInput
              label="Correo"
              labelPlacement="stacked"
              type="email"
              placeholder="Ej: juan@habitos.test"
              value={correo}
              onIonInput={(e) => setCorreo(e.detail.value ?? '')}
            />
            <IonInput
              label="Contraseña"
              labelPlacement="stacked"
              type="password"
              value={contrasena}
              onIonInput={(e) => setContrasena(e.detail.value ?? '')}
            />
            <IonButton expand="block" className="ion-margin-top" onClick={entrar} disabled={cargando}>
              {cargando ? 'Entrando…' : 'Entrar'}
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Credenciales incorrectas, datos vacíos o sin conexión */}
        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <strong>Error:</strong> {error}
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Login;
