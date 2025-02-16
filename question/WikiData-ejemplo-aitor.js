import fetch from 'node-fetch';

const offset = Math.floor(Math.random() * 100);
const query = "SELECT ?country ?countryLabel ?flag WHERE " +
                "{ ?country wdt:P31 wd:Q6256; wdt:P41 ?flag. " +
                "SERVICE wikibase:label { bd:serviceParam wikibase:language '[AUTO_LANGUAGE],es'. } } " +
                "LIMIT 1 OFFSET " + offset;

const url = "https://query.wikidata.org/sparql";

async function getRandomCountryAndFlag() {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/sparql-query",
            "Accept": "application/json"
        },
        body: query
    });

    const data = await response.json();
    const results = data.results.bindings;

    if (results.length === 0) {
        console.log("No results found.");
        return;
    }

    const result = data.results.bindings[0];
    console.log("Country: " + result.countryLabel.value);
    console.log("Flag URL: " + result.flag.value);
}


//getRandomCountryAndFlag();
