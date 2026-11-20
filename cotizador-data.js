/* Cotizador GreyCell Store: precios al cliente (soles).
   Versión PÚBLICA: no contiene costos de proveedor ni ganancias.
   La versión con costos vive solo en el panel GSM (privado).
   Estándar de la tienda: procesador AMD Ryzen 5 5500 en todas las PC. */
window.COT_DATA = {
  actualizado: '2026-11-20',
  whatsapp: '51992039149',
  armado: 149,          // armado, pruebas y drivers
  descuentoReferido: 200,
  categorias: [
    { id: 'cpu', nombre: 'Procesador', items: [
      { id: 'r5-5500', nombre: 'AMD Ryzen 5 5500 · 6 núcleos / 12 hilos · 4.2 GHz', precio: 429, estandar: true, nota: 'Necesita tarjeta de video' },
      { id: 'r5-5600gt', nombre: 'AMD Ryzen 5 5600GT · gráficos integrados', precio: 729 } ] },
    { id: 'placa', nombre: 'Placa madre', items: [
      { id: 'a520m-k', nombre: 'Gigabyte A520M-K V2 · AM4 DDR4', precio: 189, estandar: true },
      { id: 'b450m-hdv', nombre: 'ASRock B450M-HDV · AM4 DDR4', precio: 199 } ] },
    { id: 'ram', nombre: 'Memoria RAM', items: [
      { id: 'ram-16', nombre: '16 GB DDR4 3200 MHz (2×8 GB · dual channel)', precio: 458, estandar: true },
      { id: 'ram-8', nombre: '8 GB DDR4 3200 MHz (ampliable a 16 GB)', precio: 229 } ] },
    { id: 'gpu', nombre: 'Tarjeta de video', items: [
      { id: 'rx580', nombre: 'Radeon RX 580 8 GB GDDR5', precio: 639, estandar: true },
      { id: 'sin-gpu', nombre: 'Sin tarjeta de video (solo con Ryzen 5 5600GT)', precio: 0 } ] },
    { id: 'ssd', nombre: 'Almacenamiento', items: [
      { id: 'ssd-1tb', nombre: 'SSD 1 TB NVMe M.2', precio: 369, estandar: true },
      { id: 'ssd-256', nombre: 'SSD 256 GB NVMe M.2', precio: 189 } ] },
    { id: 'case', nombre: 'Case y fuente', items: [
      { id: 'mark355', nombre: 'Case Halion Mark 355 Fish Tank 3 fans RGB + fuente 1st Player 600W 80+', precio: 228, estandar: true },
      { id: 'ragnarok', nombre: 'Case Halion Ragnarok 324 4 fans con fuente 550W incluida', precio: 169 } ] },
    { id: 'monitor', nombre: 'Monitor', items: [
      { id: 'halion24', nombre: 'Monitor gamer Halion 24" IPS Full HD 144 Hz', precio: 279, estandar: true },
      { id: 'sin-monitor', nombre: 'Sin monitor', precio: 0 } ] },
    { id: 'kit', nombre: 'Teclado y mouse', items: [
      { id: 'kit-rgb', nombre: 'Kit teclado + mouse gamer RGB', precio: 59, estandar: true },
      { id: 'sin-kit', nombre: 'Sin teclado ni mouse', precio: 0 } ] }
  ],
  combos: [
    { id: 'pro', nombre: 'GAMER RX 580 PRO', tag: 'Más recomendada',
      sel: { cpu: 'r5-5500', placa: 'a520m-k', ram: 'ram-16', gpu: 'rx580', ssd: 'ssd-1tb', case: 'mark355', monitor: 'halion24', kit: 'kit-rgb' } },
    { id: 'gamer', nombre: 'GAMER RX 580', tag: 'Mejor precio-calidad',
      sel: { cpu: 'r5-5500', placa: 'a520m-k', ram: 'ram-16', gpu: 'rx580', ssd: 'ssd-1tb', case: 'ragnarok', monitor: 'halion24', kit: 'kit-rgb' } },
    { id: 'start', nombre: 'GAMER RX 580 START', tag: 'La más económica',
      sel: { cpu: 'r5-5500', placa: 'a520m-k', ram: 'ram-8', gpu: 'rx580', ssd: 'ssd-1tb', case: 'ragnarok', monitor: 'halion24', kit: 'kit-rgb' } }
  ]
};
