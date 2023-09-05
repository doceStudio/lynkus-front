window.Webflow ||= [];
window.fsAttributes = window.fsAttributes || [];
const jobPageUrl = "lynkus.fr/offres-emplois";
const focusPageRootUrl = "lynkus.fr/offre";
const apiURL =
  "https://lynkus-api.netlify.app/.netlify/functions/fetchVacancies";
const homePageUrl = "https://www.lynkus.fr/";
const prefix = "data";
const prefixSlider = "data-slider";
const regions = [
  {
    id: "1",
    name: "Auvergne-Rhone-Alpes",
    departements: [
      "01",
      "03",
      "07",
      "15",
      "26",
      "38",
      "42",
      "43",
      "63",
      "69",
      "73",
      "74",
    ],
  },
  {
    id: "2",
    name: "Bourgogne-Franche-Comte",
    departements: ["21", "25", "39", "58", "70", "71", "89", "90"],
  },
  { id: "3", name: "Bretagne", departements: ["22", "29", "35", "56"] },
  {
    id: "4",
    name: "Centre-Val de Loire",
    departements: ["18", "28", "36", "37", "41", "45"],
  },
  { id: "5", name: "Corse", departements: ["2A"] },
  {
    id: "6",
    name: "Grand Est",
    departements: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
  },
  {
    id: "7",
    name: "Hauts-de-France",
    departements: ["02", "59", "60", "62", "80"],
  },
  {
    id: "8",
    name: "Ile-de-France",
    departements: ["75", "77", "78", "91", "92", "93", "94", "95"],
  },
  {
    id: "9",
    name: "Normandie",
    departements: ["14", "27", "50", "61", "76"],
  },
  {
    id: "10",
    name: "Nouvelle-Aquitaine",
    departements: [
      "16",
      "17",
      "19",
      "23",
      "24",
      "33",
      "40",
      "47",
      "64",
      "79",
      "86",
      "87",
    ],
  },
  {
    id: "11",
    name: " Occitanie",
    departements: [
      "09",
      "11",
      "12",
      "30",
      "31",
      "32",
      "34",
      "46",
      "48",
      "65",
      "66",
      "81",
      "82",
    ],
  },
  {
    id: "12",
    name: "Pays de la Loire",
    departements: ["44", "49", "53", "72", "85"],
  },
  {
    id: "13",
    name: "Provence-Alpes-Cote d Azur",
    departements: ["04", "05", "06", "13", "83", "84"],
  },
  { id: "14", name: "Guadeloupe", departements: ["971"] },
  { id: "15", name: "Martinique", departements: ["972"] },
  { id: "16", name: "Guyane", departements: ["973"] },
  { id: "17", name: "Mayotte", departements: ["976"] },
];
const SELECTORS = {
  title: `[${prefix}="title"]`,
  contract: `[${prefix}="contract"]`,
  town: `[${prefix}="town"]`,
  region: `[${prefix}="region"]`,
  postalCode: `[${prefix}="postalCode"]`,
  cpRegion: `[${prefix}="cpRegion"]`,
  metier: `[${prefix}="metier"]`,
  date: `[${prefix}="date"]`,
  dateNumber: `[${prefix}="date-us"]`,
  experience: `[${prefix}="experience"]`,
  experienceWrapper: `[${prefix}="exp-wrapper"]`,
  jobButton: `[${prefix}="button"]`,
  loader: `[${prefix}="loader"]`,
  locationFilter: `[${prefix}="location-filter"]`,
  contractFilter: `[${prefix}="contract-filter"]`,
  experienceFilter: `[${prefix}="exp-filter"]`,
  entreprise: `[${prefix}="entreprise"]`,
  profil: `[${prefix}="profil"]`,
  poste: `[${prefix}="poste"]`,
  //SLIDER ATT
  sliderTitle: `[${prefixSlider}="title"]`,
  sliderContract: `[${prefixSlider}="contract"]`,
  sliderMetier: `[${prefixSlider}="metier"]`,
  sliderDate: `[${prefixSlider}="date"]`,
  sliderPostalCode: `[${prefixSlider}="postalCode"]`,
  sliderJobButton: `[${prefixSlider}="button"]`,
  sliderLoader: `[${prefix}="sliderLoader"]`,
};
const loader = document.querySelector(SELECTORS.loader);
const sliderLoader = document.querySelector(SELECTORS.sliderLoader);

const renderPostDom = (selectorName, apiPropo) => {
  if (selectorName && apiPropo) {
    selectorName.innerText = "";
    const parser = new DOMParser();
    const desc = parser.parseFromString(apiPropo, "text/html");
    desc.body.childNodes.forEach((el) => {
      selectorName.append(el);
    });
  } else {
    hideElement(selectorName.closest(".focus-content-wrapper"), true);
  }
};

const enableCover = (job) => {
  const jobMetier = getAttributeValue(job, "metier");
  const activeCover = document.querySelector(`[data-cat="${jobMetier}"]`);
  hideElement(activeCover, false);
};
const filterInternalJobs = (allJobs, isInternal) => {
  let value;
  isInternal === true ? value === "Oui" : value === "Non";
  const filteredJobs = allJobs.filter((job) => {
    const jobVal = getAttributeValue(job, "offre_lynkus_interne");
    if (isInternal) {
      return jobVal === "Oui";
    } else {
      return jobVal !== "Oui";
    }
  });
  return filteredJobs;
};
const getURLParams = (query) => {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get(query);
};
const hideElement = (element, hidden) => {
  if (hidden) {
    element.setAttribute("data-hidden", "true");
  } else {
    element.removeAttribute("data-hidden");
  }
};
const formatDate = (dateString, lang) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  let formatedDate;
  lang === "fr"
    ? (formatedDate = `${day}/${month}/${year}`)
    : (formatedDate = `${year}${month}${day}`);
  return formatedDate;
};

const getAttributeValue = (job, propertyName) => {
  const jobAttributes = job.attributes;
  const filteredAttr = jobAttributes.filter((attr) => {
    return attr.name.toString() == propertyName.toString();
  });
  const attrArray = filteredAttr[0];
  if (attrArray && attrArray.value) return attrArray.value;
  return;
};
const fetchOffers = async () => {
  try {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    const response = await fetch(`${apiURL}`, { headers, method: "GET" });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const speakers = await response.json();
    return speakers;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON response from API");
    }
    throw new Error(`Failed to fetch speakers from API: ${error.message}`);
  }
};

const populateAboutOffer = (job) => {
  const title = document.querySelector(SELECTORS.title);
  const contract = document.querySelector(SELECTORS.contract);
  const town = document.querySelector(SELECTORS.town);
  const metier = document.querySelector(SELECTORS.metier);
  const date = document.querySelector(SELECTORS.date);
  const entreprise = document.querySelector(SELECTORS.entreprise);
  const profil = document.querySelector(SELECTORS.profil);
  const poste = document.querySelector(SELECTORS.poste);
  const applyButton = document.querySelector(SELECTORS.jobButton);
  if (title && job.title) {
    title.innerText = job.title;
    document.title = `Offre d'emploi Lynkus : ${job.title}`;
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", `Offre d'emploi Lynkus : ${job.title}`);
    document
      .querySelector('meta[property="twitter:title"]')
      .setAttribute("content", `Offre d'emploi Lynkus : ${job.title}`);
  } else {
    hideElement(title.closest(".offre_desc-item"), true);
  }
  if (contract && job.contract_type_abbreviation) {
    contract.innerText = job.contract_type_abbreviation;
  } else {
    hideElement(contract.closest(".offre_desc-item"), true);
  }
  if (town && job.town) {
    town.innerText = job.town;
  } else {
    hideElement(town.closest(".offre_desc-item"), true);
  }
  const jobMetier = getAttributeValue(job, "metier");
  if (jobMetier) {
    metier.innerText = jobMetier;
    enableCover(job);
  } else {
    hideElement(metier.closest(".offre_desc-item"), true);
  }
  if (date && job.last_publication_date) {
    const formatedDate = formatDate(job.last_publication_date, "fr");
    date.innerText = formatedDate;
  }
  if (applyButton && job.apply_web_url) {
    applyButton.href = job.apply_web_url;
  }
  renderPostDom(entreprise, job.employer_description);
  renderPostDom(poste, job.position_description);
  renderPostDom(profil, job.profile_description);
};
const createNewItem = (job, templateElement) => {
  const newItem = templateElement.cloneNode(true);
  const title = newItem.querySelector(SELECTORS.title);
  const contract = newItem.querySelector(SELECTORS.contract);
  const town = newItem.querySelector(SELECTORS.town);
  const postalCode = newItem.querySelector(SELECTORS.postalCode);
  const metier = newItem.querySelector(SELECTORS.metier);
  const date = newItem.querySelector(SELECTORS.date);
  const dateNumber = newItem.querySelector(SELECTORS.dateNumber);
  const experience = newItem.querySelector(SELECTORS.experience);
  const region = newItem.querySelector(SELECTORS.region);
  const cpRegion = newItem.querySelector(SELECTORS.cpRegion);
  const jobButton = newItem.querySelector(SELECTORS.jobButton);
  jobButton.href = `https://${focusPageRootUrl}?id=${job.id}`;
  if (title && job.title) {
    title.innerText = job.title;
  } else {
    if (title) hideElement(title.closest(".content-wrapper"), true);
  }
  if (town && job.town) {
    town.innerText = job.town;
  } else {
    if (town) hideElement(town.closest(".offre_desc-item"), true);
  }
  const getRegion = (zipcode) => {
    let slicedZipCode = zipcode.slice(0, 2);
    if (slicedZipCode === "97") {
      slicedZipCode = zipcode.slice(0, 3);
    }
    const matchedRegion = regions.find((region) =>
      region.departements.includes(slicedZipCode)
    );
    return matchedRegion;
  };
  if (job.zipcode && postalCode) {
    const jobZipcode = job.zipcode;
    postalCode.innerText = jobZipcode;
    const matchedRegion = getRegion(job.zipcode);
    if (matchedRegion) {
      if (region) region.innerText = matchedRegion.name;
    }
  } else {
    if (region) hideElement(region.closest(".offre_desc-item"), true);
  }
  if (contract && job.contract_type_name) {
    const jobContract = job.contract_type_name;
  } else {
    if (contract) hideElement(contract.closest(".offre_desc-item"), true);
  }
  const jobExperience = getAttributeValue(job, "experience");
  if (experience && jobExperience) {
    experience.innerText = jobExperience;
  } else {
    if (experience) hideElement(experience.closest(".offre_desc-item"), true);
  }
  const jobMetier = getAttributeValue(job, "metier");
  if (metier && jobMetier) {
    metier.innerText = jobMetier;
  } else {
    if (metier) hideElement(metier.closest(".offre_desc-item"), true);
  }
  if (date && job.last_publication_date) {
    const formatedDate = formatDate(job.last_publication_date, "fr");
    date.innerText = formatedDate;
  }
  if (dateNumber && job.last_publication_date) {
    const formatedDate = formatDate(job.last_publication_date, "us");
    dateNumber.innerText = formatedDate;
  }
  return newItem;
};
const sliderInit = async (isInternal) => {
  const itemTemplate = document
    .querySelector(".home-offre-item")
    .cloneNode(true);
  const wrapper = document.querySelector(".layout-home-offre");
  const sliderParams = {
    slidesToShow: 2.65,
    slidesToScroll: 1,
    autoplay: false,
    infinite: false,
    arrows: true,
    nextArrow:
      '<button type="button" class="slick-next mobile-slider-arrow right"><svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.50023 16.9998L0.0668945 15.5664L6.66689 8.96644L0.0668945 2.36644L1.50023 0.933105L9.53356 8.96644L1.50023 16.9998Z" fill="currentcolor"/></svg></button>',
    prevArrow:
      '<button type="button" class="slick-prev mobile-slider-arrow left"><svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.49977 16.9998L9.93311 15.5664L3.33311 8.96644L9.93311 2.36644L8.49977 0.933105L0.466439 8.96644L8.49977 16.9998Z" fill="currentcolor"/></svg></button>',
    responsive: [
      {
        breakpoint: 1075,
        settings: {
          slidesToShow: 2,
          speed: 8000,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1.15,
          slidesToScroll: 1,
          autoplay: false,
          infinite: false,
        },
      },
    ],
  };
  const allJobs = await fetchOffers();
  wrapper.innerHTML = "";
  const jobsToDisplay = filterInternalJobs(allJobs, isInternal);
  const sortedJobs = jobsToDisplay.sort((job1, job2) => {
    return (
      new Date(job2.last_publication_date) -
      new Date(job1.last_publication_date)
    );
  });
  let i = 0;
  const newItems = jobsToDisplay.map((eachJob) => {
    if (i < 5) {
      createSliderItem(eachJob, itemTemplate, wrapper);
      i++;
    }
  });
  $(".layout-home-offre").slick(sliderParams);
  if (sliderLoader) hideElement(sliderLoader,true);
};

const nousRejoindreInit = async () => {
  const itemTemplate = document
    .querySelector(".home-offre-item")
    .cloneNode(true);
  const wrapper = document.querySelector(".layout-home-offre .slick-track");
  wrapper.innerHTML = "";
  const allJobs = await fetchOffers();
  const jobsToDisplay = filterInternalJobs(allJobs, "Non");
  let i = 0;
  const newItems = jobsToDisplay.map((eachJob) => {
    if (i < 5) {
      createSliderItem(eachJob, itemTemplate, wrapper);
      i++;
    }
  });
};

const classicInit = async (lists, isInternalOffer) => {
  const jobListInstance = lists[0];
  const [item] = jobListInstance.items;
  const allJobs = await fetchOffers();
  const jobsToDisplay = filterInternalJobs(allJobs, isInternalOffer);
  const itemTemplateElement = item.element;
  jobListInstance.clearItems();
  const newItems = jobsToDisplay.map((eachJob) =>
    createNewItem(eachJob, itemTemplateElement)
  );
  await jobListInstance.addItems(newItems);
  const blocks = document.querySelectorAll(".filter-row");
  blocks.forEach((block, i) => {
    if (i !== 0) block.classList.remove("is-active");
  });
   if (loader) hideElement(loader, true);
};
const createSliderItem = (job, templateItem, wrapper) => {
  const newItem = templateItem.cloneNode(true);
  const title = newItem.querySelector(SELECTORS.sliderTitle);
  const contract = newItem.querySelector(SELECTORS.sliderContract);
  const metier = newItem.querySelector(SELECTORS.sliderMetier);
  const date = newItem.querySelector(SELECTORS.sliderDate);
  const postalCode = newItem.querySelector(SELECTORS.sliderPostalCode);
  const applyButton = newItem.querySelector(SELECTORS.sliderJobButton);
  applyButton.setAttribute("href", `${focusPageRootUrl}?id=${job.id}`);
  if (title) title.innerText = job.title;
  if (contract) contract.innerText = job.contract_type_abbreviation;
  const jobMetier = getAttributeValue(job, "metier");
  if (metier) metier.innerText = jobMetier;
  if (postalCode) postalCode.innerText = job.zipcode;
  if (date) {
    const formatedDate = formatDate(job.last_publication_date, "fr");
    date.innerText = formatedDate;
  }
  wrapper.append(newItem);
};

const focusOfferInit = async (jobId) => {
  if (!jobId) return window.location.replace(`https://www.${jobPageUrl}`);
  const allJobs = await fetchOffers();
  const filteredJob = allJobs.filter((job) => {
    return parseInt(job.id) === parseInt(jobId);
  });
  const selectedJob = filteredJob[0];
  populateAboutOffer(selectedJob);
  if (loader) hideElement(loader, true);
};

window.Webflow.push(() => {
  (async () => {
    const url = document.URL;
    const jobId = getURLParams("id");
    if (url.includes(jobPageUrl)) {
      window.fsAttributes.push([
        "cmsload",
        async (listInstances) => {
          classicInit(listInstances, false);
        },
      ]);
    } else if (url === homePageUrl) {
      sliderInit(false);
    } else if (url.includes(focusPageRootUrl)) {
      focusOfferInit(jobId);
      sliderInit(false);
    } else {
      window.fsAttributes.push([
        "cmsload",
        async (listInstances) => {
          classicInit(listInstances, true);
        },
      ]);
    }
    if (sliderLoader) hideElement(sliderLoader,true);
  })();
});
