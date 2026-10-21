import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '../../context/AppContext';
import { simularPeticion } from '../../services/simulacion';
import HabitosScreen from '../HabitosScreen';

jest.mock('../../services/simulacion', () => ({ simularPeticion: jest.fn() }));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));

const simular = jest.mocked(simularPeticion);

const medidas = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

async function renderHabitos() {
  await render(
    <SafeAreaProvider initialMetrics={medidas}>
      <AppProvider>
        <HabitosScreen />
      </AppProvider>
    </SafeAreaProvider>,
  );
}

describe('HabitosScreen', () => {
  beforeEach(() => {
    simular.mockReset();
  });

  it('muestra el mensaje de error cuando la carga falla', async () => {
    simular.mockRejectedValueOnce(new Error('sin conexion'));
    await renderHabitos();

    expect(await screen.findByText('No se pudieron cargar tus habitos')).toBeTruthy();
    expect(screen.getByText('Reintentar')).toBeTruthy();
  });

  it('Reintentar vuelve a pedir los habitos y muestra la lista', async () => {
    simular.mockRejectedValueOnce(new Error('sin conexion')).mockResolvedValueOnce();
    await renderHabitos();

    fireEvent.press(await screen.findByText('Reintentar'));

    expect(await screen.findByText('Beber agua')).toBeTruthy();
    expect(simular).toHaveBeenCalledTimes(2);
  });

  it('tocar un habito abre su detalle con el id en la ruta', async () => {
    simular.mockResolvedValue();
    await renderHabitos();

    fireEvent.press(await screen.findByLabelText('Ver detalle de Beber agua'));

    expect(mockNavigate).toHaveBeenCalledWith('HabitoDetalle', { id: 1 });
  });
});
