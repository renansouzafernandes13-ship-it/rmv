// Camada de comunicação do RMV.
// Hoje usa o ESP32 SIMULADO. Quando tiver o ESP32, crie uma versão "ble"
// com os mesmos métodos e troque a última linha deste arquivo.
//
// UUIDs do sketch do ESP32:
//   serviço: 4fafc201-1fb5-459e-8fcc-c5c9c331914b
//   comando: beb5483e-36e1-4688-b7f5-ea07361b26a8  (escrever "1" ou "0")
//   dados:   1c95d5e3-d8f7-413a-bf3d-7a2e5d7be87e  (notificações)

const ouvintes = new Set();
let timer = null;
let contador = 0;

const avisar = (evento) => ouvintes.forEach((fn) => fn(evento));
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const simulado = {
  async conectar() {
    await esperar(900);
    avisar({ tipo: 'status', conectado: true });
    timer = setInterval(() => {
      contador += 1;
      avisar({ tipo: 'valor', valor: contador });
    }, 2000);
  },

  async desconectar() {
    clearInterval(timer);
    timer = null;
    avisar({ tipo: 'status', conectado: false });
  },

  // "1" liga, "0" desliga (igual ao sketch do ESP32)
  async enviar(comando) {
    await esperar(150);
    return comando === '1';
  },

  aoReceber(fn) {
    ouvintes.add(fn);
    return () => ouvintes.delete(fn);
  },
};

export const servico = simulado;
