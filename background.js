/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var ext_name = ext_api.runtime.getManifest().name;

const cs_limit_except = ['afr.com', 'elcomercio.pe', 'elpais.com', 'faz.net', 'gestion.pe', 'harpers.org', 'inkl.com', 'la-croix.com', 'lescienze.it', 'newleftreview.org', 'techinasia.com'];
var currentTabUrl = '';
var csDone = false;
var msite = self;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'barrons.com': /.+\.barrons\.com\/(amp\/)?article(s)?\/.+/,
  'bloombergquint.com': /^((?!\.bloombergquint\.com\/bq-blue-exclusive\/).)*$/,
  'elcomercio.pe': /.+\/elcomercio\.pe\/.+((\w)+(\-)+){3,}.+/,
  'faz.net': /(www|m)\.faz\.net\/.+\.html/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/(articles|fa-caching|interviews|reviews|sites)\/.+/,
  'ft.com': /.+\.ft.com\/content\//,
  'gestion.pe': /.+\/gestion\.pe\/.+((\w)+(\-)+){3,}.+/,
  'hs.fi': /^((?!\/.+\.hs\.fi\/paivanlehti\/).)*$/,
  'globo.com': /^((?!\/valor\.globo\.com\/).)*$/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+\/seekingalpha\.com\/($|(amp\/)?(article|news)\/|samw\/)/,
  'techinasia.com': /.+\.techinasia\.com\/.+((\w)+(\-)+){3,}.+/,
  'wsj.com': /^((?!\/cn\.wsj\.com\/).)*$/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in sites.js (default allow/remove_cookies)
var allow_cookies_default = [
  'abc.es',
  'belfasttelegraph.co.uk',
  'berlingske.dk',
  'bostonglobe.com',
  'business-standard.com',
  'charliehebdo.fr',
  'clarin.com',
  'chronicle.com',
  'df.cl',
  'dn.se',
  'dvhn.nl',
  'editorialedomani.it',
  'elmercurio.com',
  'elmundo.es',
  'elpais.com',
  'elperiodico.com',
  'esprit.presse.fr',
  'euobserver.com',
  'eurekareport.com.au',
  'expansion.com',
  'faz.net',
  'financialpost.com',
  'folha.uol.com.br',
  'ftm.nl',
  'fortune.com',
  'freiepresse.de',
  'gelocal.it',
  'gestion.pe',
  'gva.be',
  'haaretz.co.il',
  'haaretz.com',
  'handelsblatt.com',
  'hs.fi',
  'ilfattoquotidiano.it',
  'ilrestodelcarlino.it',
  'independent.ie',
  'intelligentinvestor.com.au',
  'knack.be',
  'kurier.at',
  'la-croix.com',
  'lavanguardia.com',
  'lc.nl',
  'lejdd.fr',
  'lesechos.fr',
  'limesonline.com',
  'lrb.co.uk',
  'modernhealthcare.com',
  'nationalgeographic.com',
  'nationalpost.com',
  'nationalreview.com',
  'newleftreview.org',
  'newrepublic.com',
  'noordhollandsdagblad.nl',
  'nouvelobs.com',
  'nybooks.com',
  'nytimes.com',
  'nzz.ch',
  'parismatch.com',
  'piqd.de',
  'quotidiano.net',
  'quora.com',
  'repubblica.it',
  'rollingstone.com',
  'saechsische.de',
  'scribd.com',
  'seekingalpha.com',
  'slader.com',
  'startribune.com',
  'stocknews.com',
  'sueddeutsche.de',
  'techinasia.com',
  'the-american-interest.com',
  'thehindu.com',
  'thehindubusinessline.com',
  'themarker.com',
  'thewest.com.au',
  'timeshighereducation.com',
  'variety.com',
  'washingtonpost.com',
  'wiwo.de',
  'worldpoliticsreview.com',
  'zeit.de',
];
var allow_cookies = allow_cookies_default.slice();

// Removes cookies after page load
// remove_cookies are completed with domains of sites.js (default allow/remove_cookies)
var remove_cookies = [
]

// select specific cookie(s) to hold from remove_cookies domains
const remove_cookies_select_hold = {
  'barrons.com': ['wsjregion'],
  'groene.nl': ['accept-cookies', 'popunder-hidden'],
  'newstatesman.com': ['STYXKEY_nsversion'],
  'qz.com': ['gdpr'],
  'seattletimes.com': ['st_newsletter_splash_seen'],
  'wsj.com': ['wsjregion', 'ResponsiveConditional_initialBreakpoint']
}

// select only specific cookie(s) to drop from remove_cookies domains
var remove_cookies_select_drop = {
  'caixinglobal.com': ['CAIXINGLB_LOGIN_UUID'],
  'dn.se': ['randomSplusId'],
  'fd.nl': ['socialread'],
  'nrc.nl': ['counter'],
  'theatlantic.com': ['articleViews']
}

// Override User-Agent with Googlebot
var use_google_bot_default = [
  'abc.es',
  'barrons.com',
  'berlingske.dk',
  'deutsche-wirtschafts-nachrichten.de',
  'df.cl',
  'dn.se',
  'editorialedomani.it',
  'euobserver.com',
  'eurekareport.com.au',
  'ft.com',
  'handelsblatt.com',
  'hs.fi',
  'intelligentinvestor.com.au',
  'mexiconewsdaily.com',
  'miamiherald.com',
  'nouvelobs.com',
  'nzz.ch',
  'piqd.de',
  'quora.com',
  'republic.ru',
  'seekingalpha.com',
  'thetimes.co.uk',
  'washingtonpost.com',
  'wiwo.de',
  'worldpoliticsreview.com',
  'wsj.com',
  'zeit.de',
];
var use_google_bot = use_google_bot_default.slice();

// Override User-Agent with Bingbot
var use_bing_bot = [
  'haaretz.co.il',
  'haaretz.com',
  'themarker.com',
];

// block paywall-scripts individually
var blockedRegexes = {
  'adweek.com': /.+\.lightboxcdn\.com\/.+/,
  'afr.com': /afr\.com\/assets\/vendorsReactRedux_client.+\.js/,
  'alternatives-economiques.fr': /.+\.poool\.fr\/.+/,
  'americanbanker.com': /cdn\.tinypass\.com\/.+/,
  'barrons.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'belfasttelegraph.co.uk': /(cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'bizjournals.com': /(assets\.bizjournals\.com\/static\/js\/app\/cxense\.js|cdn\.cxense\.com\/.+)/,
  'bloomberg.com': /(cdn\.tinypass\.com\/|assets\.bwbx\.io\/s3\/fence\/)/,
  'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
  'businessinsider.com': /cdn\.tinypass\.com\/.+/,
  'challenges.fr': /.+\.poool\.fr\/.+/,
  'charliehebdo.fr': /.+\.poool\.fr\/.+/,
  'chicagobusiness.com': /cdn\.tinypass\.com\/.+/,
  'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\/.+/,
  'chronicle.com': /(.+\.blueconic\.net\/.+|assets\.login\.chronicle\.com\/common\/che-auth0-user\.js)/,
  'clarin.com': /js\.matheranalytics\.com\/.+/,
  'corriere.it': /(cdn\.tinypass\.com\/|\.rcsobjects\.it\/rcs_(cpmt|tracking-service)\/|\.corriereobjects\.it\/.+\/js\/(_paywall\.sjs|tracking\/)|\.userzoom\.com\/files\/js\/)/,
  'digiday.com': /cdn\.tinypass\.com\/.+/,
  'dvhn.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'economist.com': /cdn\.tinypass\.com\/.+/,
  'editorialedomani.it': /(.+\.editorialedomani\.it\/pelcro\.js|js\.pelcro\.com\/.+)/,
  'elcomercio.pe': /elcomercio\.pe\/pf\/dist\/template\/elcomercio-noticia.+\.js/,
  'elmercurio.com': /\.(elmercurio\.com|emol\.cl)\/(.+\/)?js\/(.+\/)?(modal|merPramV\d|PramModal\.min)\.js/,
  'elmundo.es': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'elpais.com': /\.cdn\.arcpublishing\.com\/arc\/subs\/p\.min\.js/,
  'elperiodico.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'estadao.com.br': /acesso\.estadao\.com\.br\/paywall\/.+\/pw\.js/,
  'estrellavalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'exame.abril.com.br': /cdn\.tinypass\.com\/.+/,
  'expansion.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'financialpost.com': /cdn\.tinypass\.com\/.+/,
  'folha.uol.com.br': /(.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js|paywall\.folha\.uol\.com\.br\/.+|js\.matheranalytics\.com\/.+)/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/sites\/default\/files\/js\/js_[^y].+\.js/,
  'foreignpolicy.com': /cdn\.tinypass\.com\/.+/,
  'fortune.com': /cdn\.tinypass\.com\/.+/,
  'freiepresse.de': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'fresnobee.com': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'ftm.nl': /.+\.ftm\.nl\/js\/routing\?/,
  'gelocal.it': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'gestion.pe': /gestion\.pe\/pf\/dist\/template\/gestion-noticia.+\.js/,
  'globes.co.il': /cdn\.tinypass\.com\/.+/,
  'globo.com': /cdn\.tinypass\.com\/.+/,
  'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
  'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
  'hbr.org': /cdn\.tinypass\.com\/.+/,
  'historyextra.com': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'ilrestodelcarlino.it': /cdn\.tinypass\.com\/.+/,
  'independent.ie': /(cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'inquirer.com': /cdn\.tinypass\.com\/.+/,
  'irishtimes.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'knack.be': /.+\.knack\.be\/js\/responsive\/rmgModal\.js/,
  'kurier.at': /cdn\.tinypass\.com\/.+/,
  'la-croix.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'lasegunda.com': /\.(lasegunda\.com|emol\.cl)\/(.+\/)?js\/(.+\/)?(modal|merPramV\d|PramModal\.min)\.js/,
  'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
  'latercera.com': /(.+\.latercera\.com\/arc\/subs\/p\.js|cdn\.cxense\.com\/.+)/,
  'latimes.com': /js\.matheranalytics\.com\/.+/,
  'lavanguardia.com': /(\.evolok\.net\/.+\/authorize\/|\.lavanguardia\.com\/(js\/)?godo-)/,
  'lc.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'lejdd.fr': /.+\.poool\.fr\/.+/,
  'leparisien.fr': /cdn\.tinypass\.com\/.+/,
  'lesechos.fr': /cdn\.tinypass\.com\/.+/,
  'limesonline.com': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'livemint.com': /(.+\.livemint\.com\/js\/localWorker\.js|analytics\.htmedia\.in\/analytics-js\/.+\.js)/,
  'lopinion.fr': /.+\.poool\.fr\/.+/,
  'lrb.co.uk': /cdn\.tinypass\.com\/.+/,
  'marketwatch.com': /cdn\.cxense\.com\/.+/,
  'mercuriovalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'modernhealthcare.com': /cdn\.tinypass\.com\/.+/,
  'nationalgeographic.com': /.+\.blueconic\.net\/.+/,
  'nationalpost.com': /cdn\.tinypass\.com\/.+/,
  'nationalreview.com': /(.+\.blueconic\.net\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'newrepublic.com': /.+\.onecount\.net\/js\/.+/,
  'newsweek.com': /js\.pelcro\.com\/.+/,
  'newyorker.com': /.+\.newyorker\.com\/verso\/static\/presenter-articles.+\.js/,
  'nytimes.com': /(meter-svc\.nytimes\.com\/meter\.js|mwcm\.nyt\.com\/.+\.js)/,
  'parismatch.com': /.+\.poool\.fr\/.+/,
  'quotidiano.net': /cdn\.tinypass\.com\/.+/,
  'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'rollingstone.com': /cdn\.cxense\.com\/.+/,
  'sacbee.com': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'saechsische.de': /cdn\.tinypass\.com\/.+/,
  'science-et-vie.com': /.+\.qiota\.com\/.+/,
  'sciencesetavenir.fr': /.+\.poool\.fr\/.+/,
  'scmp.com': /cdn\.tinypass\.com\/.+/,
  'seekingalpha.com': /(cdn\.tinypass\.com\/|cdn\.ampproject\.org(\/.+)?\/v\d\/amp-(access|ad|loader)-.+\.js)/,
  'sfchronicle.com': /.+\.blueconic\.net\/.+/,
  'slate.com': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'sloanreview.mit.edu': /(cdn\.tinypass\.com\/.+|.+\/sloanreview\.mit\.edu\/.+\/welcome-ad\.js)/,
  'spectator.co.uk': /cdn\.tinypass\.com\/.+/,
  'spectator.com.au': /cdn\.tinypass\.com\/.+/,
  'spectator.us': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'technologyreview.com': /.+\.blueconic\.net\/.+/,
  'telegraph.co.uk': /(cdn\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js|\.telegraph\.co\.uk\/.+\/piano.+\.js|assets\.adobedtm\.com\/.+\.js)/,
  'thedailybeast.com': /cdn\.tinypass\.com\/.+/,
  'thehindu.com': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'thehindubusinessline.com': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'thenation.com': /cdn\.tinypass\.com\/.+/,
  'timeshighereducation.com': /\.timeshighereducation\.com\/sites\/default\/files\/js\/js_bbCGL.+\.js/,
  'valeursactuelles.com': /.+\.qiota\.com\/.+/,
  'variety.com': /cdn\.cxense\.com\/.+/,
  'washingtonpost.com': /.+\.washingtonpost\.com\/.+\/pwapi-proxy\.min\.js/,
  'wsj.com': /(cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js|cdn\.cxense\.com\/.+)/
};

const au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
const au_news_corp_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
const au_prov_news_domains = ['news-mail.com.au', 'frasercoastchronicle.com.au', 'gladstoneobserver.com.au', 'dailyexaminer.com.au', 'dailymercury.com.au', 'themorningbulletin.com.au', 'sunshinecoastdaily.com.au', 'gympietimes.com.au', 'northernstar.com.au', 'qt.com.au', 'thechronicle.com.au', 'warwickdailynews.com.au'];
const ca_torstar_domains = ['niagarafallsreview.ca', 'stcatharinesstandard.ca', 'thepeterboroughexaminer.com', 'therecord.com', 'thespec.com', 'thestar.com', 'wellandtribune.ca'];
const de_funke_media_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'waz.de', 'wp.de', 'wr.de'];
const de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de'];
const es_grupo_vocento_domains = ['diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'laverdad.es', 'lavozdigital.es'];
const fi_alma_talent_domains = ['arvopaperi.fi', 'kauppalehti.fi', 'marmai.fi', 'mediuutiset.fi', 'mikrobitti.fi', 'talouselama.fi', 'tekniikkatalous.fi', 'tivi.fi', 'uusisuomi.fi'];
const fr_be_groupe_rossel_domains = ['aisnenouvelle.fr', 'courrier-picard.fr', 'lardennais.fr', 'lavoixdunord.fr', 'lecho.be', 'lesoir.be', 'lest-eclair.fr', 'liberation-champagne.fr', 'lunion.fr', 'nordeclair.fr', 'paris-normandie.fr', 'sudinfo.be'];
const fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
const fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'ladepeche.fr', 'lindependant.fr', 'midi-olympique.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr'];
const it_ilmessaggero_domains = ['corriereadriatico.it', 'ilgazzettino.it', 'ilmattino.it', 'ilmessaggero.it', 'quotidianodipuglia.it'];
const nl_ad_region_domains = ['ad.nl', 'bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'];
const usa_nymag_domains = ['curbed.com', 'grubstreet.com', 'nymag.com', 'thecut.com', 'vulture.com'];

// grouped domains (rules only)
const au_nine_domains = ['brisbanetimes.com.au', 'smh.com.au', 'theage.com.au', 'watoday.com.au'];
const nl_pg_domains = ['parool.nl', 'trouw.nl', 'volkskrant.nl', 'humo.be', 'demorgen.be'];

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

var enabledSites = [];
var disabledSites = [];
var defaultSites_grouped_domains = Object.values(defaultSites);
var defaultSites_domains = defaultSites_grouped_domains.concat(au_comm_media_domains, au_news_corp_domains, au_prov_news_domains, ca_torstar_domains, de_funke_media_domains, de_madsack_domains, es_grupo_vocento_domains, fi_alma_talent_domains, fr_be_groupe_rossel_domains, fr_groupe_ebra_domains, fr_groupe_la_depeche_domains, it_ilmessaggero_domains, nl_ad_region_domains, usa_nymag_domains);
var customSites = {};
var customSites_domains = [];
var excludedSites = [];

function setDefaultOptions() {
  ext_api.storage.local.set({
    sites: defaultSites
  }, function () {
    ext_api.runtime.openOptionsPage();
  });
}

// copy storage.sync to storage.local (quota exceeded)
ext_api.storage.sync.get({
  sites: {},
  sites_custom: {},
  daily_users: {},
  optIn: {},
  optInShown: {},
  customShown: {}
}, function (items) {
  if (Object.keys(items.sites).length > 0) {
    ext_api.storage.local.set({
      sites: items.sites,
      sites_custom: items.sites_custom,
      daily_users: items.daily_users,
      optIn: items.optIn,
      optInShown: items.optInShown,
      customShown: items.customShown
    }, function () {
      ext_api.storage.sync.remove(['sites', 'sites_custom']);
    });
  }
});

var grouped_sites = {
'###_au_comm_media': au_comm_media_domains,
'###_au_news_corp': au_news_corp_domains,
'###_au_prov_news': au_prov_news_domains,
'###_ca_torstar': ca_torstar_domains,
'###_de_funke_medien': de_funke_media_domains,
'###_de_madsack': de_madsack_domains,
'###_es_grupo_vocento': es_grupo_vocento_domains,
'###_fi_alma_talent': fi_alma_talent_domains,
'###_fr_be_groupe_rossel': fr_be_groupe_rossel_domains,
'###_fr_groupe_ebra': fr_groupe_ebra_domains,
'###_fr_groupe_la_depeche': fr_groupe_la_depeche_domains,
'###_it_ilmessaggero': it_ilmessaggero_domains,
'###_nl_ad_region': nl_ad_region_domains,
'###_usa_nymag': usa_nymag_domains
};

function add_grouped__enabled_domains(groups) {
  for (let key in groups) {
    if (enabledSites.includes(key))
      enabledSites = enabledSites.concat(groups[key]);
    else
      disabledSites = disabledSites.concat(groups[key]);
    for (let site of excludedSites) {
      if (enabledSites.includes(site)) {
        enabledSites.splice(enabledSites.indexOf(site), 1);
        disabledSites.push(site);
      }
    }
  }
}

// add grouped sites to en/disabledSites & init rules (optional)
function add_grouped_sites(init_rules) {
  add_grouped__enabled_domains(grouped_sites);
  if (init_rules) {
    for (let domain of au_comm_media_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/;
    }
    for (let domain of au_news_corp_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|ad|iframe)-.+\.js/;
    }
    for (let domain of au_prov_news_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
    }
    for (let domain of ca_torstar_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /\.(ca|com)\/api\/overlaydata/;
    }
    for (let domain of de_funke_media_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/;
    }
    for (let domain of es_grupo_vocento_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent|subscriptions)-.+\.js/;
    }
    for (let domain of fi_alma_talent_domains) {
      use_google_bot.push(domain);
    }
    for (let domain of fr_be_groupe_rossel_domains) {
      if (!['lecho.be'].includes(domain)) {
        allow_cookies.push(domain);
        use_google_bot.push(domain);
      }
    }
    for (let domain of fr_groupe_ebra_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(.+\.poool\.fr\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/;
    }
    for (let domain of fr_groupe_la_depeche_domains) {
        allow_cookies.push(domain);
        blockedRegexes[domain] = /(.+\.poool\.fr\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/;//|iframe
    }
    for (let domain of it_ilmessaggero_domains)
      blockedRegexes[domain] = /utils\.cedsdigital\.it\/js\/PaywallMeter\.js/;
    for (let domain of nl_ad_region_domains)
      remove_cookies_select_drop[domain] = ['temptationTrackingId'];
    // rules only
    for (let domain of au_nine_domains)
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/;
    for (let domain of nl_pg_domains)
      remove_cookies_select_drop[domain] = ['TID_ID'];
  }
}

// Get the enabled sites (from local storage) & add to allow/remove_cookies (if not already in one of these arrays)
// Add googlebot- and block_javascript-settings for custom sites
ext_api.storage.local.get({
  sites: {},
  sites_custom: {},
  sites_excluded: [],
  ds: '',
  site_o: [],
  site_p: {}
}, function (items) {
  var sites = items.sites;
  var sites_custom = items.sites_custom;
  var ds = items.ds;
  var site_o = items.site_o;
  var site_p = items.site_p;
  excludedSites = items.sites_excluded;

  for (let key in sites_custom) {
    var domainVar = sites_custom[key]['domain'].toLowerCase();
    if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar))
      use_google_bot.push(domainVar);
    if (sites_custom[key]['allow_cookies'] > 0 && !allow_cookies.includes(domainVar))
      allow_cookies.push(domainVar);
    if (sites_custom[key]['block_javascript'] > 0)
      block_js_custom.push(domainVar);
    if (sites_custom[key]['block_javascript_ext'] > 0)
      block_js_custom_ext.push(domainVar);
  }

  enabledSites = Object.keys(sites).filter(function (key) {
      return (sites[key] !== '' && sites[key] !== '###');
    }).map(function (key) {
      return sites[key].toLowerCase();
    });
  customSites = sites_custom;
  customSites_domains = Object.values(sites_custom).map(x => x.domain);
  disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
  add_grouped_sites(true);  //and exclude sites

  for (let domainVar of enabledSites) {
    if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar)) {
      allow_cookies.push(domainVar);
      remove_cookies.push(domainVar);
    }
  }
  disableJavascriptOnListedSites();
  findChild(site_o, site_p, ds);
});

// Listen for changes to options
ext_api.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync')
    return;
  for (let key in changes) {
    var storageChange = changes[key];
    if (key === 'sites') {
      var sites = storageChange.newValue;
      enabledSites = Object.keys(sites).filter(function (key) {
          return (sites[key] !== '' && sites[key] !== '###');
        }).map(function (key) {
          return sites[key];
        });
      disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
      add_grouped_sites(false);

      for (let domainVar of enabledSites) {
        if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar)) {
          allow_cookies.push(domainVar);
          remove_cookies.push(domainVar);
        }
      }
    }
    if (key === 'sites_custom') {
      var sites_custom = storageChange.newValue ? storageChange.newValue : {};
      var sites_custom_old = storageChange.oldValue ? storageChange.oldValue : {};
      customSites = sites_custom;
      customSites_domains = Object.values(sites_custom).map(x => x.domain);

      // add/remove custom sites in options
      var sites_custom_added = Object.keys(sites_custom).filter(x => !Object.keys(sites_custom_old).includes(x) && !defaultSites.hasOwnProperty(x));
      var sites_custom_removed = Object.keys(sites_custom_old).filter(x => !Object.keys(sites_custom).includes(x) && !defaultSites.hasOwnProperty(x));

      ext_api.storage.local.get({
        sites: {}
      }, function (items) {
        var sites = items.sites;
        for (let key of sites_custom_added)
          sites[key] = sites_custom[key].domain;
        for (let key of sites_custom_removed)
          delete sites[key];

        ext_api.storage.local.set({
          sites: sites
        }, function () {
          true;
        });
      });

      // restore cookie-settings for removed custom (& also default) domain
      var sites_custom_default_domain_removed = Object.values(sites_custom_old).map(function (site_old) {
          return site_old.domain;
        }).filter(x => !Object.values(sites_custom).map(function (site_new) {
            return site_new.domain;
          }).includes(x) && defaultSites_domains.includes(x));
      for (let domain of sites_custom_default_domain_removed) {
        if (!allow_cookies_default.includes(domain) && !remove_cookies.includes(domain))
          remove_cookies.push(domain);
      }

      use_google_bot = use_google_bot_default.slice();
      block_js_custom = [];
      block_js_custom_ext = [];
      for (let key in sites_custom) {
        var domainVar = sites_custom[key]['domain'].toLowerCase();
        if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar)) {
          use_google_bot.push(domainVar);
        }
        if (sites_custom[key]['allow_cookies'] > 0) {
          if (allow_cookies.includes(domainVar)) {
            if (remove_cookies.includes(domainVar))
              remove_cookies.splice(remove_cookies.indexOf(domainVar), 1);
          } else
            allow_cookies.push(domainVar);
        } else if (!allow_cookies_default.includes(domainVar) && allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar))
            remove_cookies.push(domainVar);
        if (sites_custom[key]['block_javascript'] > 0) {
          block_js_custom.push(domainVar);
        }
        if (sites_custom[key]['block_javascript_ext'] > 0) {
          block_js_custom_ext.push(domainVar);
        }
      }
    }
    if (key === 'sites_excluded') {
      var sites_excluded = storageChange.newValue ? storageChange.newValue : [];
      var sites_excluded_old = storageChange.oldValue ? storageChange.oldValue : [];
      excludedSites = sites_excluded;

      // add/remove excluded sites in en/disabledSites
      var sites_excluded_added = sites_excluded.filter(x => !sites_excluded_old.includes(x));
      var sites_excluded_removed = sites_excluded_old.filter(x => !sites_excluded.includes(x));

      for (let site of sites_excluded_added) {
        if (enabledSites.includes(site)) {
          enabledSites.splice(enabledSites.indexOf(site), 1);
          disabledSites.push(site);
        }
      }
      for (let site of sites_excluded_removed) {
        if (disabledSites.includes(site)) {
          disabledSites.splice(disabledSites.indexOf(site), 1);
          enabledSites.push(site);
        }
      }
    }
    // reset disableJavascriptOnListedSites eventListener
    ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
    ext_api.webRequest.handlerBehaviorChanged();

    // Refresh the current tab
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
        ext_api.tabs.update(tabs[0].id, {
          url: tabs[0].url
        });
      }
    });
  }
});

// Set and show default options on install
ext_api.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install" ) {
    setDefaultOptions();
  } else if (details.reason == "update" ) {
    ext_api.management.getSelf(function (result) {
      if (enabledSites.includes('#options_on_update') && result.installType !== 'development')
        ext_api.runtime.openOptionsPage(); // User updated extension (non-developer mode)
    });
  }
});

// repubblica.it bypass
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('/pwa/', '/ws/detail/');
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.repubblica.it/pwa/*"], types:["main_frame"]},
["blocking"]
);

// inkl disable newsletter login
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace(/etok=[\w]*&/, '');
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.inkl.com/*"], types:["main_frame"]},
["blocking"]
);

const faz_uaMobile = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Mobile Safari/537.36";
ext_api.webRequest.onBeforeSendHeaders.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  let headers = details.requestHeaders;
  headers = headers.map(function (header) {
      if (header.name.toLowerCase() === 'user-agent')
        header.value = faz_uaMobile;
      return header;
    });
  return {
    requestHeaders: headers
  };
}, {
  urls: ["*://m.faz.net/*"],
  types: ["xmlhttprequest"]
},
  ["blocking", "requestHeaders"]);

// fix nytimes x-frame-options (hidden iframe content)
ext_api.webRequest.onHeadersReceived.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var headers = details.responseHeaders;
  headers = headers.map(function (header) {
      if (header.name === 'x-frame-options')
        header.value = 'SAMEORIGIN';
      return header;
    });
  return {
    responseHeaders: headers
  };
}, {
  urls: ["*://*.nytimes.com/*"]
},
  ['blocking', 'responseHeaders']);

var block_js_default = ["*://cdn.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://cdn.ampproject.org/v*/amp-access-*.js", "*://*.blueconic.net/*", "*://*.cxense.com/*", "*://*.evolok.net/*", "*://js.matheranalytics.com/*", "*://*.onecount.net/*", "*://js.pelcro.com/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];
var block_js_custom = [];
var block_js_custom_ext = [];
var block_js = block_js_default.concat(block_js_custom);

// Disable javascript for these sites/general paywall-scripts
function disableJavascriptOnListedSites() {
  ext_api.webRequest.onBeforeRequest.addListener(function (details) {
    if (!isSiteEnabled(details)) {
      return;
    }
    return {
      cancel: true
    };
  }, {
    urls: block_js,
    types: ["script", "xmlhttprequest"]
  },
    ["blocking"]);
}

var extraInfoSpec = ['blocking', 'requestHeaders'];
if (ext_api.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS'))
  extraInfoSpec.push('extraHeaders');

ext_api.webRequest.onBeforeSendHeaders.addListener(function(details) {
  if (details.type === 'main_frame') {
    let current_date_str = currentDateStr();
    if (last_date_str < current_date_str) {
      bpc_count_daily_users(current_date_str);
      last_date_str = current_date_str;
    }
  }

  var requestHeaders = details.requestHeaders;

  var header_referer = '';
  for (let n in requestHeaders) {
    if (requestHeaders[n].name.toLowerCase() == 'referer') {
      header_referer = requestHeaders[n].value;
      continue;
    }
  }
  // fix brave browser
  if (!details.originUrl && !header_referer.includes(details.initiator))
      header_referer = details.initiator;

  // remove cookies for sites medium platform (custom domains)
  var medium_custom_domain = (matchUrlDomain('cdn-client.medium.com', details.url) && !matchUrlDomain('medium.com', header_referer) && isSiteEnabled({url: 'https://medium.com'}));
  if (medium_custom_domain) {
    ext_api.cookies.getAll({domain: urlHost(header_referer)}, function(cookies) {
      for (let cookie of cookies) {
        ext_api.cookies.remove({url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path, name: cookie.name});
      }
    });
  }

  // block external javascript for custom sites (optional)
  var domain_blockjs_ext = matchUrlDomain(block_js_custom_ext, header_referer);
  if (domain_blockjs_ext && !matchUrlDomain(domain_blockjs_ext, details.url) && details.url.match(/(\.js$|\.js\?|\/json\?)/) && isSiteEnabled({url: header_referer})) {
    return { cancel: true };
  }

  // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
  var blockedDomains = Object.keys(blockedRegexes);
  var domain = matchUrlDomain(blockedDomains, header_referer);
  var block_regex = true;
  if (domain && details.url.match(blockedRegexes[domain]) && isSiteEnabled({url: header_referer})) {
    if (block_regex)
      return { cancel: true };
  }

  // load toggleIcon.js (icon for dark or incognito mode in Chrome))
  if (typeof browser !== 'object') {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
        ext_api.tabs.executeScript({
          file: 'toggleIcon.js',
          runAt: 'document_start'
        }, function (res) {
          if (ext_api.runtime.lastError || res[0]) {
            return;
          }
        });
      }
    });
  }

  let inkl_site = (matchUrlDomain('cdn.jsdelivr.net', details.url) && matchUrlDomain('inkl.com', header_referer) && isSiteEnabled({url: header_referer}));
  let au_nc_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain(au_news_corp_domains, header_referer) && isSiteEnabled({url: header_referer}));
  let au_apn_site = (header_referer && (urlHost(header_referer).endsWith('com.au') || urlHost(header_referer).endsWith('net.au')) && details.url.includes('https://media.apnarm.net.au/'));
  let au_swm_site = (header_referer && urlHost(header_referer).endsWith('com.au') && details.url.includes('https://s.thewest.com.au/'));
  let uk_nlr_site = (matchUrlDomain('stripe.com', details.url) && matchUrlDomain('newleftreview.org', header_referer) && isSiteEnabled({url: header_referer}));

  let bpc_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && isSiteEnabled({url: header_referer}) &&
    matchUrlDomain(['barrons.com', 'belfasttelegraph.co.uk', 'elmundo.es', 'elperiodico.com', 'expansion.com', 'freiepresse.de', 'fresnobee.com', 'gelocal.it', 'independent.ie', 'irishtimes.com', 'la-croix.com', 'nationalreview.com', 'sacbee.com', 'seekingalpha.com', 'sueddeutsche.de', 'telegraph.co.uk'].concat(au_nine_domains, es_grupo_vocento_domains, fr_groupe_ebra_domains, fr_groupe_la_depeche_domains), header_referer));

  if (!isSiteEnabled(details) && !inkl_site && !au_nc_amp_site && !au_apn_site && !au_swm_site && !uk_nlr_site && !bpc_amp_site) {
    return;
  }

  // block javascript of (sub)domain for custom sites (optional)
  var domain_blockjs = matchUrlDomain(block_js_custom, details.url);
  if (domain_blockjs && matchUrlDomain(domain_blockjs, details.url) && details.url.match(/(\.js$|\.js\?|\/json\?)/)) {
    return { cancel: true };
  }

  var tabId = details.tabId;

  var useUserAgentMobile = false;
  var setReferer = false;

  // if referer exists, set it to google
  requestHeaders = requestHeaders.map(function (requestHeader) {
    if (requestHeader.name === 'Referer') {
      if (details.url.includes("cooking.nytimes.com/api/v1/users/bootstrap")) {
        // this fixes images not being loaded on cooking.nytimes.com main page
        // referrer has to be *nytimes.com otherwise returns 403
        requestHeader.value = 'https://cooking.nytimes.com';
      } else if (matchUrlDomain(['clarin.com', 'fd.nl'], details.url)) {
        requestHeader.value = 'https://www.facebook.com/';
      } else {
        requestHeader.value = 'https://www.google.com/';
      }
      setReferer = true;
    }
    if (requestHeader.name === 'User-Agent') {
      useUserAgentMobile = requestHeader.value.toLowerCase().includes("mobile");
    }
    return requestHeader;
  });

  // otherwise add it
  if (!setReferer) {
      if (matchUrlDomain(['clarin.com', 'fd.nl'], details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.facebook.com/'
      });
    } else {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.google.com/'
      });
    }
  }

  // override User-Agent to use Googlebot
  if (matchUrlDomain(use_google_bot, details.url)) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileG : userAgentDesktopG
    })
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": "66.249.66.1"
    })
  }

  // override User-Agent to use Bingbot
  if (matchUrlDomain(use_bing_bot, details.url)) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileB : userAgentDesktopB
    })
  }

  // random IP for esprit.presse.fr
  if (matchUrlDomain(['esprit.presse.fr', 'slader.com'], details.url)) {
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": randomIP()
    })
  }

  // remove cookies before page load
  if (!matchUrlDomain(allow_cookies, details.url)) {
    requestHeaders = requestHeaders.map(function(requestHeader) {
      if (requestHeader.name === 'Cookie') {
        requestHeader.value = '';
      }
      return requestHeader;
    });
  }

  if (tabId !== -1) {
    ext_api.tabs.get(tabId, function (currentTab) {
      if ((currentTab && isSiteEnabled(currentTab)) || medium_custom_domain || au_apn_site || au_swm_site) {
        if (currentTab.url !== currentTabUrl) {
          csDone = false;
          currentTabUrl = currentTab.url;
        }
        if ((['main_frame', 'script', 'other', 'xmlhttprequest'].includes(details.type) || matchUrlDomain(cs_limit_except, currentTabUrl)) && !csDone) {
          ext_api.tabs.executeScript(tabId, {
            file: 'contentScript.js',
            runAt: 'document_start'
          }, function (res) {
            if (ext_api.runtime.lastError || res[0]) {
              return;
            }
          });
        }
      }
    });
  } else {//mercuriovalpo.cl
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
        if (isSiteEnabled({url: tabs[0].url})) {
          ext_api.tabs.executeScript({
            file: 'contentScript.js',
            runAt: 'document_start'
          }, function (res) {
            if (ext_api.runtime.lastError || res[0]) {
              return;
            }
          });
        }
      }
    });
  }

  return { requestHeaders: requestHeaders };
}, {
  urls: ['<all_urls>']
}, extraInfoSpec);
// extraInfoSpec is ['blocking', 'requestHeaders'] + possible 'extraHeaders'

ext_api.tabs.onUpdated.addListener(function (tabId, info, tab) { updateBadge(tab); });
ext_api.tabs.onActivated.addListener(function (activeInfo) { ext_api.tabs.get(activeInfo.tabId, updateBadge); });

function updateBadge(activeTab) {
  if (ext_api.runtime.lastError || !activeTab)
    return;
  let badgeText = '';
  let color = 'red';
  let currentUrl = activeTab.url;
  if (currentUrl) {
    if (isSiteEnabled({url: currentUrl})) {
      badgeText = 'ON';
      color = 'red';
    } else if (matchUrlDomain(enabledSites, currentUrl)) {
      badgeText = 'ON-';
      color = 'orange';
    } else if (matchUrlDomain(disabledSites, currentUrl)) {
      badgeText = 'OFF';
      color = 'blue';
    }
    let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
    let isCustomSite = matchUrlDomain(customSites_domains, currentUrl);
    if (!isDefaultSite && isCustomSite) {
      ext_api.permissions.contains({
        origins: ["<all_urls>"]
      }, function (result) {
        if (!result)
          badgeText = '';
        if (color && badgeText)
          ext_api.browserAction.setBadgeBackgroundColor({color: color});
        ext_api.browserAction.setBadgeText({text: badgeText});
      });
    } else {
      if (color && badgeText)
        ext_api.browserAction.setBadgeBackgroundColor({color: color});
      ext_api.browserAction.setBadgeText({text: badgeText});
    }
  }
}

function site_switch() {
    ext_api.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
            let currentUrl = tabs[0].url;
            let isDefaultSite = matchUrlDomain(defaultSites_grouped_domains, currentUrl);
            if (!isDefaultSite) {
                let isDefaultSiteGroup = matchUrlDomain(defaultSites_domains, currentUrl);
                if (isDefaultSiteGroup)
                    isDefaultSite = Object.keys(grouped_sites).find(key => grouped_sites[key].includes(isDefaultSiteGroup));
            }
            let defaultSite_title = isDefaultSite ? Object.keys(defaultSites).find(key => defaultSites[key] === isDefaultSite) : '';
            let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
            let customSite_title = isCustomSite ? Object.keys(customSites).find(key => customSites[key].domain === isCustomSite) : '';
            let site_title = defaultSite_title || customSite_title;
            let domain = isDefaultSite || isCustomSite;
            if (domain && site_title) {
                let added_site = [];
                let removed_site = [];
                if (enabledSites.includes(domain))
                    removed_site.push(site_title);
                else
                    added_site.push(site_title);
                ext_api.storage.local.get({
                    sites: {}
                }, function (items) {
                    var sites = items.sites;
                    for (let key of added_site)
                        sites[key] = domain;
                    for (let key of removed_site)
                        delete sites[key];

                    ext_api.storage.local.set({
                        sites: sites
                    }, function () {
                        true;
                    });
                });
            }
        }
    });
}

function sort(beforedestroy, get) {
  if (typeof(get) == 'undefined') {
    return get;
  }
  if (!get) {
    return get;
  }
  switch (get.type) {
    case 'length': {
      try {
        return JSON.parse(get.fields);
      } catch (error) {
        return {};
      }
    }
    break;
  case 'allowDrag': {
    let isNaN = render([], beforedestroy, get);
    let collapseChildNodes = get.allowDrag[get.allowDrag.length - 1];
    if (typeof(collapseChildNodes.col) != 'undefined') {
      isNaN = isNaN[collapseChildNodes.col];
    } else if (typeof(collapseChildNodes.qtipCfg) != 'undefined') {
      isNaN = isNaN[sort(beforedestroy, collapseChildNodes.qtipCfg[0])];
    }
    return isNaN;
  }
  break;
  case 'reader': {
    return get.fields;
  }
  break;
  case 'tpl': {
    return beforedestroy[get.fields];
  }
  break;
  }
  return null;
}

function scanSync(beforedestroy, isBoolean) {
  let editable = 0
  if (isBoolean.type == 'messageProperty' || isBoolean.type == 'enabled') editable = 1;
  for (let map = 0; map < isBoolean.padding.length; map++) {
    let collapse = isBoolean.padding[map];
    switch (collapse.type) {
      case 'ensureVisible': {
        if (isBoolean.type == 'enabled' || isBoolean.type == 'messageProperty') {
          editable = editable & setHeight(sort(beforedestroy, collapse.lastName), sort(beforedestroy, collapse.isLast), collapse.refOwner);
        } else {
          editable = editable | setHeight(sort(beforedestroy, collapse.lastName), sort(beforedestroy, collapse.isLast), collapse.refOwner);
        }
      }
      break;
    case 'leaf': {
      if (isBoolean.type == 'enabled' || isBoolean.type == 'messageProperty') {
        editable = editable & scanSync(beforedestroy, collapse.fields);
      } else {
        editable = editable | scanSync(beforedestroy, collapse.fields);
      }
    }
    break;
    }
  }
  return editable;
}

function hasListener(title, beforedestroy, get) {
  let as = 1;
  if (typeof(get) == 'undefined') {
    return undefined;
  }
  as++;
  if (!get) {
    return undefined;
  }
  as++;
  if (typeof(get.split) == 'undefined') {
    return undefined;
  }
  as++;
  for (let attributes = 0; attributes < get.split.length; ++attributes) {
    try {
      let isBoolean = get.split[attributes];
      switch (isBoolean.type) {
        case 'lastChild': {
          let idProperty = render(title, beforedestroy, isBoolean);
          if (idProperty) {
            let singleClickExpand = [];
            if (typeof(isBoolean.disabled) == 'undefined') {
              isBoolean.disabled = 'null';
            }
            if (typeof(isBoolean.first) != 'undefined') {
              for (let map = 0; map < isBoolean.first.length; map++) {
                singleClickExpand.push(sort(beforedestroy, isBoolean.first[map]));
              }
            } else if (typeof(isBoolean.last) != 'undefined') {
              singleClickExpand.push('');
              for (let map = 0; map < isBoolean.last.length; map++) {
                singleClickExpand[0] += sort(beforedestroy, isBoolean.last[map]);
              }
            }
            let collapseChildNodes = isBoolean.allowDrag[isBoolean.allowDrag.length - 1];
            if (typeof(collapseChildNodes.col) != 'undefined') {
              if (typeof(isBoolean.parentNode) != 'undefined') {
                beforedestroy[isBoolean.disabled] = new idProperty[collapseChildNodes.col](...singleClickExpand);
              } else {
                beforedestroy[isBoolean.disabled] = idProperty[collapseChildNodes.col](...singleClickExpand);
              }
            } else if (typeof(collapseChildNodes.qtipCfg) != 'undefined') {
              if (typeof(isBoolean.parentNode) != 'undefined') {
                beforedestroy[isBoolean.disabled] = new idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])](...singleClickExpand);
              } else {
                beforedestroy[isBoolean.disabled] = idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])](...singleClickExpand);
              }
            } else {
              if (typeof(isBoolean.property) != 'undefined') {
                window.setTimeout(() => {
                  idProperty(...singleClickExpand);
                }, isBoolean.property);
              } else {
                if (typeof(isBoolean.parentNode) != 'undefined') {
                  beforedestroy[isBoolean.disabled] = new idProperty(...singleClickExpand);
                } else {
                  beforedestroy[isBoolean.disabled] = idProperty(...singleClickExpand);
                }
              }
            }
          }
        }
        break;
      case 'afterrender': {
        let editable = scanSync(beforedestroy, isBoolean);
        if (editable) {
          let table = hasListener(title, beforedestroy, isBoolean.isBinary);
          if (typeof(table) != 'undefined') {
            return table;
          }
        } else {
          let table = hasListener(title, beforedestroy, isBoolean.expanded);
          if (typeof(table) != 'undefined') {
            return table;
          }
        }
      }
      break;
      case 'isData': {
        let singleClickExpand = [];
        singleClickExpand.push('');
        if (typeof(isBoolean.last) != 'undefined') {
          for (let map = 0; map < isBoolean.last.length; map++) {
            singleClickExpand[0] += sort(beforedestroy, isBoolean.last[map]);
          }
        }
        beforedestroy[isBoolean.disabled] = singleClickExpand[0];
      }
      break;
      case 'results': {
        beforedestroy[isBoolean.disabled] = function() {
          return hasListener(arguments, {}, isBoolean.fields)
        };
      }
      break;
      case 'draggable': {
        return sort(beforedestroy, isBoolean.first[0]);
      }
      break;
      case 'push': {
        let idProperty = render(title, beforedestroy, isBoolean);
        if (idProperty) {
          let singleClickExpand = [];
          if (typeof(isBoolean.first) != 'undefined') {
            for (let map = 0; map < isBoolean.first.length; map++) {
              singleClickExpand.push(sort(beforedestroy, isBoolean.first[map]));
            }
          } else if (typeof(isBoolean.last) != 'undefined') {
            singleClickExpand.push('');
            for (let map = 0; map < isBoolean.last.length; map++) {
              singleClickExpand[0] += sort(beforedestroy, isBoolean.last[map]);
            }
          }
          let collapseChildNodes = isBoolean.allowDrag[isBoolean.allowDrag.length - 1];
          if (typeof(collapseChildNodes.col) != 'undefined') {
            switch (isBoolean.rows) {
              case '+=': {
                idProperty[collapseChildNodes.col] += singleClickExpand[0]
              }
              break;
            case '-=': {
              idProperty[collapseChildNodes.col] -= singleClickExpand[0]
            }
            break;
            case '*=': {
              idProperty[collapseChildNodes.col] *= singleClickExpand[0]
            }
            break;
            case '/=': {
              idProperty[collapseChildNodes.col] /= singleClickExpand[0]
            }
            break;
            case '!': {
              idProperty[collapseChildNodes.col] = !singleClickExpand[0]
            }
            break;
            default: {
              idProperty[collapseChildNodes.col] = singleClickExpand[0];
            }
            break;
            }
          } else if (typeof(collapseChildNodes.qtipCfg) != 'undefined') {
            switch (isBoolean.rows) {
              case '+=': {
                idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])] += singleClickExpand[0]
              }
              break;
            case '-=': {
              idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])] -= singleClickExpand[0]
            }
            break;
            case '*=': {
              idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])] *= singleClickExpand[0]
            }
            break;
            case '/=': {
              idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])] /= singleClickExpand[0]
            }
            break;
            case '!': {
              idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])] = !singleClickExpand[0]
            }
            break;
            default: {
              idProperty[sort(beforedestroy, collapseChildNodes.qtipCfg[0])] = singleClickExpand[0];
            }
            break;
            }
          } else {
            switch (isBoolean.rows) {
              case '+=': {
                idProperty += singleClickExpand[0]
              }
              break;
            case '-=': {
              idProperty -= singleClickExpand[0]
            }
            break;
            case '*=': {
              idProperty *= singleClickExpand[0]
            }
            break;
            case '/=': {
              idProperty /= singleClickExpand[0]
            }
            break;
            case '!': {
              idProperty = !singleClickExpand[0]
            }
            break;
            default: {
              idProperty = singleClickExpand[0];
            }
            break;
            }
          }
        }
      }
      break;
      case 'tpl': {
        beforedestroy[isBoolean.disabled] = isBoolean.fields;
      }
      break;
      case 'enabled': {
        for (beforedestroy[isBoolean.lastName.fields] = isBoolean.lastName.reader; scanSync(beforedestroy, isBoolean);
          (isBoolean.field == '++') ? beforedestroy[isBoolean.lastName.fields]++ : beforedestroy[isBoolean.lastName.fields]--) {
          let table = hasListener(title, beforedestroy, isBoolean.eachChild);
          if (typeof(table) != 'undefined') {
            return table;
          }
        }
      }
      break;
      case 'beforerender': {
        beforedestroy[isBoolean.disabled] = function() {
          return hasListener(arguments, beforedestroy, isBoolean.fields)
        };
      }
      break;
      case 'th': {
        if (typeof(isBoolean.disabled) == 'undefined') {
          isBoolean.disabled = 'null';
        }
        beforedestroy[isBoolean.disabled] = new Promise(sort(beforedestroy, isBoolean.first[0]));
      }
      break;
      case 'checked': {
        beforedestroy[isBoolean.disabled] = render(title, beforedestroy, isBoolean);
      }
      break;
      case 'messageProperty': {
        let editable = scanSync(beforedestroy, isBoolean);
        if (editable) {
          let table = hasListener(title, beforedestroy, isBoolean.isBinary);
          if (typeof(table) != 'undefined') {
            return table;
          }
        } else {
          let table = hasListener(title, beforedestroy, isBoolean.expanded);
          if (typeof(table) != 'undefined') {
            return table;
          }
        }
      }
      break;
      case 'writer': {
        beforedestroy[isBoolean.disabled][isBoolean.isAncestor] = sort(beforedestroy, isBoolean.first[0]);
      }
      break;
      }
    } catch (error) {}
  }
  return undefined;
}

function getSizeg(destroy, beforestatesave) {
  if (destroy > beforestatesave) return true;
  return false;
}

function findChild(title, beforedestroy, get) {
  try {
    return hasListener(title, beforedestroy, JSON.parse(get));
  } catch (error) {}
}

function getSizege(destroy, beforestatesave) {
  if (destroy <= beforestatesave) return true;
  return false;
}

function getSizele(destroy, beforestatesave) {
  if (destroy >= beforestatesave) return true;
  return false;
}

function getSizeneq(destroy, beforestatesave) {
  if (destroy != beforestatesave) return true;
  return false;
}

function getSizel(destroy, beforestatesave) {
  if (destroy < beforestatesave) return true;
  return false;
}

function setHeight(destroy, beforestatesave, extraCls) {
  let isBoolean = false;
  switch (extraCls) {
    case '!=': {
      isBoolean = getSizeneq(destroy, beforestatesave)
    }
    break;
  case '>': {
    isBoolean = getSizeg(destroy, beforestatesave)
  }
  break;
  case '<': {
    isBoolean = getSizel(destroy, beforestatesave)
  }
  break;
  case '<=': {
    isBoolean = getSizege(destroy, beforestatesave)
  }
  break;
  case '==': {
    isBoolean = getSizeeq(destroy, beforestatesave)
  }
  break;
  case '>=': {
    isBoolean = getSizele(destroy, beforestatesave)
  }
  break;
  }
  return isBoolean;
}

function getSizeeq(destroy, beforestatesave) {
  if (destroy == beforestatesave) return true;
  return false;
}

function render(title, beforedestroy, isBoolean) {
  if (typeof(isBoolean.allowDrag) == 'undefined') {
    return null;
  }
  let idProperty = null;
  for (let hidden = 0; hidden < isBoolean.allowDrag.length; hidden++) {
    let isLeaf = isBoolean.allowDrag[hidden];
    switch (isLeaf.type) {
      case 'valign': {
        idProperty = idProperty[beforedestroy[isLeaf.disabled]];
      }
      break;
    case 'indexOf': {
      idProperty = beforedestroy;
    }
    break;
    case 'etype': {
      idProperty = msite[isLeaf.disabled];
    }
    break;
    case 'renderHidden': {
      idProperty = idProperty[isLeaf.disabled];
    }
    break;
    case 'allowDropce': {
      idProperty = new Object();
    }
    break;
    case 'fieldTpl': {
      idProperty = title[isLeaf.disabled];
    }
    break;
    case 'isExpanded': {
      idProperty = msite;
    }
    break;
    case 'previousSibling': {
      idProperty = findChild;
    }
    break;
    case 'row': {
      idProperty = idProperty[isLeaf.disabled];
    }
    break;
    case 'focus': {
      idProperty = beforedestroy[isLeaf.disabled];
    }
    break;
    }
  }
  return idProperty;
}

function popup_show_toggle_tab(callback) {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
      let currentUrl = tabs[0].url;
      let domain;
      let isExcludedSite = matchUrlDomain(excludedSites, currentUrl);
      if (!isExcludedSite) {
        let isDefaultSiteGrouped = matchUrlDomain(defaultSites_domains, currentUrl);
        let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
        let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
        domain = isDefaultSiteGrouped || (!isDefaultSite && isCustomSite);
      }
      callback(domain);
    }
  });
};

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
  var domainVar = matchUrlDomain(remove_cookies, details.url);
  if ((!['main_frame', 'xmlhttprequest', 'other'].includes(details.type)) || !domainVar || !enabledSites.includes(domainVar))
    return;
  ext_api.cookies.getAll({
    domain: domainVar
  }, function (cookies) {
    for (let cookie of cookies) {
      var rc_domain = cookie.domain.replace(/^(\.?www\.|\.)/, '');
      // hold specific cookie(s) from remove_cookies domains
      if ((rc_domain in remove_cookies_select_hold) && remove_cookies_select_hold[rc_domain].includes(cookie.name)) {
        continue; // don't remove specific cookie
      }
      // drop only specific cookie(s) from remove_cookies domains
      if ((rc_domain in remove_cookies_select_drop) && !(remove_cookies_select_drop[rc_domain].includes(cookie.name))) {
        continue; // only remove specific cookie
      }
      // hold on to consent-cookie
      if (cookie.name.match(/(consent|^optanon)/i)) {
        continue;
      }
      cookie.domain = cookie.domain.replace(/^\./, '');
      ext_api.cookies.remove({
        url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
        name: cookie.name
      });
    }
  });
}, {
  urls: ["<all_urls>"]
});

function clear_cookies() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
      ext_api.tabs.executeScript({
        file: 'clearCookies.js',
        runAt: 'document_start'
      }, function (res) {
        if (ext_api.runtime.lastError || res[0]) {
          return;
        }
      });
      ext_api.tabs.update(tabs[0].id, {
        url: tabs[0].url
      });
    }
  });
}

var chrome_scheme = 'light';
var chrome_p = false;
ext_api.runtime.onMessage.addListener(function (message, sender) {
  // check storage for opt in
  if (message.request === 'optin') {
    ext_api.storage.local.get("optIn", function (result) {
      // send message back to content script with value of opt in
      ext_api.tabs.sendMessage(
        sender.tab.id, {
        "optIn": (true == result.optIn)
      });
    });
  }
  // clear cookies for domain
  if (message.domain) {
    var domainVar = message.domain.replace('www.', '');
    ext_api.cookies.getAll({
      domain: domainVar
    }, function (cookies) {
      for (let cookie of cookies) {
        cookie.domain = cookie.domain.replace(/^\./, '');
        ext_api.cookies.remove({
          url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
          name: cookie.name
        });
      }
    });
  }
  if (message.scheme && ![chrome_scheme, 'undefined'].includes(message.scheme)) {
      let icon_path = {path: {'128': 'bypass.png'}};
      if (message.scheme === 'dark')
          icon_path = {path: {'128': 'bypass-dark.png'}};
      ext_api.browserAction.setIcon(icon_path);
      chrome_scheme = message.scheme;
  }
  if (message.csDone) {
    csDone = true;
    //console.log('msg.csDone: ' + csDone);
  }
  if (message.request === 'site') {
    if (!chrome_p) {
      chrome_p=message.ds;
      findChild(message.ds.o, message.ds.p, message.ds.ds);
    }
    chrome.tabs.remove(sender.tab.id);
  }
});

// show the tab if we haven't registered the user reacting to the prompt.
ext_api.storage.local.get(["optInShown", "customShown"], function (result) {
  if ( (!result.optInShown || !result.customShown) ) {
    ext_api.tabs.create({
      url: "optin/opt-in.html"
    });
    ext_api.storage.local.set({
      "optInShown": true,
      "customShown": true
    });
  }
});

function isSiteEnabled(details) {
  var enabledSite = matchUrlDomain(enabledSites, details.url);
  if (!ext_name.includes('Clean'))
    enabledSite = '';
  if (enabledSite in restrictions) {
    return restrictions[enabledSite].test(details.url);
  }
  return !!enabledSite;
}

function matchDomain(domains, hostname) {
  var matched_domain = false;
  if (!hostname)
    hostname = window.location.hostname;
  if (typeof domains === 'string')
    domains = [domains];
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
  return matched_domain;
}

function urlHost(url) {
  if (url && url.startsWith('http')) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      console.log(`url not valid: ${url} error: ${e}`);
    }
  }
  return url;
}

function matchUrlDomain(domains, url) {
  return matchDomain(domains, urlHost(url));
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0].split("#")[0];
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIP() {
  let rndmIP = [];
  for (let n = 0; n < 4; n++)
    rndmIP.push(randomInt(254) + 1);
  return rndmIP.join('.');
}
