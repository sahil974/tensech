const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/convert', async (req, res) => {
    try {
        const conversions = [];
        const toConvert = req.body.toConvert;

        for (const item of toConvert) {
            const amount = item.amount;
            const from = item.from;
            const to = item.to;

            const exchangeValues = [];

            for (const targetCurrency of to) {
                const conversionRate = await getConversionRate(from, targetCurrency);
                const convertedAmount = amount * conversionRate;

                exchangeValues.push({ to: targetCurrency, value: convertedAmount });
            }

            conversions.push({ amount, from, exchangeValues });
        }

        res.json({ conversions });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function getConversionRate(from, to) {
    const exchangeRates = await fetchExchangeRatesFromAPI();

    const conversionRate = exchangeRates[to] / exchangeRates[from];

    return conversionRate;
}

async function fetchExchangeRatesFromAPI() {
    return {
        USD: 1.0,
        EUR: 0.85,
        INR: 74.5,
        SGD: 1.35,
        AUD: 1.29,
    };
}
