const puppeteer = require('puppeteer');

const links = [
  {
    slug: 'preco_aluguel_medio',
    link: 'https://valorinveste.globo.com/produtos/imoveis/noticia/2023/01/17/preco-de-aluguel-de-imoveis-tem-em-2022-maior-alta-em-11-anos.ghtml'
  },
  {
    slug: 'taxa_juros',
    link: 'https://blog.nubank.com.br/taxa-selic/'
  },
  {
    slug: 'preco_medio_metro_quadrado',
    link: 'https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9270-sistema-nacional-de-pesquisa-de-custos-e-indices-da-construcao-civil.html?=&t=destaques'
  },
  {
    slug: 'percentual_imoveis_alugados_e_vendidos',
    link: 'https://agenciabrasil.ebc.com.br/economia/noticia/2020-05/maioria-dos-brasileiros-mora-em-casa-e-e-dona-do-imovel-mostra-ibge#:~:text=Os%20im%C3%B3veis%20alugados%20representam%2018,%2C%20com%2073%2C6%25.'
  },
  {
    slug: 'tempo_medio_de_vendas',
    link: 'https://portal.loft.com.br/quanto-tempo-leva-vender-imovel/#:~:text=Vender%20um%20ap%C3%AA%20no%20Brasil,Associa%C3%A7%C3%A3o%20Brasileira%20de%20Incorporadoras%20Imobili%C3%A1rias).'
  },
  {
    slug: 'numero_transacoes_imobiliarias',
    link: 'https://www.registrodeimoveis.org.br/portal-estatistico-registral'
  },
  {
    slug: 'todos_imoveis', // pegar valores, tipos, quantidades, ...
    link: 'https://barcimoveis.com.br/busca/'
  },
]

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  const pageTitle = await page.title();
  console.log(pageTitle);
  await browser.close();
})();