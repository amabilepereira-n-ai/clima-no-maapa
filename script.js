

const API_GEOCODING =
    "https://geocoding-api.open-meteo.com/v1/search";

const API_WEATHER =
    "https://api.open-meteo.com/v1/forecast";





const cidadeInput =
    document.getElementById("cidadeInput");

const botaoBuscar =
    document.getElementById("botaoBuscar");

const localizacao =
    document.getElementById("localizacao");

const sugestoes =
    document.getElementById("sugestoes");

const mensagem =
    document.getElementById("mensagem");

const nomeCidade =
    document.getElementById("nomeCidade");

const localCidade =
    document.getElementById("localCidade");

const temperatura =
    document.getElementById("temperatura");

const descricaoClima =
    document.getElementById("descricaoClima");

const sensacao =
    document.getElementById("sensacao");

const umidade =
    document.getElementById("umidade");

const vento =
    document.getElementById("vento");

const chuva =
    document.getElementById("chuva");

const iconeClima =
    document.getElementById("iconeClima");

const atualizado =
    document.getElementById("atualizado");



// botao de buscar


botaoBuscar.addEventListener("click", () => {

    const cidade =
        cidadeInput.value.trim();

    if (!cidade) {

        mostrarMensagem(
            "Digite o nome de uma cidade."
        );

        return;
    }

    pesquisarCidade(cidade);
});






cidadeInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const cidade =
            cidadeInput.value.trim();

        if (cidade) {
            pesquisarCidade(cidade);
        }
    }
});



// pesquisa a cidade


async function pesquisarCidade(cidade) {

    mostrarMensagem("");

    botaoBuscar.textContent =
        "Buscando...";

    try {

        const url =
            `${API_GEOCODING}?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

        const resposta =
            await fetch(url);

        if (!resposta.ok) {
            throw new Error();
        }

        const dados =
            await resposta.json();

        if (
            !dados.results ||
            dados.results.length === 0
        ) {

            mostrarMensagem(
                "Cidade não encontrada."
            );

            botaoBuscar.textContent =
                "Buscar";

            return;
        }

        const resultado =
            dados.results[0];

        await buscarClima(
            resultado.latitude,
            resultado.longitude,
            resultado
        );

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar os dados meteorológicos."
        );
    }

    botaoBuscar.textContent =
        "Buscar";
}



// busca o clima

async function buscarClima(
    latitude,
    longitude,
    cidade
) {

    try {

        const url =
            `${API_WEATHER}?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&temperature_unit=celsius` +
            `&wind_speed_unit=kmh` +
            `&precipitation_unit=mm` +
            `&timezone=auto`;


        const resposta =
            await fetch(url);

        if (!resposta.ok) {
            throw new Error();
        }

        const dados =
            await resposta.json();

        atualizarTela(
            dados,
            cidade
        );

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar os dados meteorológicos."
        );
    }
}




function atualizarTela(
    dados,
    cidade
) {

    const clima =
        dados.current;


    // Nome da cidade

    nomeCidade.textContent =
        cidade.name;


    // Estado e país

    let local = "";

    if (cidade.admin1) {
        local += cidade.admin1 + ", ";
    }

    if (cidade.country) {
        local += cidade.country;
    }

    localCidade.textContent =
        local;


    // Temperatura

    temperatura.textContent =
        Math.round(
            clima.temperature_2m
        );


    // Sensação térmica

    sensacao.textContent =
        Math.round(
            clima.apparent_temperature
        );


    // Umidade

    umidade.textContent =
        clima.relative_humidity_2m + "%";


    // Vento

    vento.textContent =
        Math.round(
            clima.wind_speed_10m
        ) + " km/h";


    // Chuva

    chuva.textContent =
        clima.precipitation + " mm";


    // Descrição do clima

    const informacao =
        interpretarClima(
            clima.weather_code
        );

    descricaoClima.textContent =
        informacao.descricao;


    // Ícone

    iconeClima.textContent =
        informacao.icone;


    // Horário

    const agora =
        new Date();

    atualizado.textContent =
        agora.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // Limpa erro

    mostrarMensagem("");
}




function interpretarClima(codigo) {

    if (codigo === 0) {

        return {
            descricao: "Céu limpo",
            icone: "☀️"
        };
    }


    if (
        codigo === 1 ||
        codigo === 2
    ) {

        return {
            descricao: "Parcialmente nublado",
            icone: "🌤️"
        };
    }


    if (codigo === 3) {

        return {
            descricao: "Nublado",
            icone: "☁️"
        };
    }


    if (
        codigo === 45 ||
        codigo === 48
    ) {

        return {
            descricao: "Neblina",
            icone: "🌫️"
        };
    }


    if (
        codigo === 51 ||
        codigo === 53 ||
        codigo === 55
    ) {

        return {
            descricao: "Garoa",
            icone: "🌦️"
        };
    }


    if (
        codigo === 61 ||
        codigo === 63 ||
        codigo === 65
    ) {

        return {
            descricao: "Chuva",
            icone: "🌧️"
        };
    }


    if (
        codigo === 71 ||
        codigo === 73 ||
        codigo === 75
    ) {

        return {
            descricao: "Neve",
            icone: "❄️"
        };
    }


    if (
        codigo === 80 ||
        codigo === 81 ||
        codigo === 82
    ) {

        return {
            descricao: "Pancadas de chuva",
            icone: "🌦️"
        };
    }


    if (
        codigo === 95 ||
        codigo === 96 ||
        codigo === 99
    ) {

        return {
            descricao: "Tempestade",
            icone: "⛈️"
        };
    }


    return {
        descricao: "Condição desconhecida",
        icone: "🌡️"
    };
}



// mostra a mensagem


function mostrarMensagem(texto) {

    mensagem.textContent =
        texto;
}



let temporizador;

cidadeInput.addEventListener(
    "input",
    () => {

        clearTimeout(
            temporizador
        );

        const texto =
            cidadeInput.value.trim();


        if (texto.length < 3) {

            sugestoes.innerHTML = "";

            return;
        }


        temporizador =
            setTimeout(
                () => buscarSugestoes(texto),
                500
            );
    }
);



// sugestao de cidade


async function buscarSugestoes(texto) {

    try {

        const url =
            `${API_GEOCODING}?name=${encodeURIComponent(texto)}&count=5&language=pt&format=json`;

        const resposta =
            await fetch(url);

        const dados =
            await resposta.json();


        sugestoes.innerHTML = "";


        if (!dados.results) {
            return;
        }


        dados.results.forEach(
            (cidade) => {

                const item =
                    document.createElement("div");

                item.className =
                    "sugestao";


                item.textContent =
                    `${cidade.name}, ${cidade.country}`;


                item.addEventListener(
                    "click",
                    () => {

                        cidadeInput.value =
                            cidade.name;

                        sugestoes.innerHTML =
                            "";

                        buscarClima(
                            cidade.latitude,
                            cidade.longitude,
                            cidade
                        );
                    }
                );


                sugestoes.appendChild(
                    item
                );
            }
        );

    } catch (erro) {

        console.error(
            "Erro nas sugestões:",
            erro
        );
    }
}



// usa sua localizacao


localizacao.addEventListener(
    "click",
    () => {

        mostrarMensagem(
            "Obtendo sua localização..."
        );


        if (!navigator.geolocation) {

            mostrarMensagem(
                "Seu navegador não suporta localização."
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            async (posicao) => {

                const latitude =
                    posicao.coords.latitude;

                const longitude =
                    posicao.coords.longitude;


                try {

                    const url =
                        `${API_GEOCODING}?latitude=${latitude}&longitude=${longitude}&count=1&language=pt&format=json`;

                    const resposta =
                        await fetch(url);

                    const dados =
                        await resposta.json();


                    let cidade =
                        dados.results?.[0];


                    if (!cidade) {

                        cidade = {
                            name: "Minha localização",
                            country: "Brasil"
                        };
                    }


                    cidadeInput.value =
                        cidade.name;


                    await buscarClima(
                        latitude,
                        longitude,
                        cidade
                    );

                } catch (erro) {

                    console.error(erro);

                    mostrarMensagem(
                        "Não foi possível encontrar sua cidade."
                    );
                }
            },


            () => {

                mostrarMensagem(
                    "Não foi possível acessar sua localização."
                );
            }
        );
    }
);




window.addEventListener(
    "load",
    () => {

        pesquisarCidade(
            "Realeza"
        );
    }
);