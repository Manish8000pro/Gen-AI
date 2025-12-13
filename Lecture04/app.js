async function get_crypto_price(coin) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`)
    const data = await response.json();
    console.log(data);
}