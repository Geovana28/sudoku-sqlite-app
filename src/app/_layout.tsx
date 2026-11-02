import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f4f7f6' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="inicial" />
        <Stack.Screen name="nivelfacil" />
        <Stack.Screen name="nivelmedio" />
        <Stack.Screen name="niveldificil" />
        <Stack.Screen name="telafinalganhou" />
        <Stack.Screen name="telafinalperdeu" />
        <Stack.Screen name="cadastro-desafio" />
        <Stack.Screen name="lista-desafios" />
        <Stack.Screen name="detalhe-desafio" />
      </Stack>
    </>
  );
}
