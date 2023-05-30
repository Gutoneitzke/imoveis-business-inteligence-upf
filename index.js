const puppeteer = require('puppeteer');

const url = "https://barcimoveis.com.br/busca/";
var time = 0;
var timer = setInterval(() => {time++},1000);
const links = [
  {
    slug: 'preco_medio_metro_quadrado',
    link: url,
    result: 0 // ok
  },
  {
    slug: 'quantidade_imovies_total',
    link: url,
    result: 0 // ok
  },
  {
    slug: 'preco_medio_imovies',
    link: url,
    result: [] // ok
  },
  {
    slug: 'quantidade_imovies_por_regiao',
    link: url,
    result: {
      rs: 0,
      sc: 0
    } // ok
  },
  {
    slug: 'media_de_dormitorios',
    link: url,
    result: [] // ok
  },
  {
    slug: 'preco_aluguel_medio',
    link: url,
    result: [] // ok
  },
  {
    slug: 'taxa_juros',
    link: 'https://blog.nubank.com.br/taxa-selic/',
    result: [] // ok
  },
  {
    slug: 'all_data',
    link: url,
    result: []
  }
]

async function getElements()
{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let element7 = links[7];

  // Pegando a quantidade de páginas
  await page.goto(element7.link+'/?pagina=1');
  const pages = await page.evaluate(() => {
    const paginationBox = document.querySelector(".pagination").children;
    const children = paginationBox;
    return children[children.length - 2].querySelector("a").textContent;
  });
  // console.log('Tem: ',pages, ' páginas');

  // Pegando infos dos imoveis
  for(let i = 0; i < 1; i++)
  {
    // console.log("LOADING - Pegando infos dos imoveis",element7.link+'?pagina='+`${i+1}`);
    await page.goto(element7.link+'?pagina='+`${i+1}`);
  
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
      element7.result.push(objeto);
    });
  }

  // console.log("Informações dos imóveis: ",element7.result);

  // Quantidade de imovies - Total
  let element1 = links[1];
  // console.log("LOADING - Quantidade de imovies - Total: ",element1.link);
  await page.goto(element1.link);

  element1.result = await page.evaluate(() => {
    const propertyContainer = document.querySelector('.listing-header');
    return propertyContainer.querySelector('h1').textContent.trim();
  });

  // console.log("Quantidade de imovies - Total: ",element1.result);

  // Taxa de juros
  let element2 = links[6];
  // console.log("LOADING - Taxa de juros: ",element2.link);
  await page.goto(element2.link);

  element2.result = await page.evaluate(() => {
    return document.querySelector('.wp-block-quote').querySelector('strong').textContent;
  });

  // console.log("Taxa de juros: ",element2.result);

  // Cálculos
  let totalDormitorios = 0;
  let totalValores = 0;
  let totalAluguel = 0;
  let totalValoresAluguel = 0;
  let totalRs = 0;
  let totalSc = 0;
  let somaAreas = 0;
  for(let i = 0; i < element7['result'].length; i++)
  {
    let metragemTotal = parseInt(element7['result'][i]['metragemTotal']?.replace(/[^\d,]/g, "").replace(",", "."));
    let metragemPrivativa = parseInt(element7['result'][i]['metragemPrivativa']?.replace(/[^\d,]/g, "").replace(",", "."));
    // console.log('preco ANTES',element7['result'][i]['preco']);
    let preco = parseInt(element7['result'][i]['preco']?.replace(/[^\d,]/g, "").replace(",", "."));
    // console.log('preco DEPOIS',preco)

    totalDormitorios += !element7['result'][i]['dormitorios'] ? 1 : parseInt(element7['result'][i]['dormitorios']);
    // console.log('totalDormitorios',totalDormitorios);
    
    somaAreas += !metragemTotal ? !metragemPrivativa ? 0 : metragemPrivativa : metragemTotal;

    if(element7['result'][i]['status'] == 'Aluguel')
    {
      totalValoresAluguel += !preco ? 0 : preco;
      totalAluguel++;
    }
    else
    {
      totalValores += !preco ? 0 : preco;
    }

    if(element7['result'][i]['estado'] == 'RS')
    {
      totalRs++;
    }
    else
    {
      totalSc++;
    }
  }

  // preco_medio_metro_quadrado
  // console.log('preco_medio_metro_quadrado', totalValores, somaAreas)
  links[0]['result'] = totalValores / somaAreas;
  links[0]['result'].toFixed(2);

  // preco_medio_imovies
  // console.log('preco_medio_imovies', totalValores, parseInt(links[1]['result'].replace(/[^\d,]/g, "").replace(",", ".")))
  links[2]['result'] = totalValores / parseInt(links[1]['result'].replace(/[^\d,]/g, "").replace(",", "."));
  links[2]['result'].toFixed(2);

  // quantidade_imovies_por_regiao
  // console.log('quantidade_imovies_por_regiao', totalRs, totalSc)
  links[3]['result'].rs = totalRs;
  links[3]['result'].sc = totalSc;

  // media_de_dormitorios
  // console.log('media_de_dormitorios', totalDormitorios, parseInt(links[1]['result'].replace(/[^\d,]/g, "").replace(",", ".")))
  links[4]['result'] =  totalDormitorios / parseInt(links[1]['result'].replace(/[^\d,]/g, "").replace(",", "."));

  // preco_aluguel_medio
  // console.log('preco_aluguel_medio', totalValoresAluguel, totalAluguel)
  links[5]['result'] = totalValoresAluguel / totalAluguel;

  // Resultado
  // console.log("**********************");
  console.log(links);

  // Obter as chaves do primeiro objeto para definir o cabeçalho
  const cabecalho = Object.keys(links[0]);

  // Criar as linhas do CSV
  const linhas = links.map(objeto => {
    const valores = cabecalho.map(coluna => {
      const valor = objeto[coluna];
      return typeof valor === 'object' ? JSON.stringify(valor) : valor;
    });
    return valores.join(',');
  });

  // Juntar o cabeçalho e as linhas em uma única string CSV
  const csv = [cabecalho.join(','), ...linhas].join('\n');
  console.log('csv -> ',csv);
  console.log('time -> ',time);
  clearInterval(timer);
  process.exit();
};

getElements()