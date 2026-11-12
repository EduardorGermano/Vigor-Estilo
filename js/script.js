/* ========================================================= */
/* ELEMENTOS PRINCIPAIS */
/* ========================================================= */

const conteudo = document.getElementById("conteudo");
const tituloPagina = document.getElementById("tituloPagina");
const menuItems = document.querySelectorAll(".menu-item");


/* ========================================================= */
/* TÍTULOS DAS PÁGINAS */
/* ========================================================= */

const titulosPaginas = {
    inicio: "Página Inicial",
    produtos: "Produtos",
    cadastroProduto: "Cadastro de Produto",
    clientes: "Clientes",
    historicoCliente: "Histórico de Compras",
    venda: "Registrar Venda",
    confirmarVenda: "Confirmar Venda",
    vendasPeriodo: "Vendas",
    cancelarVenda: "Cancelar Venda",
    troca: "Troca de Produto",
    entradaMercadoria: "Entrada de Mercadorias",
    estoque: "Estoque"
};


/* ========================================================= */
/* CARREGAR PÁGINA */
/* ========================================================= */

async function carregarPagina(nomePagina) {

    conteudo.innerHTML = `
        <div class="loading">
            Carregando...
        </div>
    `;

    try {

        const resposta = await fetch(
            `pages/${nomePagina}.html`
        );

        if (!resposta.ok) {
            throw new Error(
                `Página não encontrada: ${nomePagina}`
            );
        }

        const html = await resposta.text();

        conteudo.innerHTML = html;

        atualizarTitulo(nomePagina);
        atualizarMenu(nomePagina);
        inicializarPagina(nomePagina);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (erro) {

        console.error(erro);

        conteudo.innerHTML = `
            <div class="erro-pagina">

                <h2>
                    Não foi possível carregar esta página
                </h2>

                <p>
                    Verifique se o arquivo
                    <strong>${nomePagina}.html</strong>
                    existe dentro da pasta pages.
                </p>

            </div>
        `;
    }
}


/* ========================================================= */
/* INICIALIZAÇÃO DAS PÁGINAS */
/* ========================================================= */

function inicializarPagina(nomePagina) {

    if (nomePagina === "historicoCliente") {
        carregarClienteHistorico();
    }

    if (nomePagina === "confirmarVenda") {
        carregarConfirmacaoVenda();
    }

    if (nomePagina === "cancelarVenda") {
        carregarVendaCancelamento();
    }

    if (nomePagina === "vendasPeriodo") {
        sincronizarTabelaVendas();
        filtrarVendasPeriodo();
    }

    if (nomePagina === "venda") {
        renderizarItensVenda();
    }

    if (nomePagina === "entradaMercadoria") {
        inicializarEntradaMercadoria();
    }

    if (nomePagina === "estoque") {
        inicializarEstoque();
    }
}


/* ========================================================= */
/* TÍTULO */
/* ========================================================= */

function atualizarTitulo(nomePagina) {

    tituloPagina.textContent =
        titulosPaginas[nomePagina] ||
        "Vigor & Estilo";
}


/* ========================================================= */
/* MENU */
/* ========================================================= */

function atualizarMenu(nomePagina) {

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.dataset.page === nomePagina
        ) {
            item.classList.add("active");
        }
    });
}


/* ========================================================= */
/* CLIQUES DO MENU */
/* ========================================================= */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            carregarPagina(
                item.dataset.page
            );
        }
    );
});


/* ========================================================= */
/* NAVEGAÇÃO GLOBAL */
/* ========================================================= */

function abrirPagina(nomePagina) {
    carregarPagina(nomePagina);
}


/* ========================================================= */
/* FUNÇÕES AUXILIARES */
/* ========================================================= */

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function formatarDataEntrada(data) {

    if (!data) {
        return "-";
    }

    const partes = data.split("-");

    return (
        partes[2]
        + "/"
        + partes[1]
        + "/"
        + partes[0]
    );
}


/* ========================================================= */
/* PRODUTOS DO SISTEMA */
/* ========================================================= */

const produtosVenda = {

    whey: {
        nome: "Whey Protein",
        variacao: "Chocolate - 1 kg",
        preco: 149.90,
        estoque: 12
    },

    creatina: {
        nome: "Creatina",
        variacao: "250 g",
        preco: 89.90,
        estoque: 3
    },

    camisetaM: {
        nome: "Camiseta Dry Fit",
        variacao: "Preta - M",
        preco: 69.90,
        estoque: 2
    },

    camisetaG: {
        nome: "Camiseta Dry Fit",
        variacao: "Preta - G",
        preco: 69.90,
        estoque: 9
    },

    preTreino: {
        nome: "Pré-Treino Haze",
        variacao: "Frutas Vermelhas - 300 g",
        preco: 99.90,
        estoque: 6
    }
};


/* ========================================================= */
/* INFORMAÇÕES DE ESTOQUE */
/* ========================================================= */

const dadosProdutosEstoque = {

    whey: {
        categoria: "Suplemento",
        minimo: 5
    },

    creatina: {
        categoria: "Suplemento",
        minimo: 5
    },

    camisetaM: {
        categoria: "Roupa",
        minimo: 4
    },

    camisetaG: {
        categoria: "Roupa",
        minimo: 4
    },

    preTreino: {
        categoria: "Suplemento",
        minimo: 3
    }
};


/* ========================================================= */
/* REMESSAS DOS SUPLEMENTOS */
/* ========================================================= */

let remessasEstoque = [

    {
        codigo: "whey",
        lote: "WH202608",
        quantidade: 5,
        validade: "2027-03-15"
    },

    {
        codigo: "whey",
        lote: "WH202610",
        quantidade: 7,
        validade: "2027-07-20"
    },

    {
        codigo: "creatina",
        lote: "CR202609",
        quantidade: 3,
        validade: "2027-02-10"
    },

    {
        codigo: "preTreino",
        lote: "HZ202604",
        quantidade: 2,
        validade: "2026-12-20"
    },

    {
        codigo: "preTreino",
        lote: "HZ202608",
        quantidade: 4,
        validade: "2027-05-15"
    }
];


/* ========================================================= */
/* LISTA DE PRODUTOS */
/* ========================================================= */

function filtrarProdutos() {

    const campoPesquisa =
        document.getElementById(
            "pesquisaProduto"
        );

    const campoCategoria =
        document.getElementById(
            "filtroCategoria"
        );

    const tabela =
        document.getElementById(
            "tabelaProdutos"
        );

    const nenhumProduto =
        document.getElementById(
            "nenhumProduto"
        );

    if (
        !campoPesquisa ||
        !campoCategoria ||
        !tabela
    ) {
        return;
    }

    const pesquisa =
        campoPesquisa.value
            .toLowerCase()
            .trim();

    const categoria =
        campoCategoria.value;

    const linhas =
        tabela.querySelectorAll(
            "tbody tr"
        );

    let quantidadeVisivel = 0;

    linhas.forEach(linha => {

        const textoPesquisa =
            linha.dataset.pesquisa
                .toLowerCase();

        const categoriaProduto =
            linha.dataset.categoria;

        const correspondePesquisa =
            textoPesquisa.includes(
                pesquisa
            );

        const correspondeCategoria =
            categoria === "" ||
            categoriaProduto === categoria;

        if (
            correspondePesquisa &&
            correspondeCategoria
        ) {

            linha.style.display = "";
            quantidadeVisivel++;

        } else {

            linha.style.display =
                "none";
        }
    });

    if (nenhumProduto) {

        nenhumProduto.style.display =
            quantidadeVisivel === 0
                ? "flex"
                : "none";
    }
}


/* ========================================================= */
/* DETALHES DO PRODUTO */
/* ========================================================= */

function abrirDetalhesProduto(botao) {

    const modal =
        document.getElementById(
            "modalProduto"
        );

    if (!modal) {
        return;
    }

    document.getElementById(
        "detalheNome"
    ).textContent =
        botao.dataset.nome;

    document.getElementById(
        "detalheCategoria"
    ).textContent =
        botao.dataset.categoria;

    document.getElementById(
        "detalheMarca"
    ).textContent =
        botao.dataset.marca;

    document.getElementById(
        "detalheVariacao"
    ).textContent =
        botao.dataset.variacao;

    document.getElementById(
        "detalheEstoque"
    ).textContent =
        botao.dataset.estoque;

    document.getElementById(
        "detalheMinimo"
    ).textContent =
        botao.dataset.minimo;

    document.getElementById(
        "detalhePreco"
    ).textContent =
        botao.dataset.preco;

    document.getElementById(
        "detalheStatus"
    ).textContent =
        botao.dataset.status;

    modal.classList.add(
        "active"
    );
}


function fecharDetalhesProduto() {

    const modal =
        document.getElementById(
            "modalProduto"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


/* ========================================================= */
/* CADASTRO DE PRODUTO */
/* ========================================================= */

function alterarCamposCategoria() {

    const categoria =
        document.getElementById(
            "categoriaProduto"
        );

    const camposSuplemento =
        document.getElementById(
            "camposSuplemento"
        );

    const camposRoupa =
        document.getElementById(
            "camposRoupa"
        );

    if (
        !categoria ||
        !camposSuplemento ||
        !camposRoupa
    ) {
        return;
    }

    camposSuplemento.style.display =
        "none";

    camposRoupa.style.display =
        "none";

    if (
        categoria.value ===
        "Suplemento"
    ) {

        camposSuplemento.style.display =
            "block";
    }

    if (
        categoria.value ===
        "Roupa"
    ) {

        camposRoupa.style.display =
            "block";
    }
}


function salvarProduto(event) {

    event.preventDefault();

    const nome =
        document.getElementById(
            "nomeProduto"
        ).value.trim();

    const categoria =
        document.getElementById(
            "categoriaProduto"
        ).value;

    const marca =
        document.getElementById(
            "marcaProduto"
        ).value.trim();

    const preco =
        document.getElementById(
            "precoProduto"
        ).value;

    const estoqueMinimo =
        document.getElementById(
            "estoqueMinimo"
        ).value;

    if (
        nome === "" ||
        categoria === "" ||
        marca === "" ||
        preco === "" ||
        estoqueMinimo === ""
    ) {

        mostrarMensagemProduto(
            "Preencha todos os campos obrigatórios.",
            "error"
        );

        return;
    }

    if (
        categoria === "Suplemento"
    ) {

        const sabor =
            document.getElementById(
                "saborProduto"
            ).value.trim();

        const peso =
            document.getElementById(
                "pesoProduto"
            ).value.trim();

        if (
            sabor === "" ||
            peso === ""
        ) {

            mostrarMensagemProduto(
                "Informe o sabor e o peso do suplemento.",
                "error"
            );

            return;
        }
    }

    if (
        categoria === "Roupa"
    ) {

        const modelo =
            document.getElementById(
                "modeloProduto"
            ).value.trim();

        const cor =
            document.getElementById(
                "corProduto"
            ).value.trim();

        const tamanho =
            document.getElementById(
                "tamanhoProduto"
            ).value;

        if (
            modelo === "" ||
            cor === "" ||
            tamanho === ""
        ) {

            mostrarMensagemProduto(
                "Informe modelo, cor e tamanho da roupa.",
                "error"
            );

            return;
        }
    }

    mostrarMensagemProduto(
        "Produto cadastrado com sucesso.",
        "success"
    );

    setTimeout(
        () => {
            abrirPagina("produtos");
        },
        800
    );
}


function mostrarMensagemProduto(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemProduto"
        );

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;

    mensagem.className =
        `form-message ${tipo}`;
}


/* ========================================================= */
/* CLIENTES */
/* ========================================================= */

function filtrarClientes() {

    const campo =
        document.getElementById(
            "pesquisaCliente"
        );

    const tabela =
        document.getElementById(
            "tabelaClientes"
        );

    const vazio =
        document.getElementById(
            "nenhumCliente"
        );

    if (!campo || !tabela) {
        return;
    }

    const pesquisa =
        campo.value
            .toLowerCase()
            .trim();

    const linhas =
        tabela.querySelectorAll(
            "tbody tr"
        );

    let visiveis = 0;

    linhas.forEach(linha => {

        const texto =
            linha.dataset.pesquisa
                .toLowerCase();

        if (
            texto.includes(pesquisa)
        ) {

            linha.style.display = "";
            visiveis++;

        } else {

            linha.style.display =
                "none";
        }
    });

    if (vazio) {

        vazio.style.display =
            visiveis === 0
                ? "flex"
                : "none";
    }
}


function abrirModalCliente() {

    const modal =
        document.getElementById(
            "modalNovoCliente"
        );

    if (modal) {
        modal.classList.add(
            "active"
        );
    }
}


function fecharModalCliente() {

    const modal =
        document.getElementById(
            "modalNovoCliente"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


function salvarCliente(event) {

    event.preventDefault();

    const nome =
        document.getElementById(
            "novoClienteNome"
        ).value.trim();

    const mensagem =
        document.getElementById(
            "mensagemCliente"
        );

    if (nome === "") {

        mensagem.textContent =
            "Informe o nome do cliente.";

        mensagem.className =
            "form-message error";

        return;
    }

    mensagem.textContent =
        "Cliente cadastrado com sucesso.";

    mensagem.className =
        "form-message success";

    setTimeout(
        fecharModalCliente,
        800
    );
}


function abrirDetalhesCliente(botao) {

    document.getElementById(
        "clienteDetalheNome"
    ).textContent =
        botao.dataset.nome;

    document.getElementById(
        "clienteDetalheTelefone"
    ).textContent =
        botao.dataset.telefone;

    document.getElementById(
        "clienteDetalheSaldo"
    ).textContent =
        botao.dataset.saldo;

    document.getElementById(
        "clienteDetalheStatus"
    ).textContent =
        botao.dataset.status;

    document.getElementById(
        "modalDetalhesCliente"
    ).classList.add(
        "active"
    );
}


function fecharDetalhesCliente() {

    const modal =
        document.getElementById(
            "modalDetalhesCliente"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


/* ========================================================= */
/* HISTÓRICO DO CLIENTE */
/* ========================================================= */

function abrirHistoricoCliente(nome) {

    sessionStorage.setItem(
        "clienteHistorico",
        nome
    );

    abrirPagina(
        "historicoCliente"
    );
}


function carregarClienteHistorico() {

    const nome =
        sessionStorage.getItem(
            "clienteHistorico"
        );

    const campo =
        document.getElementById(
            "nomeClienteHistorico"
        );

    if (nome && campo) {
        campo.textContent = nome;
    }
}


const comprasHistorico = {

    "00125": [

        {
            produto: "Whey Protein",
            variacao: "Chocolate - 1 kg",
            quantidade: 1,
            valor: "R$ 149,90",
            subtotal: "R$ 149,90"
        },

        {
            produto: "Barra de Proteína",
            variacao: "Chocolate",
            quantidade: 2,
            valor: "R$ 15,05",
            subtotal: "R$ 30,10"
        }
    ],

    "00103": [

        {
            produto: "Creatina",
            variacao: "250 g",
            quantidade: 1,
            valor: "R$ 89,90",
            subtotal: "R$ 89,90"
        },

        {
            produto: "Camiseta Dry Fit",
            variacao: "Preta - M",
            quantidade: 1,
            valor: "R$ 70,00",
            subtotal: "R$ 70,00"
        }
    ],

    "00087": [

        {
            produto: "Camiseta Dry Fit",
            variacao: "Preta - G",
            quantidade: 1,
            valor: "R$ 69,90",
            subtotal: "R$ 69,90"
        },

        {
            produto: "Barra de Proteína",
            variacao: "Chocolate",
            quantidade: 4,
            valor: "R$ 14,97",
            subtotal: "R$ 59,90"
        }
    ]
};


function abrirItensCompra(
    numeroVenda
) {

    const modal =
        document.getElementById(
            "modalItensCompra"
        );

    const tabela =
        document.getElementById(
            "itensCompraTabela"
        );

    const titulo =
        document.getElementById(
            "numeroVendaHistorico"
        );

    if (
        !modal ||
        !tabela ||
        !titulo
    ) {
        return;
    }

    titulo.textContent =
        `Venda #${numeroVenda}`;

    tabela.innerHTML = "";

    const itens =
        comprasHistorico[numeroVenda] ||
        [];

    itens.forEach(item => {

        tabela.innerHTML += `
            <tr>
                <td>${item.produto}</td>
                <td>${item.variacao}</td>
                <td>${item.quantidade}</td>
                <td>${item.valor}</td>
                <td>${item.subtotal}</td>
            </tr>
        `;
    });

    modal.classList.add(
        "active"
    );
}


function fecharItensCompra() {

    const modal =
        document.getElementById(
            "modalItensCompra"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


/* ========================================================= */
/* REGISTRAR VENDA */
/* ========================================================= */

let itensVenda = [];

let percentualDescontoAutorizado =
    null;


function adicionarProdutoVenda() {

    const selectProduto =
        document.getElementById(
            "produtoVenda"
        );

    const campoQuantidade =
        document.getElementById(
            "quantidadeProdutoVenda"
        );

    if (
        !selectProduto ||
        !campoQuantidade
    ) {
        return;
    }

    const codigo =
        selectProduto.value;

    const quantidade =
        Number(
            campoQuantidade.value
        );

    if (
        codigo === "" ||
        quantidade <= 0
    ) {

        mostrarMensagemVenda(
            "Selecione um produto e informe uma quantidade válida.",
            "error"
        );

        return;
    }

    const produto =
        produtosVenda[codigo];

    if (
        quantidade >
        produto.estoque
    ) {

        mostrarMensagemVenda(
            `Estoque insuficiente. Disponível: ${produto.estoque} unidade(s).`,
            "error"
        );

        return;
    }

    const existente =
        itensVenda.find(
            item =>
                item.codigo === codigo
        );

    if (existente) {

        const novaQuantidade =
            existente.quantidade +
            quantidade;

        if (
            novaQuantidade >
            produto.estoque
        ) {

            mostrarMensagemVenda(
                `A quantidade total ultrapassa o estoque disponível (${produto.estoque}).`,
                "error"
            );

            return;
        }

        existente.quantidade =
            novaQuantidade;

    } else {

        itensVenda.push({

            codigo,
            nome: produto.nome,
            variacao: produto.variacao,
            preco: produto.preco,
            quantidade,
            estoque: produto.estoque
        });
    }

    selectProduto.value = "";
    campoQuantidade.value = 1;

    mostrarMensagemVenda(
        "Produto adicionado à venda.",
        "success"
    );

    renderizarItensVenda();
}


function renderizarItensVenda() {

    const tabela =
        document.getElementById(
            "itensVendaTabela"
        );

    if (!tabela) {
        return;
    }

    if (
        itensVenda.length === 0
    ) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="venda-vazia"
                >
                    Nenhum produto adicionado.
                </td>
            </tr>
        `;

        calcularVenda();

        return;
    }

    tabela.innerHTML = "";

    itensVenda.forEach(
        (item, index) => {

            const subtotal =
                item.preco *
                item.quantidade;

            tabela.innerHTML += `
                <tr>

                    <td>
                        <div class="produto-nome">
                            <strong>
                                ${item.nome}
                            </strong>

                            <span>
                                ${item.variacao}
                            </span>
                        </div>
                    </td>

                    <td>
                        ${formatarMoeda(
                item.preco
            )}
                    </td>

                    <td>
                        <div class="quantidade-controle">

                            <button
                                onclick="alterarQuantidadeVenda(${index}, -1)"
                            >
                                -
                            </button>

                            <span>
                                ${item.quantidade}
                            </span>

                            <button
                                onclick="alterarQuantidadeVenda(${index}, 1)"
                            >
                                +
                            </button>

                        </div>
                    </td>

                    <td>
                        ${formatarMoeda(
                subtotal
            )}
                    </td>

                    <td>
                        <button
                            class="btn-table"
                            onclick="removerItemVenda(${index})"
                        >
                            Remover
                        </button>
                    </td>

                </tr>
            `;
        }
    );

    calcularVenda();
}


function alterarQuantidadeVenda(
    index,
    alteracao
) {

    const item =
        itensVenda[index];

    const novaQuantidade =
        item.quantidade +
        alteracao;

    if (
        novaQuantidade <= 0
    ) {

        removerItemVenda(index);

        return;
    }

    if (
        novaQuantidade >
        item.estoque
    ) {

        mostrarMensagemVenda(
            `Estoque máximo disponível: ${item.estoque}.`,
            "error"
        );

        return;
    }

    item.quantidade =
        novaQuantidade;

    renderizarItensVenda();
}


function removerItemVenda(index) {

    itensVenda.splice(
        index,
        1
    );

    renderizarItensVenda();
}


function calcularVenda() {

    const subtotal =
        itensVenda.reduce(
            (total, item) =>
                total +
                item.preco *
                item.quantidade,
            0
        );

    const quantidadeItens =
        itensVenda.reduce(
            (total, item) =>
                total +
                item.quantidade,
            0
        );

    const campoDesconto =
        document.getElementById(
            "descontoVenda"
        );

    let desconto = 0;

    if (campoDesconto) {

        desconto =
            Number(
                campoDesconto.value
            ) || 0;
    }

    desconto =
        Math.min(
            Math.max(
                desconto,
                0
            ),
            100
        );

    const valorDesconto =
        subtotal *
        desconto /
        100;

    const total =
        subtotal -
        valorDesconto;

    const campoSubtotal =
        document.getElementById(
            "subtotalVenda"
        );

    const campoTotal =
        document.getElementById(
            "totalVenda"
        );

    const campoItens =
        document.getElementById(
            "totalItensVenda"
        );

    if (campoSubtotal) {

        campoSubtotal.textContent =
            formatarMoeda(
                subtotal
            );
    }

    if (campoTotal) {

        campoTotal.textContent =
            formatarMoeda(
                total
            );
    }

    if (campoItens) {

        campoItens.textContent =
            quantidadeItens;
    }

    const aviso =
        document.getElementById(
            "avisoDesconto"
        );

    if (aviso) {

        aviso.style.display =
            desconto > 5
                ? "block"
                : "none";
    }

    return {
        subtotal,
        desconto,
        total,
        quantidadeItens
    };
}


/* ========================================================= */
/* PAGAMENTO */
/* ========================================================= */

function alterarFormaPagamento() {

    const pagamento =
        document.getElementById(
            "formaPagamentoVenda"
        );

    const campoVencimento =
        document.getElementById(
            "campoVencimentoFiado"
        );

    if (
        !pagamento ||
        !campoVencimento
    ) {
        return;
    }

    campoVencimento.style.display =
        pagamento.value === "Fiado"
            ? "flex"
            : "none";
}


/* ========================================================= */
/* PREPARAR CONFIRMAÇÃO */
/* ========================================================= */

function prepararConfirmacaoVenda() {

    if (
        itensVenda.length === 0
    ) {

        mostrarMensagemVenda(
            "Adicione pelo menos um produto à venda.",
            "error"
        );

        return;
    }

    const formaPagamento =
        document.getElementById(
            "formaPagamentoVenda"
        ).value;

    if (
        formaPagamento === ""
    ) {

        mostrarMensagemVenda(
            "Selecione a forma de pagamento.",
            "error"
        );

        return;
    }

    const cliente =
        document.getElementById(
            "clienteVenda"
        ).value;

    if (
        formaPagamento === "Fiado" &&
        cliente === ""
    ) {

        mostrarMensagemVenda(
            "Vendas a prazo precisam estar associadas a um cliente.",
            "error"
        );

        return;
    }

    let vencimento = "";

    if (
        formaPagamento === "Fiado"
    ) {

        vencimento =
            document.getElementById(
                "vencimentoFiado"
            ).value;

        if (
            vencimento === ""
        ) {

            mostrarMensagemVenda(
                "Informe a data de vencimento.",
                "error"
            );

            return;
        }
    }

    const valores =
        calcularVenda();

    if (
        valores.desconto > 5 &&
        percentualDescontoAutorizado
        !== valores.desconto
    ) {

        abrirAutorizacaoDesconto();

        return;
    }

    const venda = {

        cliente:
            cliente ||
            "Não identificado",

        formaPagamento,
        vencimento,

        subtotal:
            valores.subtotal,

        desconto:
            valores.desconto,

        total:
            valores.total,

        itens:
            itensVenda
    };

    sessionStorage.setItem(
        "vendaAtual",
        JSON.stringify(venda)
    );

    abrirPagina(
        "confirmarVenda"
    );
}


/* ========================================================= */
/* AUTORIZAÇÃO DE DESCONTO */
/* ========================================================= */

function abrirAutorizacaoDesconto() {

    const modal =
        document.getElementById(
            "modalAutorizarDesconto"
        );

    if (modal) {
        modal.classList.add(
            "active"
        );
    }
}


function fecharAutorizacaoDesconto() {

    const modal =
        document.getElementById(
            "modalAutorizarDesconto"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


function autorizarDesconto() {

    const senha =
        document.getElementById(
            "senhaAdministrador"
        ).value;

    const mensagem =
        document.getElementById(
            "mensagemAutorizacao"
        );

    /*
    Senha fictícia apenas
    para o protótipo.
    */

    if (
        senha !== "1234"
    ) {

        mensagem.textContent =
            "Senha incorreta.";

        mensagem.className =
            "form-message error";

        return;
    }

    const campoDesconto =
        document.getElementById(
            "descontoVenda"
        );

    percentualDescontoAutorizado =
        Number(
            campoDesconto.value
        );

    mensagem.textContent =
        "Desconto autorizado.";

    mensagem.className =
        "form-message success";

    setTimeout(
        () => {

            fecharAutorizacaoDesconto();

            prepararConfirmacaoVenda();
        },
        500
    );
}


function mostrarMensagemVenda(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemVenda"
        );

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;

    mensagem.className =
        `form-message ${tipo}`;
}


/* ========================================================= */
/* CONFIRMAÇÃO DA VENDA */
/* ========================================================= */

function carregarConfirmacaoVenda() {

    const dados =
        sessionStorage.getItem(
            "vendaAtual"
        );

    if (!dados) {
        return;
    }

    const venda =
        JSON.parse(dados);

    const campoCliente =
        document.getElementById(
            "confirmarCliente"
        );

    if (!campoCliente) {
        return;
    }

    campoCliente.textContent =
        venda.cliente;

    document.getElementById(
        "confirmarPagamento"
    ).textContent =
        venda.formaPagamento;

    document.getElementById(
        "confirmarSubtotal"
    ).textContent =
        formatarMoeda(
            venda.subtotal
        );

    document.getElementById(
        "confirmarDesconto"
    ).textContent =
        `${venda.desconto}%`;

    document.getElementById(
        "confirmarTotal"
    ).textContent =
        formatarMoeda(
            venda.total
        );

    if (
        venda.formaPagamento ===
        "Fiado"
    ) {

        const container =
            document.getElementById(
                "confirmarVencimentoContainer"
            );

        if (container) {
            container.style.display =
                "flex";
        }

        document.getElementById(
            "confirmarVencimento"
        ).textContent =
            venda.vencimento;
    }

    const tabela =
        document.getElementById(
            "confirmarItensVenda"
        );

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    venda.itens.forEach(item => {

        tabela.innerHTML += `
            <tr>

                <td>
                    <div class="produto-nome">

                        <strong>
                            ${item.nome}
                        </strong>

                        <span>
                            ${item.variacao}
                        </span>

                    </div>
                </td>

                <td>
                    ${item.quantidade}
                </td>

                <td>
                    ${formatarMoeda(
            item.preco
        )}
                </td>

                <td>
                    ${formatarMoeda(
            item.preco *
            item.quantidade
        )}
                </td>

            </tr>
        `;
    });
}


/* ========================================================= */
/* CONCLUIR VENDA */
/* ========================================================= */

function concluirVenda() {

    const dados =
        sessionStorage.getItem(
            "vendaAtual"
        );

    if (!dados) {
        return;
    }

    const venda =
        JSON.parse(dados);

    /*
    Simula a saída das quantidades
    do estoque.
    */

    venda.itens.forEach(item => {

        if (
            produtosVenda[item.codigo]
        ) {

            produtosVenda[
                item.codigo
            ].estoque -=
                item.quantidade;

            if (
                produtosVenda[
                    item.codigo
                ].estoque < 0
            ) {

                produtosVenda[
                    item.codigo
                ].estoque = 0;
            }
        }
    });

    const mensagem =
        document.getElementById(
            "vendaConcluida"
        );

    if (mensagem) {
        mensagem.style.display =
            "flex";
    }

    sessionStorage.removeItem(
        "vendaAtual"
    );

    itensVenda = [];

    percentualDescontoAutorizado =
        null;

    setTimeout(
        () => {
            abrirPagina("inicio");
        },
        1500
    );
}


/* ========================================================= */
/* VENDAS DO SISTEMA */
/* ========================================================= */

const vendasSistema = {

    "00131": {

        data: "12/11/2026",
        cliente: "João da Silva",
        pagamento: "PIX",
        total: 219.80,
        status: "Concluída",

        itens: [

            {
                produto:
                    "Whey Protein",

                variacao:
                    "Chocolate - 1 kg",

                quantidade: 1,
                subtotal: 149.90
            },

            {
                produto:
                    "Camiseta Dry Fit",

                variacao:
                    "Preta - M",

                quantidade: 1,
                subtotal: 69.90
            }
        ]
    },


    "00125": {

        data: "10/11/2026",
        cliente: "João da Silva",
        pagamento: "Fiado",
        total: 180.00,
        status: "Concluída",

        itens: [

            {
                produto:
                    "Whey Protein",

                variacao:
                    "Chocolate - 1 kg",

                quantidade: 1,
                subtotal: 149.90
            },

            {
                produto:
                    "Barra de Proteína",

                variacao:
                    "Chocolate",

                quantidade: 2,
                subtotal: 30.10
            }
        ]
    },


    "00119": {

        data: "08/11/2026",
        cliente:
            "Não identificado",

        pagamento: "Débito",
        total: 149.90,
        status: "Cancelada",

        itens: [

            {
                produto:
                    "Whey Protein",

                variacao:
                    "Chocolate - 1 kg",

                quantidade: 1,
                subtotal: 149.90
            }
        ]
    },


    "00112": {

        data: "05/11/2026",
        cliente:
            "Maria Aparecida",

        pagamento: "Crédito",
        total: 339.70,
        status: "Concluída",

        itens: [

            {
                produto:
                    "Whey Protein",

                variacao:
                    "Chocolate - 1 kg",

                quantidade: 2,
                subtotal: 299.80
            },

            {
                produto:
                    "Barra de Proteína",

                variacao:
                    "Chocolate",

                quantidade: 2,
                subtotal: 39.90
            }
        ]
    },


    "00105": {

        data: "02/11/2026",
        cliente:
            "Carlos Eduardo",

        pagamento: "PIX",
        total: 169.90,
        status: "Concluída",

        itens: [

            {
                produto:
                    "Pré-Treino Haze",

                variacao:
                    "Frutas Vermelhas - 300 g",

                quantidade: 1,
                subtotal: 99.90
            },

            {
                produto:
                    "Camiseta Dry Fit",

                variacao:
                    "Preta - G",

                quantidade: 1,
                subtotal: 70.00
            }
        ]
    }
};


/* ========================================================= */
/* VENDAS POR PERÍODO */
/* ========================================================= */

function sincronizarTabelaVendas() {

    const tabela =
        document.getElementById(
            "tabelaVendasPeriodo"
        );

    if (!tabela) {
        return;
    }

    const linhas =
        tabela.querySelectorAll(
            "tbody tr"
        );

    linhas.forEach(linha => {

        const primeiraCelula =
            linha.querySelector("td");

        if (!primeiraCelula) {
            return;
        }

        const numero =
            primeiraCelula.textContent
                .replace("#", "")
                .trim();

        const venda =
            vendasSistema[numero];

        if (!venda) {
            return;
        }

        linha.dataset.status =
            venda.status;

        const celulas =
            linha.querySelectorAll(
                "td"
            );

        const statusCelula =
            celulas[5];

        const acoesCelula =
            celulas[6];

        if (
            venda.status ===
            "Cancelada"
        ) {

            statusCelula.innerHTML = `
                <span class="badge badge-danger">
                    Cancelada
                </span>
            `;

            const botoes =
                acoesCelula.querySelectorAll(
                    "button"
                );

            botoes.forEach(botao => {

                if (
                    botao.textContent
                        .trim() ===
                    "Cancelar"
                ) {

                    botao.remove();
                }
            });
        }
    });
}


function filtrarVendasPeriodo() {

    const campoInicial =
        document.getElementById(
            "dataInicialVenda"
        );

    const campoFinal =
        document.getElementById(
            "dataFinalVenda"
        );

    const tabela =
        document.getElementById(
            "tabelaVendasPeriodo"
        );

    if (
        !campoInicial ||
        !campoFinal ||
        !tabela
    ) {
        return;
    }

    const dataInicial =
        campoInicial.value;

    const dataFinal =
        campoFinal.value;

    const linhas =
        tabela.querySelectorAll(
            "tbody tr"
        );

    let quantidade = 0;
    let total = 0;
    let canceladas = 0;

    linhas.forEach(linha => {

        const data =
            linha.dataset.data;

        let mostrar = true;

        if (
            dataInicial !== "" &&
            data < dataInicial
        ) {
            mostrar = false;
        }

        if (
            dataFinal !== "" &&
            data > dataFinal
        ) {
            mostrar = false;
        }

        linha.style.display =
            mostrar
                ? ""
                : "none";

        if (mostrar) {

            quantidade++;

            if (
                linha.dataset.status ===
                "Cancelada"
            ) {

                canceladas++;

            } else {

                total +=
                    Number(
                        linha.dataset.total
                    );
            }
        }
    });

    const quantidadeCampo =
        document.getElementById(
            "quantidadeVendasPeriodo"
        );

    const totalCampo =
        document.getElementById(
            "totalVendasPeriodo"
        );

    const canceladasCampo =
        document.getElementById(
            "vendasCanceladasPeriodo"
        );

    if (quantidadeCampo) {
        quantidadeCampo.textContent =
            quantidade;
    }

    if (totalCampo) {
        totalCampo.textContent =
            formatarMoeda(total);
    }

    if (canceladasCampo) {
        canceladasCampo.textContent =
            canceladas;
    }

    const vazio =
        document.getElementById(
            "nenhumaVendaPeriodo"
        );

    if (vazio) {

        vazio.style.display =
            quantidade === 0
                ? "flex"
                : "none";
    }
}


/* ========================================================= */
/* DETALHES DA VENDA */
/* ========================================================= */

function abrirDetalhesVenda(numero) {

    const venda =
        vendasSistema[numero];

    if (!venda) {
        return;
    }

    document.getElementById(
        "numeroVendaDetalhes"
    ).textContent =
        `Venda #${numero}`;

    const dados =
        document.getElementById(
            "dadosVendaDetalhes"
        );

    dados.innerHTML = `

        <div class="detalhe-item">
            <span>Data</span>
            <strong>${venda.data}</strong>
        </div>

        <div class="detalhe-item">
            <span>Cliente</span>
            <strong>${venda.cliente}</strong>
        </div>

        <div class="detalhe-item">
            <span>Pagamento</span>
            <strong>${venda.pagamento}</strong>
        </div>

        <div class="detalhe-item">
            <span>Total</span>
            <strong>
                ${formatarMoeda(
        venda.total
    )}
            </strong>
        </div>

        <div class="detalhe-item">
            <span>Status</span>
            <strong>${venda.status}</strong>
        </div>
    `;

    const tabela =
        document.getElementById(
            "itensVendaDetalhes"
        );

    tabela.innerHTML = "";

    venda.itens.forEach(item => {

        tabela.innerHTML += `
            <tr>
                <td>${item.produto}</td>
                <td>${item.variacao}</td>
                <td>${item.quantidade}</td>
                <td>
                    ${formatarMoeda(
            item.subtotal
        )}
                </td>
            </tr>
        `;
    });

    document.getElementById(
        "modalDetalhesVenda"
    ).classList.add(
        "active"
    );
}


function fecharDetalhesVenda() {

    const modal =
        document.getElementById(
            "modalDetalhesVenda"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


/* ========================================================= */
/* CANCELAMENTO */
/* ========================================================= */

function abrirCancelamentoVenda(
    numero
) {

    sessionStorage.setItem(
        "vendaCancelar",
        numero
    );

    abrirPagina(
        "cancelarVenda"
    );
}


function carregarVendaCancelamento() {

    const numero =
        sessionStorage.getItem(
            "vendaCancelar"
        );

    const venda =
        vendasSistema[numero];

    if (
        !numero ||
        !venda
    ) {
        return;
    }

    const campoNumero =
        document.getElementById(
            "cancelarVendaNumero"
        );

    if (!campoNumero) {
        return;
    }

    campoNumero.textContent =
        `#${numero}`;

    document.getElementById(
        "cancelarVendaData"
    ).textContent =
        venda.data;

    document.getElementById(
        "cancelarVendaCliente"
    ).textContent =
        venda.cliente;

    document.getElementById(
        "cancelarVendaValor"
    ).textContent =
        formatarMoeda(
            venda.total
        );
}


function confirmarCancelamentoVenda() {

    const campoMotivo =
        document.getElementById(
            "motivoCancelamentoVenda"
        );

    const mensagem =
        document.getElementById(
            "mensagemCancelamento"
        );

    if (
        !campoMotivo ||
        !mensagem
    ) {
        return;
    }

    const motivo =
        campoMotivo.value.trim();

    if (
        motivo === ""
    ) {

        mensagem.textContent =
            "Informe o motivo do cancelamento.";

        mensagem.className =
            "form-message error";

        return;
    }

    const numero =
        sessionStorage.getItem(
            "vendaCancelar"
        );

    if (
        numero &&
        vendasSistema[numero]
    ) {

        vendasSistema[
            numero
        ].status =
            "Cancelada";

        vendasSistema[
            numero
        ].motivoCancelamento =
            motivo;
    }

    const sucesso =
        document.getElementById(
            "cancelamentoConcluido"
        );

    if (sucesso) {
        sucesso.style.display =
            "flex";
    }

    mensagem.style.display =
        "none";

    sessionStorage.removeItem(
        "vendaCancelar"
    );

    setTimeout(
        () => {
            abrirPagina(
                "vendasPeriodo"
            );
        },
        1500
    );
}


/* ========================================================= */
/* TROCA DE PRODUTO */
/* ========================================================= */

let vendaSelecionadaTroca = null;
let itemDevolvidoTroca = null;
let itemSubstitutoTroca = null;


function localizarVendaTroca() {

    const campoNumero =
        document.getElementById(
            "numeroVendaTroca"
        );

    if (!campoNumero) {
        return;
    }

    const numero =
        campoNumero.value
            .replace("#", "")
            .trim();

    if (
        numero === ""
    ) {

        mostrarMensagemTroca(
            "Informe o número da venda.",
            "error"
        );

        return;
    }

    const venda =
        vendasSistema[numero];

    if (!venda) {

        mostrarMensagemTroca(
            "Venda não encontrada.",
            "error"
        );

        return;
    }

    if (
        venda.status ===
        "Cancelada"
    ) {

        mostrarMensagemTroca(
            "Não é possível registrar troca para uma venda cancelada.",
            "error"
        );

        return;
    }

    vendaSelecionadaTroca = {
        numero,
        ...venda
    };

    carregarDadosVendaTroca();
}


function carregarDadosVendaTroca() {

    if (!vendaSelecionadaTroca) {
        return;
    }

    document.getElementById(
        "dadosVendaTroca"
    ).style.display =
        "block";

    document.getElementById(
        "etapaProdutoDevolvido"
    ).style.display =
        "block";

    document.getElementById(
        "trocaVendaNumero"
    ).textContent =
        `#${vendaSelecionadaTroca.numero}`;

    document.getElementById(
        "trocaVendaData"
    ).textContent =
        vendaSelecionadaTroca.data;

    document.getElementById(
        "trocaVendaCliente"
    ).textContent =
        vendaSelecionadaTroca.cliente;

    document.getElementById(
        "trocaVendaValor"
    ).textContent =
        formatarMoeda(
            vendaSelecionadaTroca.total
        );

    const select =
        document.getElementById(
            "produtoDevolvido"
        );

    select.innerHTML = `
        <option value="">
            Selecione
        </option>
    `;

    vendaSelecionadaTroca.itens
        .forEach(
            (item, index) => {

                select.innerHTML += `
                    <option value="${index}">
                        ${item.produto}
                        -
                        ${item.variacao}
                    </option>
                `;
            }
        );

    mostrarMensagemTroca(
        "Venda localizada com sucesso.",
        "success"
    );
}


function selecionarProdutoDevolvido() {

    const select =
        document.getElementById(
            "produtoDevolvido"
        );

    if (
        !select ||
        select.value === ""
    ) {

        itemDevolvidoTroca =
            null;

        return;
    }

    const index =
        Number(
            select.value
        );

    itemDevolvidoTroca =
        vendaSelecionadaTroca
            .itens[index];

    document.getElementById(
        "devolvidoNome"
    ).textContent =
        `${itemDevolvidoTroca.produto} - ${itemDevolvidoTroca.variacao}`;

    const valorUnitario =
        itemDevolvidoTroca.subtotal /
        itemDevolvidoTroca.quantidade;

    document.getElementById(
        "devolvidoValor"
    ).textContent =
        formatarMoeda(
            valorUnitario
        );

    document.getElementById(
        "resumoProdutoDevolvido"
    ).style.display =
        "grid";

    document.getElementById(
        "etapaProdutoSubstituto"
    ).style.display =
        "block";

    itemSubstitutoTroca =
        null;

    document.getElementById(
        "produtoSubstituto"
    ).value =
        "";

    document.getElementById(
        "resumoProdutoSubstituto"
    ).style.display =
        "none";

    document.getElementById(
        "etapaDiferencaTroca"
    ).style.display =
        "none";

    document.getElementById(
        "etapaEfeitosTroca"
    ).style.display =
        "none";

    document.getElementById(
        "acoesTroca"
    ).style.display =
        "none";
}


function selecionarProdutoSubstituto() {

    const select =
        document.getElementById(
            "produtoSubstituto"
        );

    if (
        !select ||
        select.value === ""
    ) {

        itemSubstitutoTroca =
            null;

        return;
    }

    const codigo =
        select.value;

    const produto =
        produtosVenda[codigo];

    if (!produto) {
        return;
    }

    if (
        produto.estoque <= 0
    ) {

        mostrarMensagemTroca(
            "O produto selecionado está sem estoque.",
            "error"
        );

        return;
    }

    itemSubstitutoTroca = {
        codigo,
        ...produto
    };

    document.getElementById(
        "substitutoNome"
    ).textContent =
        `${produto.nome} - ${produto.variacao}`;

    document.getElementById(
        "substitutoValor"
    ).textContent =
        formatarMoeda(
            produto.preco
        );

    document.getElementById(
        "substitutoEstoque"
    ).textContent =
        `${produto.estoque} unidade(s)`;

    document.getElementById(
        "resumoProdutoSubstituto"
    ).style.display =
        "grid";

    calcularDiferencaTroca();
}


function calcularDiferencaTroca() {

    if (
        !itemDevolvidoTroca ||
        !itemSubstitutoTroca
    ) {
        return;
    }

    const valorDevolvido =
        itemDevolvidoTroca.subtotal /
        itemDevolvidoTroca.quantidade;

    const valorSubstituto =
        itemSubstitutoTroca.preco;

    const diferenca =
        valorSubstituto -
        valorDevolvido;

    document.getElementById(
        "valorProdutoDevolvidoTroca"
    ).textContent =
        formatarMoeda(
            valorDevolvido
        );

    document.getElementById(
        "valorProdutoSubstitutoTroca"
    ).textContent =
        formatarMoeda(
            valorSubstituto
        );

    document.getElementById(
        "valorDiferencaTroca"
    ).textContent =
        formatarMoeda(
            Math.abs(diferenca)
        );

    const mensagem =
        document.getElementById(
            "mensagemDiferencaTroca"
        );

    if (
        diferenca > 0
    ) {

        mensagem.textContent =
            `O cliente deverá pagar ${formatarMoeda(diferenca)} de diferença.`;

    } else if (
        diferenca < 0
    ) {

        mensagem.textContent =
            `O produto substituto custa ${formatarMoeda(Math.abs(diferenca))} a menos que o produto devolvido.`;

    } else {

        mensagem.textContent =
            "Não há diferença de valor entre os produtos.";
    }

    document.getElementById(
        "etapaDiferencaTroca"
    ).style.display =
        "block";

    document.getElementById(
        "etapaEfeitosTroca"
    ).style.display =
        "block";

    document.getElementById(
        "acoesTroca"
    ).style.display =
        "flex";
}


function confirmarTrocaProduto() {

    if (
        !vendaSelecionadaTroca ||
        !itemDevolvidoTroca ||
        !itemSubstitutoTroca
    ) {

        mostrarMensagemTroca(
            "Complete todas as etapas da troca.",
            "error"
        );

        return;
    }

    /*
    Simula a saída do
    produto substituto.
    */

    if (
        produtosVenda[
        itemSubstitutoTroca.codigo
        ]
    ) {

        produtosVenda[
            itemSubstitutoTroca.codigo
        ].estoque--;
    }

    const sucesso =
        document.getElementById(
            "trocaConcluida"
        );

    if (sucesso) {
        sucesso.style.display =
            "flex";
    }

    const acoes =
        document.getElementById(
            "acoesTroca"
        );

    if (acoes) {
        acoes.style.display =
            "none";
    }

    setTimeout(
        () => {

            vendaSelecionadaTroca =
                null;

            itemDevolvidoTroca =
                null;

            itemSubstitutoTroca =
                null;

            abrirPagina(
                "vendasPeriodo"
            );
        },
        1500
    );
}


function mostrarMensagemTroca(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemTroca"
        );

    if (!mensagem) {
        return;
    }

    mensagem.textContent =
        texto;

    mensagem.className =
        `form-message ${tipo}`;
}


/* ========================================================= */
/* ENTRADA DE MERCADORIAS */
/* ========================================================= */

const produtosEntrada = {

    whey: {
        nome: "Whey Protein",
        variacao:
            "Chocolate - 1 kg",
        categoria:
            "Suplemento"
    },

    creatina: {
        nome: "Creatina",
        variacao: "250 g",
        categoria:
            "Suplemento"
    },

    camisetaM: {
        nome:
            "Camiseta Dry Fit",

        variacao:
            "Preta - M",

        categoria:
            "Roupa"
    },

    camisetaG: {
        nome:
            "Camiseta Dry Fit",

        variacao:
            "Preta - G",

        categoria:
            "Roupa"
    },

    preTreino: {
        nome:
            "Pré-Treino Haze",

        variacao:
            "Frutas Vermelhas - 300 g",

        categoria:
            "Suplemento"
    }
};


let itensEntrada = [];


/* ========================================================= */
/* INICIALIZAR ENTRADA */
/* ========================================================= */

function inicializarEntradaMercadoria() {

    itensEntrada = [];

    const campoData =
        document.getElementById(
            "dataEntrada"
        );

    if (campoData) {

        const hoje =
            new Date();

        const ano =
            hoje.getFullYear();

        const mes =
            String(
                hoje.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const dia =
            String(
                hoje.getDate()
            ).padStart(
                2,
                "0"
            );

        campoData.value =
            `${ano}-${mes}-${dia}`;
    }

    const campoValor =
        document.getElementById(
            "valorTotalEntrada"
        );

    if (campoValor) {

        campoValor.addEventListener(
            "input",
            atualizarResumoEntrada
        );
    }

    renderizarItensEntrada();
}


/* ========================================================= */
/* ALTERAR PRODUTO DA ENTRADA */
/* ========================================================= */

function alterarProdutoEntrada() {

    const select =
        document.getElementById(
            "produtoEntrada"
        );

    const camposLote =
        document.getElementById(
            "dadosLoteEntrada"
        );

    if (
        !select ||
        !camposLote
    ) {
        return;
    }

    const codigo =
        select.value;

    if (
        codigo === ""
    ) {

        camposLote.style.display =
            "none";

        return;
    }

    const produto =
        produtosEntrada[codigo];

    camposLote.style.display =
        produto.categoria ===
            "Suplemento"
            ? "block"
            : "none";
}


/* ========================================================= */
/* ADICIONAR PRODUTO À ENTRADA */
/* ========================================================= */

function adicionarProdutoEntrada() {

    const select =
        document.getElementById(
            "produtoEntrada"
        );

    const campoQuantidade =
        document.getElementById(
            "quantidadeEntrada"
        );

    if (
        !select ||
        !campoQuantidade
    ) {
        return;
    }

    const codigo =
        select.value;

    const quantidade =
        Number(
            campoQuantidade.value
        );

    if (
        codigo === "" ||
        quantidade <= 0
    ) {

        mostrarMensagemEntrada(
            "Selecione um produto e informe uma quantidade válida.",
            "error"
        );

        return;
    }

    const produto =
        produtosEntrada[codigo];

    let lote = "-";
    let validade = "-";

    if (
        produto.categoria ===
        "Suplemento"
    ) {

        const campoLote =
            document.getElementById(
                "loteEntrada"
            );

        const campoValidade =
            document.getElementById(
                "validadeEntrada"
            );

        lote =
            campoLote.value.trim() ||
            "-";

        validade =
            campoValidade.value;

        if (
            validade === ""
        ) {

            mostrarMensagemEntrada(
                "Informe a data de validade do suplemento.",
                "error"
            );

            return;
        }
    }

    itensEntrada.push({

        codigo,
        nome: produto.nome,
        variacao:
            produto.variacao,

        categoria:
            produto.categoria,

        quantidade,
        lote,
        validade
    });

    select.value = "";
    campoQuantidade.value = 1;

    const campoLote =
        document.getElementById(
            "loteEntrada"
        );

    const campoValidade =
        document.getElementById(
            "validadeEntrada"
        );

    if (campoLote) {
        campoLote.value = "";
    }

    if (campoValidade) {
        campoValidade.value = "";
    }

    const dadosLote =
        document.getElementById(
            "dadosLoteEntrada"
        );

    if (dadosLote) {
        dadosLote.style.display =
            "none";
    }

    mostrarMensagemEntrada(
        "Produto adicionado à entrada.",
        "success"
    );

    renderizarItensEntrada();
}


/* ========================================================= */
/* RENDERIZAR ENTRADA */
/* ========================================================= */

function renderizarItensEntrada() {

    const tabela =
        document.getElementById(
            "itensEntradaTabela"
        );

    if (!tabela) {
        return;
    }

    if (
        itensEntrada.length === 0
    ) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="venda-vazia"
                >
                    Nenhum produto adicionado.
                </td>
            </tr>
        `;

        atualizarResumoEntrada();

        return;
    }

    tabela.innerHTML = "";

    itensEntrada.forEach(
        (item, index) => {

            tabela.innerHTML += `
                <tr>

                    <td>
                        <div class="produto-nome">

                            <strong>
                                ${item.nome}
                            </strong>

                            <span>
                                ${item.variacao}
                            </span>

                        </div>
                    </td>

                    <td>
                        ${item.categoria}
                    </td>

                    <td>
                        ${item.quantidade}
                    </td>

                    <td>
                        ${item.lote}
                    </td>

                    <td>
                        ${item.validade === "-"
                    ? "-"
                    : formatarDataEntrada(
                        item.validade
                    )
                }
                    </td>

                    <td>
                        <button
                            class="btn-table"
                            onclick="removerProdutoEntrada(${index})"
                        >
                            Remover
                        </button>
                    </td>

                </tr>
            `;
        }
    );

    atualizarResumoEntrada();
}


function removerProdutoEntrada(
    index
) {

    itensEntrada.splice(
        index,
        1
    );

    renderizarItensEntrada();
}


/* ========================================================= */
/* RESUMO DA ENTRADA */
/* ========================================================= */

function atualizarResumoEntrada() {

    const produtosDiferentes =
        itensEntrada.length;

    const unidades =
        itensEntrada.reduce(
            (total, item) =>
                total +
                item.quantidade,
            0
        );

    const campoValor =
        document.getElementById(
            "valorTotalEntrada"
        );

    const valor =
        campoValor
            ? Number(
                campoValor.value
            ) || 0
            : 0;

    const campoProdutos =
        document.getElementById(
            "entradaProdutosDiferentes"
        );

    const campoUnidades =
        document.getElementById(
            "entradaTotalUnidades"
        );

    const campoResumoValor =
        document.getElementById(
            "entradaValorResumo"
        );

    if (campoProdutos) {
        campoProdutos.textContent =
            produtosDiferentes;
    }

    if (campoUnidades) {
        campoUnidades.textContent =
            unidades;
    }

    if (campoResumoValor) {
        campoResumoValor.textContent =
            formatarMoeda(valor);
    }
}


/* ========================================================= */
/* CONFIRMAR ENTRADA */
/* ========================================================= */

function confirmarEntradaMercadoria() {

    const fornecedor =
        document.getElementById(
            "fornecedorEntrada"
        ).value.trim();

    const data =
        document.getElementById(
            "dataEntrada"
        ).value;

    if (
        fornecedor === ""
    ) {

        mostrarMensagemEntrada(
            "Informe o fornecedor.",
            "error"
        );

        return;
    }

    if (
        data === ""
    ) {

        mostrarMensagemEntrada(
            "Informe a data da entrada.",
            "error"
        );

        return;
    }

    if (
        itensEntrada.length === 0
    ) {

        mostrarMensagemEntrada(
            "Adicione pelo menos um produto à entrada.",
            "error"
        );

        return;
    }

    /*
    Atualiza estoque e registra
    novas remessas de suplementos.
    */

    itensEntrada.forEach(item => {

        if (
            produtosVenda[
            item.codigo
            ]
        ) {

            produtosVenda[
                item.codigo
            ].estoque +=
                item.quantidade;
        }

        if (
            item.categoria ===
            "Suplemento"
        ) {

            remessasEstoque.push({

                codigo:
                    item.codigo,

                lote:
                    item.lote,

                quantidade:
                    item.quantidade,

                validade:
                    item.validade
            });
        }
    });

    const sucesso =
        document.getElementById(
            "entradaConcluida"
        );

    if (sucesso) {
        sucesso.style.display =
            "flex";
    }

    itensEntrada = [];

    setTimeout(
        () => {
            abrirPagina("estoque");
        },
        1500
    );
}


function mostrarMensagemEntrada(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemEntrada"
        );

    if (!mensagem) {
        return;
    }

    mensagem.textContent =
        texto;

    mensagem.className =
        `form-message ${tipo}`;
}


/* ========================================================= */
/* ESTOQUE */
/* ========================================================= */

function inicializarEstoque() {

    renderizarEstoque();
}


/* ========================================================= */
/* RENDERIZAR ESTOQUE */
/* ========================================================= */

function renderizarEstoque() {

    const tabela =
        document.getElementById(
            "corpoTabelaEstoque"
        );

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    let quantidadeBaixo = 0;
    let proximosVencimento = 0;

    Object.keys(
        produtosVenda
    ).forEach(codigo => {

        const produto =
            produtosVenda[codigo];

        const dados =
            dadosProdutosEstoque[
            codigo
            ];

        if (!dados) {
            return;
        }

        const estoqueBaixo =
            produto.estoque <=
            dados.minimo;

        if (estoqueBaixo) {
            quantidadeBaixo++;
        }

        const validade =
            obterValidadeMaisProxima(
                codigo
            );

        const proximoVencimento =
            validade &&
            verificarProximoVencimento(
                validade
            );

        if (proximoVencimento) {
            proximosVencimento++;
        }

        let statusHTML = `
            <span class="badge badge-success">
                Normal
            </span>
        `;

        if (proximoVencimento) {

            statusHTML = `
                <span class="badge badge-danger">
                    Próximo do vencimento
                </span>
            `;

        } else if (estoqueBaixo) {

            statusHTML = `
                <span class="badge badge-warning">
                    Estoque baixo
                </span>
            `;
        }

        tabela.innerHTML += `
            <tr
                data-codigo="${codigo}"
                data-categoria="${dados.categoria}"
                data-baixo="${estoqueBaixo}"
                data-pesquisa="${(
                produto.nome +
                " " +
                produto.variacao
            ).toLowerCase()}"
            >

                <td>
                    <div class="produto-nome">

                        <strong>
                            ${produto.nome}
                        </strong>

                        <span>
                            ${produto.variacao}
                        </span>

                    </div>
                </td>

                <td>
                    ${dados.categoria}
                </td>

                <td>
                    <span class="
                        estoque-quantidade
                        ${estoqueBaixo
                ? "estoque-quantidade-baixa"
                : ""
            }
                    ">
                        ${produto.estoque}
                    </span>
                </td>

                <td>
                    ${dados.minimo}
                </td>

                <td>
                    ${validade
                ? formatarDataEntrada(
                    validade
                )
                : "-"
            }
                </td>

                <td>
                    ${statusHTML}
                </td>

                <td>
                    <button
                        class="btn-table"
                        onclick="abrirDetalhesEstoque('${codigo}')"
                    >
                        Detalhes
                    </button>
                </td>

            </tr>
        `;
    });

    const totalProdutos =
        Object.keys(
            produtosVenda
        ).length;

    const campoTotal =
        document.getElementById(
            "estoqueTotalProdutos"
        );

    const campoBaixo =
        document.getElementById(
            "estoqueTotalBaixo"
        );

    const campoVencimento =
        document.getElementById(
            "estoqueTotalVencimento"
        );

    if (campoTotal) {
        campoTotal.textContent =
            totalProdutos;
    }

    if (campoBaixo) {
        campoBaixo.textContent =
            quantidadeBaixo;
    }

    if (campoVencimento) {
        campoVencimento.textContent =
            proximosVencimento;
    }

    filtrarEstoque();
}


/* ========================================================= */
/* FILTRAR ESTOQUE */
/* ========================================================= */

function filtrarEstoque() {

    const pesquisaCampo =
        document.getElementById(
            "pesquisaEstoque"
        );

    const categoriaCampo =
        document.getElementById(
            "categoriaEstoque"
        );

    const baixoCampo =
        document.getElementById(
            "somenteEstoqueBaixo"
        );

    const tabela =
        document.getElementById(
            "corpoTabelaEstoque"
        );

    if (
        !pesquisaCampo ||
        !categoriaCampo ||
        !baixoCampo ||
        !tabela
    ) {
        return;
    }

    const pesquisa =
        pesquisaCampo.value
            .toLowerCase()
            .trim();

    const categoria =
        categoriaCampo.value;

    const somenteBaixo =
        baixoCampo.checked;

    const linhas =
        tabela.querySelectorAll(
            "tr"
        );

    let quantidadeVisivel = 0;

    linhas.forEach(linha => {

        const correspondePesquisa =
            linha.dataset.pesquisa
                .includes(
                    pesquisa
                );

        const correspondeCategoria =
            categoria === "" ||
            linha.dataset.categoria ===
            categoria;

        const correspondeBaixo =
            !somenteBaixo ||
            linha.dataset.baixo ===
            "true";

        const mostrar =
            correspondePesquisa &&
            correspondeCategoria &&
            correspondeBaixo;

        linha.style.display =
            mostrar
                ? ""
                : "none";

        if (mostrar) {
            quantidadeVisivel++;
        }
    });

    const vazio =
        document.getElementById(
            "nenhumEstoque"
        );

    if (vazio) {

        vazio.style.display =
            quantidadeVisivel === 0
                ? "flex"
                : "none";
    }
}


/* ========================================================= */
/* VALIDADE MAIS PRÓXIMA */
/* ========================================================= */

function obterValidadeMaisProxima(
    codigo
) {

    const remessas =
        remessasEstoque
            .filter(
                remessa =>
                    remessa.codigo ===
                    codigo
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.validade
                    ) -
                    new Date(
                        b.validade
                    )
            );

    if (
        remessas.length === 0
    ) {
        return null;
    }

    return remessas[0].validade;
}


/* ========================================================= */
/* VENCIMENTO EM 60 DIAS */
/* ========================================================= */

function verificarProximoVencimento(
    validade
) {

    if (!validade) {
        return false;
    }

    const hoje =
        new Date();

    hoje.setHours(
        0,
        0,
        0,
        0
    );

    const dataValidade =
        new Date(
            `${validade}T00:00:00`
        );

    const diferenca =
        dataValidade - hoje;

    const dias =
        Math.ceil(
            diferenca /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    return (
        dias >= 0 &&
        dias <= 60
    );
}


/* ========================================================= */
/* DETALHES DO ESTOQUE */
/* ========================================================= */

function abrirDetalhesEstoque(
    codigo
) {

    const produto =
        produtosVenda[codigo];

    const dados =
        dadosProdutosEstoque[
        codigo
        ];

    if (
        !produto ||
        !dados
    ) {
        return;
    }

    document.getElementById(
        "estoqueDetalheTitulo"
    ).textContent =
        produto.nome;

    document.getElementById(
        "estoqueDetalheProduto"
    ).textContent =
        produto.nome;

    document.getElementById(
        "estoqueDetalheVariacao"
    ).textContent =
        produto.variacao;

    document.getElementById(
        "estoqueDetalheQuantidade"
    ).textContent =
        `${produto.estoque} unidade(s)`;

    document.getElementById(
        "estoqueDetalheMinimo"
    ).textContent =
        `${dados.minimo} unidade(s)`;

    const areaRemessas =
        document.getElementById(
            "areaRemessasEstoque"
        );

    const semRemessas =
        document.getElementById(
            "semRemessasEstoque"
        );

    const tabela =
        document.getElementById(
            "tabelaRemessasEstoque"
        );

    const remessas =
        remessasEstoque
            .filter(
                remessa =>
                    remessa.codigo ===
                    codigo
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.validade
                    ) -
                    new Date(
                        b.validade
                    )
            );

    if (
        dados.categoria ===
        "Suplemento"
    ) {

        areaRemessas.style.display =
            "block";

        semRemessas.style.display =
            "none";

        tabela.innerHTML = "";

        if (
            remessas.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhuma remessa cadastrada.
                    </td>
                </tr>
            `;

        } else {

            remessas.forEach(
                remessa => {

                    let status = `
                        <span class="badge badge-success">
                            Normal
                        </span>
                    `;

                    if (
                        verificarProximoVencimento(
                            remessa.validade
                        )
                    ) {

                        status = `
                            <span class="badge badge-danger">
                                Próximo do vencimento
                            </span>
                        `;
                    }

                    tabela.innerHTML += `
                        <tr>

                            <td>
                                ${remessa.lote}
                            </td>

                            <td>
                                ${remessa.quantidade}
                            </td>

                            <td>
                                ${formatarDataEntrada(
                        remessa.validade
                    )}
                            </td>

                            <td>
                                ${status}
                            </td>

                        </tr>
                    `;
                }
            );
        }

    } else {

        areaRemessas.style.display =
            "none";

        semRemessas.style.display =
            "block";
    }

    document.getElementById(
        "modalEstoque"
    ).classList.add(
        "active"
    );
}


function fecharDetalhesEstoque() {

    const modal =
        document.getElementById(
            "modalEstoque"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}


/* ========================================================= */
/* ABERTURA DO SISTEMA */
/* ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarPagina(
            "inicio"
        );
    }
);