// ========================================
// configuracao das APIs (que e o conjunto de regras e protocolos que permite que diferentes sistemas de software se comuniquem e troquem dados entre si, pesquisei no gooogle esse) 
// ========================================

// API usada para descobrir informações da cidade (pra o app nao ficar tao burro)
const API_GEOCODING =
    "https://geocoding-api.open-meteo.com/v1/search";

// API usada para buscar os dados do clima (achei foda)
const API_WEATHER =
    "https://api.open-meteo.com/v1/forecast";


// ========================================
// bagulhos do html esqueci o nome de novo do negocio
// ========================================

// Campo onde o usuário digita a cidade (tem que ser especifico fi senao o usuario nao pega a visao)
const campoCidade = document.getElementById("cidade");

// Botão de pesquisar (aqui tu pesquisa os paranaue)
const botaoBuscar = document.getElementById("buscar");

// Botão para usar a localização (e o que ta dizendo ali mesmo)
const botaoLocalizacao = document.getElementById("localizacao");

// Área onde aparecem as sugestões (monstra onde fica as sugestoes pro povo tambem poder humulhar nois)
const sugestoes = document.getElementById("sugestoes");

// Área onde aparece o resultado (e isso ai)
const resultado = document.getElementById("resultado");

// Mensagem de erro ou informação (mostra a mensagem de erro ou informacao fesso)
const mensagem = document.getElementById("mensagem");

// Elementos que mostram os dados do clima (finalmente lembrei o nome do bagulho)
const nomeCidade = document.getElementById("nomeCidade");
const localCidade = document.getElementById("localCidade");
const iconeClima = document.getElementById("iconeClima");
const temperatura = document.getElementById("temperatura");
const descricaoClima = document.getElementById("descricaoClima");
const sensacao = document.getElementById("sensacao");
const umidade = document.getElementById("umidade");
const vento = document.getElementById("vento");
const chuva = document.getElementById("chuva");
const atualizado = document.getElementById("atualizado");


// ========================================
// funcao pra monstrar a mensagem do negocio
// ========================================

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
}


// ========================================
// funcao pra interpretar o clima (negocio dificil de explicar)
// ========================================
function interpretarClima(codigo) {

    if (codigo === 0) {
        return {
            descricao: "Céu limpo",
            icone: "☀️"
        };
    }

    if (codigo === 1 || codigo === 2) {
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

    if (codigo === 45 || codigo === 48) {
        return {
            descricao: "Neblina",
            icone: "🌫️"
        };
    }

    if (
        codigo === 51 ||
        codigo === 53 ||
        codigo === 55 ||
        codigo === 56 ||
        codigo === 57
    ) {
        return {
            descricao: "Garoa",
            icone: "🌦️"
        };
    }

    if (
        codigo === 61 ||
        codigo === 63 ||
        codigo === 65 ||
        codigo === 66 ||
        codigo === 67
    ) {
        return {
            descricao: "Chuva",
            icone: "🌧️"
        };
    }

    if (
        codigo === 71 ||
        codigo === 73 ||
        codigo === 75 ||
        codigo === 77
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


// ========================================
// funcao pra buscar o clima do negocio
// ========================================

async function consultarTempo(latitude, longitude, cidade) {

    try {

        // Mostra uma mensagem enquanto a API responde (e isso ai)
        mostrarMensagem("Buscando informações do clima...");

        // Monta a URL da API meteorológica 
        const url =
            `${API_WEATHER}` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&temperature_unit=celsius` +
            `&wind_speed_unit=kmh` +
            `&precipitation_unit=mm` +
            `&timezone=auto`;

        // Faz uma requisição GET para a API
        const resposta = await fetch(url);

        // Verifica se houve algum erro HTTP
        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados do clima.");
        }

        // Converte a resposta para JSON
        const dados = await resposta.json();

        // Pega os dados atuais do clima
        const clima = dados.current;

        // Interpreta o código do clima
        const informacaoClima = interpretarClima(clima.weather_code);


        // ========================================
        // coloca os dados do html (pra ficar salvo nos dados fesso)
        // ========================================

        nomeCidade.textContent = cidade.name;

        if (cidade.country) {
            localCidade.textContent =
                `${cidade.admin1 ? cidade.admin1 + ", " : ""}${cidade.country}`;
        } else {
            localCidade.textContent = "Localização atual";
        }

        iconeClima.textContent = informacaoClima.icone;

        temperatura.textContent =
            `${Math.round(clima.temperature_2m)}°C`;

        descricaoClima.textContent =
            informacaoClima.descricao;

        sensacao.textContent =
            `${Math.round(clima.apparent_temperature)}°C`;

        umidade.textContent =
            `${clima.relative_humidity_2m}%`;

        vento.textContent =
            `${Math.round(clima.wind_speed_10m)} km/h`;

        chuva.textContent =
            `${clima.precipitation} mm`;

        atualizado.textContent =
            `Atualizado às ${clima.time.split("T")[1]}`;

        // Mostra o resultado
        resultado.style.display = "block";

        // Limpa mensagens
        mostrarMensagem("");

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível buscar os dados do clima."
        );
    }
}


// ========================================
// buscar cidade (aqui tu busca a cidade que tu que)
// ========================================

async function buscarCidade(nome) {

    try {

        mostrarMensagem("Procurando cidade...");

        // Monta a URL da API de geocodificação
        const url =
            `${API_GEOCODING}` +
            `?name=${encodeURIComponent(nome)}` +
            `&count=5` +
            `&language=pt` +
            `&format=json`;

        // Faz a requisição GET
        const resposta = await fetch(url);

        // Verifica se houve erro
        if (!resposta.ok) {
            throw new Error("Erro ao procurar a cidade.");
        }

        // Converte a resposta para JSON
        const dados = await resposta.json();

        // Verifica se encontrou alguma cidade
        if (!dados.results || dados.results.length === 0) {

            mostrarMensagem("Cidade não encontrada.");

            resultado.style.display = "none";

            return;
        }

        // Pega a primeira cidade encontrada
        const cidade = dados.results[0];

        // Busca o clima usando latitude e longitude
        await consultarTempo(
            cidade.latitude,
            cidade.longitude,
            cidade
        );

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível encontrar a cidade."
        );
    }
}


// ========================================
// botao de buscar o bagulho
// ========================================

botaoBuscar.addEventListener("click", function () {

    const nome = campoCidade.value.trim();

    // Verifica se o usuário digitou alguma coisa
    if (nome === "") {

        mostrarMensagem("Digite o nome de uma cidade.");

        return;
    }

    // Busca a cidade
    buscarCidade(nome);

});


// ========================================
// tecla enter (porque ninguem vive so de mause fi)
// ========================================

campoCidade.addEventListener("keydown", function (evento) {

    // Se o usuário apertar Enter
    if (evento.key === "Enter") {

        botaoBuscar.click();

    }

});


// ========================================
// sugestoes da cidade do bagulho
// ========================================

let temporizador;


// Espera o usuário parar de digitar
campoCidade.addEventListener("input", function () {

    clearTimeout(temporizador);

    const texto = campoCidade.value.trim();

    // Se tiver menos de 3 letras, não procura (o povo tem que escrever bando de preguisoso querer pesquisar menos de 3 letras quem faria isso ne fesso. Eu faco)
    if (texto.length < 3) {

        sugestoes.innerHTML = "";

        return;
    }

    // Espera 500 milissegundos antes de fazer a busca (eu nao sei porque as no comeco achei muito tempo fesso)
    temporizador = setTimeout(async function () {

        try {

            const url =
                `${API_GEOCODING}` +
                `?name=${encodeURIComponent(texto)}` +
                `&count=5` +
                `&language=pt` +
                `&format=json`;

            const resposta = await fetch(url);

            if (!resposta.ok) {
                return;
            }

            const dados = await resposta.json();

            sugestoes.innerHTML = "";

            if (!dados.results) {
                return;
            }

            // Cria uma sugestão para cada cidade encontrada (vai sugerir os bagulho pra cada cidade encontrada)
            dados.results.forEach(function (cidade) {

                const botao = document.createElement("button");

                botao.type = "button";

                botao.textContent =
                    `${cidade.name}${cidade.admin1 ? " - " + cidade.admin1 : ""}`;

                // Quando clicar na sugestão
                botao.addEventListener("click", function () {

                    campoCidade.value = cidade.name;

                    sugestoes.innerHTML = "";

                    consultarTempo(
                        cidade.latitude,
                        cidade.longitude,
                        cidade
                    );

                });

                sugestoes.appendChild(botao);

            });

        } catch (erro) {

            console.error(erro);

        }

    }, 500);

});


// ========================================
// botao de localizacao (aqui tu clica no botao pra localizar)
// ========================================

botaoLocalizacao.addEventListener("click", function () {

    // Verifica se o navegador possui geolocalização (nao sei explicar o que e geolocalizacao nome dificil fi)
    if (!navigator.geolocation) {

        mostrarMensagem(
            "Seu navegador não suporta localização."
        );

        return;
    }

    mostrarMensagem(
        "Obtendo sua localização..."
    );

    // Pede a localização do dispositivo (vou saber onde todos estao MUHAHAHAHHA. to zoando)
    navigator.geolocation.getCurrentPosition(

        async function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;

           
            const cidade = {
                name: "Minha localização",
                country: ""
            };

            await consultarTempo(
                latitude,
                longitude,
                cidade
            );

        },

        function (erro) {

            console.error(erro);

            mostrarMensagem(
                "Não foi possível acessar sua localização."
            );

        }

    );

});


// ========================================
// busca inicial do bagulho
// ========================================

// Quando a página abrir, mostra o clima de Lages. (que foda gostei de por no meu app)
buscarCidade("Lages");


// ========================================
// service worker (nao sei nem pronunciar direito quem dira saber essa porra bem, fui logo pesquisar oque era)
// ========================================



if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker
            .register("./sw.js")
            .then(function () {

                console.log(
                    "Service Worker registrado com sucesso."
                );

            })
            .catch(function (erro) {

                console.error(
                    "Erro ao registrar o Service Worker:",
                    erro
                );

            });

    });

}
