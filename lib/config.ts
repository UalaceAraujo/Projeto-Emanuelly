/**
 * =============================================
 * CONFIGURACOES DA EMPRESA
 * EDITE ESTE ARQUIVO para personalizar o sistema
 * =============================================
 */

/** EDITE AQUI: Nome do seu negocio */
export const BUSINESS_NAME = "Emanuelly"

/** EDITE AQUI: Subtitulo / slogan */
export const BUSINESS_TAGLINE = "Design de Sombrancelhas"

/**
 * EDITE AQUI: Numero do WhatsApp (apenas numeros, com codigo do pais)
 * Exemplo: 5511999999999 (55 = Brasil, 11 = DDD, 999999999 = numero)
 */
export const WHATSAPP_NUMBER = "5511999999999"

/**
 * EDITE AQUI: Mensagem padrao que sera enviada pelo WhatsApp
 * As variaveis {nome}, {servico}, {data} e {horario} serao substituidas automaticamente
 */
export const WHATSAPP_MESSAGE_TEMPLATE =
  "Ola! Gostaria de confirmar meu agendamento:\n\nNome: {nome}\nServico: {servico}\nData: {data}\nHorario: {horario}\n\nAguardo confirmacao!"

/**
 * EDITE AQUI: Lista de servicos oferecidos
 * - id: identificador unico (nao altere depois de ter agendamentos)
 * - name: nome exibido para as clientes
 * - duration: duracao em minutos
 * - price: preco em reais
 * - description: descricao curta do servico
 */
export const SERVICES = [
  {
    id: "sobrancelha-natural",
    name: "Sobrancelha Natural",
    duration: 40,
    price: 45.0,
    description: "Design com tecnica fio a fio para um resultado natural e harmonioso",
  },
  {
    id: "henna",
    name: "Henna",
    duration: 50,
    price: 55.0,
    description: "Coloracao natural com henna para destacar e definir as sobrancelhas",
  },
  {
    id: "buco",
    name: "Buco",
    duration: 15,
    price: 20.0,
    description: "Remocao delicada dos pelos do buco com cera ou linha",
  },
]

/**
 * EDITE AQUI: Horarios disponiveis para agendamento
 * Formato: "HH:MM" (24 horas)
 * Adicione ou remova horarios conforme sua disponibilidade
 */
export const DEFAULT_TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

/**
 * EDITE AQUI: Dias da semana em que voce atende
 * 0 = Domingo, 1 = Segunda, 2 = Terca, ... 6 = Sabado
 */
export const WORKING_DAYS = [1, 2, 3, 4, 5, 6] // Segunda a Sabado

/**
 * EDITE AQUI: Caminho da logomarca
 * Coloque sua logo em /public/images/logo.png ou /public/images/logo.jpg
 * Tamanho recomendado: 200x200px, formato PNG com fundo transparente
 */
export const LOGO_PATH = "/images/logo.jpg"
