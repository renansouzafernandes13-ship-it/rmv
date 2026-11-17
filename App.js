import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { servico } from './bleService';

const cor = {
  fundo: '#EEF1F5',
  tinta: '#0F1B2D',
  suave: '#6B7788',
  destaque: '#0B6E4F',
  alerta: '#C23B22',
  branco: '#FFFFFF',
};

export default function App() {
  const [conectado, setConectado] = useState(false);
  const [conectando, setConectando] = useState(false);
  const [ligado, setLigado] = useState(false);
  const [valor, setValor] = useState(null);

  useEffect(() => {
    return servico.aoReceber((e) => {
      if (e.tipo === 'status') {
        setConectado(e.conectado);
        if (!e.conectado) { setLigado(false); setValor(null); }
      }
      if (e.tipo === 'valor') setValor(e.valor);
    });
  }, []);

  const alternarConexao = async () => {
    if (conectado) return servico.desconectar();
    setConectando(true);
    await servico.conectar();
    setConectando(false);
  };

  const alternarSaida = async () => {
    const novo = !ligado;
    await servico.enviar(novo ? '1' : '0');
    setLigado(novo);
  };

  return (
    <SafeAreaView style={s.tela}>
      <StatusBar barStyle="dark-content" />

      <Text style={s.titulo}>RMV</Text>
      <Text style={s.status}>
        {conectado ? 'Conectado ao ESP32 (simulado)' : 'Desconectado'}
      </Text>

      <View style={s.leitura}>
        <Text style={s.valor}>{valor ?? '–'}</Text>
        <Text style={s.legenda}>Leitura do sensor</Text>
      </View>

      <Pressable
        onPress={alternarSaida}
        disabled={!conectado}
        style={[s.botao, { backgroundColor: ligado ? cor.destaque : cor.branco }, !conectado && s.inativo]}
      >
        <Text style={[s.textoBotao, { color: ligado ? cor.branco : cor.tinta }]}>
          {ligado ? 'Desligar' : 'Ligar'}
        </Text>
      </Pressable>

      <Pressable
        onPress={alternarConexao}
        disabled={conectando}
        style={[s.botao, { backgroundColor: conectado ? cor.alerta : cor.tinta }]}
      >
        <Text style={[s.textoBotao, { color: cor.branco }]}>
          {conectando ? 'Conectando…' : conectado ? 'Desconectar' : 'Conectar'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo, paddingHorizontal: 24, paddingTop: 48 },
  titulo: { fontSize: 44, fontWeight: '800', color: cor.tinta, letterSpacing: 1 },
  status: { fontSize: 16, color: cor.suave, marginTop: 4 },
  leitura: { flex: 1, justifyContent: 'center' },
  valor: { fontSize: 96, fontWeight: '700', color: cor.tinta },
  legenda: { fontSize: 16, color: cor.suave },
  botao: { height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  textoBotao: { fontSize: 18, fontWeight: '700' },
  inativo: { opacity: 0.4 },
});
