import client from './client'

export const loginDev = async (telegramId, name) => {
    const res = await client.post('/auth/telegram/dev', {
        telegram_id: telegramId,
        name,
        role: 'customer',
    })
    return res.data
}

export const loginTelegram = async (initData) => {
    const res = await client.post('/auth/telegram', { init_data: initData })
    return res.data
}