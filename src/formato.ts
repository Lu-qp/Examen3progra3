const moneda = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

export function colones(precio: number) {
  return moneda.format(precio);
}
