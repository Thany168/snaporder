import client from './client'

export const loginDev = async (telegramId: string, name: string) => {
  const res = await client.post('/auth/telegram/dev', {
    telegram_id: telegramId,
    name,
    role: 'customer',
  })
  return res.data
}

export const loginTelegram = async (initData: string) => {
  const res = await client.post('/auth/telegram', { init_data: initData })
  return res.data
}