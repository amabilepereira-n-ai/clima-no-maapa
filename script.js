

// aqui descrobre a API que serve pra descobrir a latitude e altitude do bagulho fessor
const API_GEOCODING =
    "https://geocoding-api.open-meteo.com/v1/search";


// API utilizada para buscar os dados meteorológicos. (nome dificil esse meteorologicos trava na hora de fala)
const API_WEATHER =
    "https://api.open-meteo.com/v1/forecast";



// elementos que sao varias coisas funcionais vamos dizer

// Campo onde o usuário digita a cidade. (se nao tiver isso ai complica e nao da de entender o barulho)
const campoCidade =
    document.getElementById("cidade");


// Botão de pesquisa. (aqui tu pesquisa o bagulho da cidade se nao me engano)
const botaoBuscar =
    document.getElementById("buscar");


// Área de sugestões. (aqui fessor tu sugere melhoras fica mior pra os outros so nao ficarem reclamando do site)
const sugestoes =
    document.getElementById("sugestoes");


// Botão de localização. (aqui tu localiza onde tu ta)
const botaoLocalizacao =
    document.getElementById("localizacao");


// Área utilizada para mensagens. (esse aqui nao entendi muito fessor)
const resultado =
    document.getElementById("resultado");


// Elementos do card do clima. (aqui fesspor e tipo pra deixar mais bonitin e ficar mais organizado os card do clima)
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

const mensagem =
    document.getElementById("mensagem");


// =====================================================
// melhoria 1 que melhora o botao pelo oque eu vi
// =====================================================

botaoBuscar.addEventListener(
    "click",
    buscarClima
);


// =====================================================
// melhoria dois que tu pode pesquisar com o enter
// =====================================================

campoCidade.addEventListener(
    "keydown",
    function (evento) {

        if (evento.key === "Enter") {

            buscarClima();
        }
    }
);


// =====================================================
// aqui e a funcao principal do bagulho aqui tem umas paradinha legal
// =====================================================

async function buscarClima() {

    // Pega o texto digitado. (ele pega o texto digitado nao tem mt oque falar essa e a funcao dele)
    const cidade =
        campoCidade.value.trim();


    // Verifica se o campo está vazio. (aqui ve se a pessoa deixou o quadrado vazio sem escrever nada)
    if (cidade === "") {

        mostrarMensagem(
            "Digite o nome de uma cidade."
        );

        return;
    }


    // Mostra uma mensagem enquanto consulta a API. (nao entendi esse mt nao fessor)
    mostrarMensagem(
        "Consultando o clima..."
    );


    botaoBuscar.textContent =
        "Buscando...";


    try {

        // =================================================
        // aqui o caba descobre as coordenadas da cidade
        // =================================================

        const urlCidade =
            `${API_GEOCODING}` +
            `?name=${encodeURIComponent(cidade)}` +
            `&count=1` +
            `&language=pt` +
            `&format=json`;


        // Faz uma requisição GET. (pelo oque eu vi esse pede informacao do servidor)
        const respostaCidade =
            await fetch(urlCidade);


        // Verifica se houve erro HTTP. (aqui ele verifica se o negocio tem erro, nao lemro onome do negocio)
        if (!respostaCidade.ok) {

            throw new Error(
                "Erro na busca da cidade."
            );
        }


        // Converte a resposta para JSON. (isso parece ierogrefos mas basicamente e um objeto que o javasrcipt pode usar pelo oque eu entendi)
        const dadosCidade =
            await respostaCidade.json();


        // Verifica se a cidade existe. (aqui ele ve se oque tu pesquisou existeou nao)
        if (
            !dadosCidade.results ||
            dadosCidade.results.length === 0
        ) {

            mostrarMensagem(
                "Cidade não encontrada."
            );

            botaoBuscar.textContent =
                "Buscar";

            return;
        }


        // Pega o primeiro resultado. (aqui pega o primeiro resultao e... acho que e so isso)
        const cidadeEncontrada =
            dadosCidade.results[0];


        // =================================================
        // Busca o clima usando latitude e longitude. (busca a latitude e a longitude nao faco a menor ideia de oque e os dois em si mais vou pesquisa fessor)
        // =================================================

        await consultarTempo(
            cidadeEncontrada.latitude,
            cidadeEncontrada.longitude,
            cidadeEncontrada
        );


    } catch (erro) {

        // Mostra o erro no Console. (mostra o erro que tem no console )
        console.error(erro);


        // Mostra mensagem para o usuário. (mostra oque ta escrito ali embaixo pra pessoa fica mais facil a pessoa ler aquilo doque so colocar o nome do erro que nem eu sei imagina a pessoa)
        mostrarMensagem(
            "Erro ao carregar os dados meteorológicos."
        );

    }


    botaoBuscar.textContent =
        "Buscar";
}


// =====================================================
// consulta o clima (so faz isso)
// =====================================================

async function consultarTempo(
    latitude,
    longitude,
    cidade
) {

    // Monta a URL da API meteorológica. (aqui o javascript vai criar o endereco quer dizer pedir pra usar o clima da cidade que os caba escolheu)
    const url =
        `${API_WEATHER}` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
        `&temperature_unit=celsius` +
        `&wind_speed_unit=kmh` +
        `&precipitation_unit=mm` +
        `&timezone=auto`;


    // Faz a requisição GET. (aqui envia o pedido pra API, confesso fesso nao sabia e pedi ajuda nessa pro chat)
    const resposta =
        await fetch(url);


    // Verifica se houve erro. (ve se tem erro em algo)
    if (!resposta.ok) {

        throw new Error(
            "Erro na consulta do clima."
        );
    }


    // Converte a resposta para JSON. (aqui transforma o javascript pra ele poder entender e ler o bagulho acho que e assim)
    const dados =
        await resposta.json();


    // Mostra no Console o JSON recebido. (esse nao sei oque dizer)
    // Isso ajuda a demonstrar o funcionamento da API.
    console.log(
        "JSON recebido pela API:",
        dados
    );


    // Atualiza os elementos da página. (basicamente fesso quando tu atualiza a pagina vai atualiza os elemtentos que tem nela)
    atualizarTela(
        dados,
        cidade
    );
}


// =====================================================
// atualiza a tela
// =====================================================

function atualizarTela(
    dados,
    cidade
) {

    // Guarda os dados atuais. (aqui guarda os dados pra fica mais facil de procura)
    const clima =
        dados.current;


    // =================================================
    // cidade que a pessoa escolheu acho
    // =================================================

    nomeCidade.textContent =
        cidade.name;


    // =================================================
    // estado e pais que foi escolhido
    // =================================================

    let local = "";


    if (cidade.admin1) {

        local +=
            cidade.admin1 + ", ";
    }


    if (cidade.country) {

        local +=
            cidade.country;
    }


    localCidade.textContent =
        local;


    // =================================================
    // temperatura do negocio
    // =================================================

    temperatura.textContent =
        Math.round(
            clima.temperature_2m
        );


    // =================================================
    // sencacao termica 
    // =================================================

    sensacao.textContent =
        Math.round(
            clima.apparent_temperature
        );


    // =================================================
    // umidade ve se ta moiado ou nao, acho
    // =================================================

    umidade.textContent =
        clima.relative_humidity_2m + "%";


    // =================================================
    // vento
    // =================================================

    vento.textContent =
        Math.round(
            clima.wind_speed_10m
        ) + " km/h";


    // =================================================
    // chuva
    // =================================================

    chuva.textContent =
        clima.precipitation + " mm";


    // =================================================
    // condicao climatica nao sei explica oque e isso
    // =================================================

    const informacao =
        interpretarClima(
            clima.weather_code
        );


    descricaoClima.textContent =
        informacao.descricao;


    iconeClima.textContent =
        informacao.icone;


    // =================================================
    // horario que atualizou
    // =================================================

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


    // Remove mensagem anterior. 
    mostrarMensagem("");
}


// =====================================================
// interpretar o coidgo em metereologico, sei nao explicar
// =====================================================

function interpretarClima(codigo) {


    // Céu limpo
    if (codigo === 0) {

        return {
            descricao: "Céu limpo",
            icone: "☀️"
        };
    }


    // Parcialmente nublado
    if (
        codigo === 1 ||
        codigo === 2
    ) {

        return {
            descricao: "Parcialmente nublado",
            icone: "🌤️"
        };
    }


    // Nublado
    if (codigo === 3) {

        return {
            descricao: "Nublado",
            icone: "☁️"
        };
    }


    // Neblina
    if (
        codigo === 45 ||
        codigo === 48
    ) {

        return {
            descricao: "Neblina",
            icone: "🌫️"
        };
    }


    // Garoa
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


    // Chuva
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


    // Neve
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


    // Pancadas de chuva
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


    // Tempestade
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


    // Caso o código não seja reconhecido. (fodasse a pessoa, brincadera fessor)
    return {

        descricao: "Condição desconhecida",

        icone: "🌡️"
    };
}


// =====================================================
// monstra a mensagem pra pessoa
// =====================================================

function mostrarMensagem(texto) {

    mensagem.textContent =
        texto;
}


// =====================================================
// melhoria 3, sugestoes automaticas (que chique achei esse)
// =====================================================

let temporizador;


campoCidade.addEventListener(
    "input",
    function () {

        // Cancela a pesquisa anterior.
        clearTimeout(
            temporizador
        );


        const texto =
            campoCidade.value.trim();


        // Só procura sugestões com pelo menos
        // três caracteres. (se for menos lascou pra pessoa)
        if (texto.length < 3) {

            sugestoes.innerHTML = "";

            return;
        }


        // Aguarda meio segundo antes de consultar. (nao faz mt diferenca pra mim esse nao)
        temporizador =
            setTimeout(
                function () {

                    buscarSugestoes(texto);

                },
                500
            );
    }
);


// =====================================================
// aqui ce busca as sugestoes
// =====================================================

async function buscarSugestoes(texto) {

    try {

        const url =
            `${API_GEOCODING}` +
            `?name=${encodeURIComponent(texto)}` +
            `&count=5` +
            `&language=pt` +
            `&format=json`;


        const resposta =
            await fetch(url);


        const dados =
            await resposta.json();


        sugestoes.innerHTML =
            "";


        if (!dados.results) {
            return;
        }


        // Cria uma opção para cada cidade.
        dados.results.forEach(
            function (cidade) {

                const item =
                    document.createElement("div");


                item.className =
                    "sugestao";


                item.textContent =
                    `${cidade.name}, ${cidade.country}`;


                // Quando clicar na sugestão.
                item.addEventListener(
                    "click",
                    function () {

                        campoCidade.value =
                            cidade.name;


                        sugestoes.innerHTML =
                            "";


                        consultarTempo(
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


// =====================================================
// melhoria 4 usa a localizacao (esse eu queria fazer e pedi ajuda pro chat me ensinar)
// =====================================================

botaoLocalizacao.addEventListener(
    "click",
    function () {

        mostrarMensagem(
            "Obtendo sua localização..."
        );


        // Verifica se o navegador possui geolocalização. (sei la oque e geolocalizacao direito)
        if (!navigator.geolocation) {

            mostrarMensagem(
                "Seu navegador não suporta localização."
            );

            return;
        }


        // Solicita a localização.
        navigator.geolocation.getCurrentPosition(

            async function (posicao) {

                const latitude =
                    posicao.coords.latitude;


                const longitude =
                    posicao.coords.longitude;


                try {

                    // Descobre qual cidade corresponde
                    // às coordenadas recebidas.
                    const url =
                        `${API_GEOCODING}` +
                        `?latitude=${latitude}` +
                        `&longitude=${longitude}` +
                        `&count=1` +
                        `&language=pt` +
                        `&format=json`;


                    const resposta =
                        await fetch(url);


                    const dados =
                        await resposta.json();


                    let cidade =
                        dados.results?.[0];


                    // Caso não encontre o nome da cidade.
                    if (!cidade) {

                        cidade = {

                            name:
                                "Minha localização",

                            country:
                                "Brasil"
                        };
                    }


                    campoCidade.value =
                        cidade.name;


                    // Busca o clima da localização.
                    await consultarTempo(

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


            function () {

                mostrarMensagem(
                    "Não foi possível acessar sua localização."
                );
            }
        );
    }
);


// =====================================================
// carregamento inicial (e o que carrega)
// =====================================================

// Ao abrir o site, pesquisa Lages. 
// Isso deixa a tela preenchida como no exemplo.
window.addEventListener(
    "load",
    function () {

        campoCidade.value =
            "Lages";


        pesquisarCidadeInicial();
    }
);


// =====================================================
// aqui ce pesquisa tua cidade 
// =====================================================

async function pesquisarCidadeInicial() {

    try {

        const url =
            `${API_GEOCODING}` +
            `?name=Lages` +
            `&count=1` +
            `&language=pt` +
            `&format=json`;


        const resposta =
            await fetch(url);


        const dados =
            await resposta.json();


        if (
            dados.results &&
            dados.results.length > 0
        ) {

            const cidade =
                dados.results[0];


            await consultarTempo(

                cidade.latitude,

                cidade.longitude,

                cidade
            );
        }


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar os dados meteorológicos."
        );
    }
}

// confesso fessor que teve coisas que pedi pro chat meu ajudar a fazer pro site ficar mais bonitin
