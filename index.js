const puppeteer = require('puppeteer');

const url = "https://barcimoveis.com.br/busca/";
const links = [
  {
    slug: 'preco_medio_metro_quadrado',
    link: url,
    result: [] // ok - só falta pegar todos
  },
  {
    slug: 'quantidade_imovies_total',
    link: url,
    result: [] // ok
  },
  {
    slug: 'preco_medio_imovies',
    link: url,
    result: [] // ok - só falta pegar todos
  },
  {
    slug: 'quantidade_imovies_por_regiao',
    link: url,
    result: [] // ok - só falta pegar todos
  },
  {
    slug: 'media_de_dormitorios',
    link: url,
    result: [] // ok - só falta pegar todos
  },
  {
    slug: 'preco_aluguel_medio',
    link: url,
    result: [] // ok - só falta pegar todos
  },
  {
    slug: 'taxa_juros',
    link: 'https://blog.nubank.com.br/taxa-selic/',
    result: [] // ok
  },
]

async function getElements()
{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let element0 = links[0];

  // Pegando a quantidade de páginas
  await page.goto(element0.link+'/?pagina=1');
  const pages = await page.evaluate(() => {
    const paginationBox = document.querySelector(".pagination").children;
    const children = paginationBox;
    return children[children.length - 2].querySelector("a").textContent;
  });
  console.log('Tem: ',pages, ' páginas');

  // Pegando infos dos imoveis
  for(let i = 0; i < 2; i++)
  {
    console.log("LOADING - Pegando infos dos imoveis",element0.link+'?pagina='+`${i+1}`);
    await page.goto(element0.link+'?pagina='+`${i+1}`);
  
    let result = await page.evaluate(() => {
      const propertyContainer = document.getElementById('conteudoImoveis');
      const propertyItems = Array.from(propertyContainer.getElementsByClassName('property-thumb-info'));
      const properties = [];
  
      propertyItems.forEach((item) => {
        const preco = item.querySelector('.preco').textContent;
        const estado = item.querySelector('.bairro').textContent.replace(/.*?(RS|SC).*/, "$1").trim();
        const status = item.querySelector('.status').textContent.replace(" - ","");
        const metragemTotal = item.querySelector('[data-original-title="Área total"]')?.textContent.trim();
        const metragemPrivativa = item.querySelector('[data-original-title="Área Privativa"]')?.textContent.trim();
        const dormitorios = item.querySelector('[data-original-title="Dormitório"]')?.textContent.trim();
  
        properties.push({ preco, estado, status, metragemTotal, metragemPrivativa, dormitorios });
      });
  
      return properties;
    });

    result.forEach(objeto => {
      element0.result.push(objeto);
    });
  }

  console.log("Informações dos imóveis: ",element0.result);

  // Quantidade de imovies - Total
  let element1 = links[1];
  console.log("LOADING - Quantidade de imovies - Total: ",element1.link);
  await page.goto(element1.link);

  element1.result = await page.evaluate(() => {
    const propertyContainer = document.querySelector('.listing-header');
    return propertyContainer.querySelector('h1').textContent.trim();
  });

  console.log("Quantidade de imovies - Total: ",element1.result);

  // Taxa de juros
  let element2 = links[6];
  console.log("LOADING - Taxa de juros: ",element2.link);
  await page.goto(element2.link);

  element2.result = await page.evaluate(() => {
    return document.querySelector('.wp-block-quote').querySelector('strong').textContent;
  });

  console.log("Taxa de juros: ",element2.result);

  // Resultado
  console.log("**********************");
  console.log(links)
  
};

getElements()