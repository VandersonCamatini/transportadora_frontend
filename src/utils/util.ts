import moment from 'moment'

export function formatDateToDatabase (date: string) {
  return moment(date).format('DD/MM/YYYY')
}
export function verifyStatus (param: number) {
  switch (param) {
    case 0:
      return 'CANCELADO'
    case 1:
      return 'ENTREGUE'
    case 2:
      return 'EM PROCESSAMENTO'
    case 3:
      return 'EM TRANSPORTE'
    default:
      return 'DESCONHECIDO'
  }
}
