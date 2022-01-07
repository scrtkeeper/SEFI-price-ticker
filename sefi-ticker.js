function onAlarm(alarm) {
    updateTicker();
}

function onInit() {
    updateTicker();
    chrome.alarms.create('sefi-watchdog', {periodInMinutes: 1});
}

async function updateTicker() {
    [sefi_data] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=secret-finance&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true', {cache: "no-store"}),
    ]);
    const tickerData = await sefi_data.json();

    const ticker_price = '$'+tickerData["secret-finance"].usd.toFixed(2);
    const price = '$'+tickerData["secret-finance"].usd.toFixed(5);
    const change = tickerData["secret-finance"].usd_24h_change.toFixed(2)+'%';
    const volume = numFormatter(tickerData["secret-finance"].usd_24h_vol);
    const marketcap = numFormatter(tickerData["secret-finance"].usd_market_cap);

    const title = `
Price: ${price}
24h change: ${change}
24h volume: ${volume}
Marketcap: ${marketcap}`;
 
    chrome.browserAction.setBadgeText({text: ticker_price});
    chrome.browserAction.setBadgeBackgroundColor({color: '#79cc81'});
    chrome.browserAction.setTitle({title: title});
}

function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(0) + 'K';
    }else if(num > 1000000){
        return (num/1000000).toFixed(0) + 'M';
    }else if(num < 900){
        return num;
    }
}

chrome.runtime.onInstalled.addListener(onInit);
chrome.alarms.onAlarm.addListener(onAlarm);